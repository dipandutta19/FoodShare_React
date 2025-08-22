const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your_super_secret_jwt_key'; // CHANGE THIS IN PRODUCTION

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodshare-db')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Combined User Schema
const UserSchema = new mongoose.Schema({
    accountType: { type: String, required: true, enum: ['NGO', 'Canteen'] },
    orgName: { type: String, required: function() { return this.accountType === 'NGO'; } },
    regNumber: { type: String, required: function() { return this.accountType === 'NGO'; } },
    about: { type: String, required: false },
    canteenName: { type: String, required: function() { return this.accountType === 'Canteen'; } },
    surplusCapacity: { type: Number, required: function() { return this.accountType === 'Canteen'; } },
    operationalHours: { type: String, required: function() { return this.accountType === 'Canteen'; } },
    contactPerson: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Post Schema to manage food posts
const PostSchema = new mongoose.Schema({
    canteenId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    canteenName: { type: String, required: true },
    items: { type: String, required: true },
    portions: { type: Number, required: true },
    readyBy: { type: Date, required: true },
    location: { type: String, required: true },
    dietary: [String],
    contact: { type: String, required: true },
    notes: String,
    claimedBy: {
        ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        ngoName: String,
        phone: String,
        time: Date
    },
    status: { type: String, enum: ['open', 'claimed', 'completed', 'expired'], default: 'open' },
    createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', PostSchema);

// Middlewares
app.use(cors());
app.use(express.json());

// Auth Middleware
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Authentication failed. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

// Registration Route
app.post('/register', async (req, res) => {
    try {
        const {
            accountType, email, password,
            orgName, regNumber, about,
            canteenName, surplusCapacity, operationalHours,
            contactPerson, phoneNumber, address, city, state, country
        } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            accountType, email, password: hashedPassword,
            orgName, regNumber, about,
            canteenName, surplusCapacity, operationalHours,
            contactPerson, phoneNumber, address, city, state, country
        });

        await user.save();

        const token = jwt.sign({ id: user._id, accountType: user.accountType }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'Registration successful!', token });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
        }
        res.status(400).json({ message: 'Error registering user', error });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, accountType: user.accountType }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Post routes
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ readyBy: 1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

app.post('/posts', auth, async (req, res) => {
    if (req.user.accountType !== 'Canteen') {
        return res.status(403).json({ message: 'Forbidden. Only canteens can create posts.' });
    }
    try {
        const newPost = new Post({ ...req.body, canteenId: req.user.id });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ message: 'Error creating post', error });
    }
});

app.put('/posts/:id/claim', auth, async (req, res) => {
    if (req.user.accountType !== 'NGO') {
        return res.status(403).json({ message: 'Forbidden. Only NGOs can claim posts.' });
    }
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.status !== 'open') {
            return res.status(404).json({ message: 'Post not found or already claimed.' });
        }
        const claimedBy = { ngoId: req.user.id, ngoName: req.body.ngoName, phone: req.body.phone, time: new Date() };
        post.status = 'claimed';
        post.claimedBy = claimedBy;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error during claim process' });
    }
});

app.put('/posts/:id/complete', auth, async (req, res) => {
    if (req.user.accountType !== 'Canteen') {
        return res.status(403).json({ message: 'Forbidden. Only canteens can complete posts.' });
    }
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.status !== 'claimed') {
            return res.status(404).json({ message: 'Post not found or not claimed.' });
        }
        post.status = 'completed';
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error during completion process' });
    }
});

app.delete('/posts/:id', auth, async (req, res) => {
    if (req.user.accountType !== 'Canteen') {
        return res.status(403).json({ message: 'Forbidden. Only canteens can delete posts.' });
    }
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during deletion' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
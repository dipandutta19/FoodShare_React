import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

function Modal({ title, content, isSuccess, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-sm text-center"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-bold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {title}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5"/>
          </button>
        </div>
        <p className="text-gray-700">{content}</p>
      </motion.div>
    </motion.div>
  );
}

const Register = ({ onRegister, onLoginClick, onBackClick, initialAccountType }) => {
  const [form, setForm] = useState({
    accountType: initialAccountType || 'NGO',
    email: '',
    password: '',
    confirm_password: '',
    contactPerson: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    // NGO specific
    orgName: '',
    regNumber: '',
    about: '',
    // Canteen specific
    canteenName: '',
    surplusCapacity: '',
    operationalHours: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const auth = getAuth();
  const db = getFirestore();
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  
  // Update form state if initialAccountType changes
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      accountType: initialAccountType || 'NGO'
    }));
  }, [initialAccountType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validatePasswords = () => {
    return form.password === form.confirm_password;
  };

  const validateForm = () => {
    const requiredFields = [
      'email', 'password', 'confirm_password', 'contactPerson',
      'phoneNumber', 'address', 'city', 'state', 'country'
    ];
    if (form.accountType === 'NGO') {
      requiredFields.push('orgName', 'regNumber');
    } else {
      requiredFields.push('canteenName', 'surplusCapacity', 'operationalHours');
    }

    const missingFields = requiredFields.filter(field => !form[field]);

    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.map(f => {
        // Simple human-readable conversion
        return f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      }).join(', ');
      setMessage(`The following fields are required: ${missingFieldsString}`);
      setIsSuccess(false);
      setShowModal(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setShowModal(false);

    if (!validateForm()) {
      return;
    }

    if (!validatePasswords()) {
      setMessage("Passwords do not match. Please try again.");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    try {
        // Create user with email and password using Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        const user = userCredential.user;

        // Prepare user data to be saved to Firestore
        const userData = {
            uid: user.uid,
            accountType: form.accountType,
            email: form.email,
            contactPerson: form.contactPerson,
            phoneNumber: form.phoneNumber,
            address: form.address,
            city: form.city,
            state: form.state,
            country: form.country,
            createdAt: new Date().toISOString(),
        };

        if (form.accountType === 'NGO') {
            userData.orgName = form.orgName;
            userData.regNumber = form.regNumber;
            userData.about = form.about;
        } else {
            userData.canteenName = form.canteenName;
            userData.surplusCapacity = form.surplusCapacity;
            userData.operationalHours = form.operationalHours;
        }

        // Save the user data in a private Firestore collection
        const userDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/userProfile/profile`);
        await setDoc(userDocRef, userData);

        setMessage("Registration successful!");
        setIsSuccess(true);
        setShowModal(true);
        setTimeout(onRegister, 1500);
    } catch (error) {
        console.error('Registration failed:', error);
        if (error.code === 'auth/email-already-in-use') {
            setMessage('This email is already in use. Please use a different email or log in.');
        } else {
            setMessage('An error occurred. Please try again later.');
        }
        setIsSuccess(false);
        setShowModal(true);
    }
  };

  const isNGO = form.accountType === 'NGO';

  return (
    <div className="flex justify-center items-center py-10 bg-gray-100 p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl relative"
      >
        <button onClick={onBackClick} type="button" className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-200 transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">Register as a new user</h2>
        <div className="flex justify-center mb-6">
          <button
            type="button"
            className={`px-4 py-2 rounded-l-lg border-2 font-medium ${isNGO ? 'bg-[#54d22d] text-white border-[#54d22d]' : 'bg-gray-200 text-gray-700 border-gray-200'}`}
            onClick={() => setForm(prev => ({ ...prev, accountType: 'NGO' }))}
          >
            NGO
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-r-lg border-2 font-medium ${!isNGO ? 'bg-[#54d22d] text-white border-[#54d22d]' : 'bg-gray-200 text-gray-700 border-gray-200'}`}
            onClick={() => setForm(prev => ({ ...prev, accountType: 'Canteen' }))}
          >
            Canteen
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Fields */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-3">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label>
                <div className="text-sm text-gray-600 mb-1">Email</div>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 rounded-md border" />
              </label>
              <label>
                <div className="text-sm text-gray-600 mb-1">Contact Person</div>
                <input type="text" name="contactPerson" value={form.contactPerson} onChange={handleChange} required className="w-full px-3 py-2 rounded-md border" />
              </label>
              <label>
                <div className="text-sm text-gray-600 mb-1">Phone Number</div>
                <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required className="w-full px-3 py-2 rounded-md border" />
              </label>
              <label>
                <div className="text-sm text-gray-600 mb-1">Password</div>
                <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required className="w-full px-3 py-2 rounded-md border" />
              </label>
              <label>
                <div className="text-sm text-gray-600 mb-1">Confirm Password</div>
                <input type={showPassword ? "text" : "password"} name="confirm_password" value={form.confirm_password} onChange={handleChange} required className="w-full px-3 py-2 rounded-md border" />
              </label>
            </div>
            <div className="mt-4 flex items-center justify-start">
              <input
                type="checkbox"
                id="show-password"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="w-4 h-4 text-[#54d22d] rounded"
              />
              <label htmlFor="show-password" className="ml-2 text-sm text-gray-600">
                Show Password
              </label>
            </div>
          </div>

          {/* Account-Specific Fields */}
          {isNGO ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-3">NGO Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label>
                  <div className="text-sm text-gray-600 mb-1">Organization Name</div>
                  <input type="text" name="orgName" value={form.orgName} onChange={handleChange} required className="w-full px-3 py-2 rounded-md border" />
                </label>
                <label>
                  <div className="text-sm text-gray-600 mb-1">Registration Number</div>
                  <input type="text" name="regNumber" value={form.regNumber} onChange={handleChange} required className="w-full px-3 py-2 rounded-md border" />
                </label>
                <label className="md:col-span-2">
                  <div className="text-sm text-gray-600 mb-1">About Your NGO</div>
                  <textarea name="about" value={form.about} onChange={handleChange} className="w-full px-3 py-2 rounded-md border" rows="3"></textarea>
                </label>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-3">Canteen Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label>
                  <div className="text-sm text-gray-600 mb-1">Canteen Name</div>
                  <input type="text" name="canteenName" value={form.canteenName} onChange={handleChange} required className="w-full px-3 py-2 rounded-md border" />
                </label>
                <label>
                  <div className="text-sm text-gray-600 mb-1">Surplus Capacity (portions)</div>
                  <input type="number" name="surplusCapacity" value={form.surplusCapacity} onChange={handleChange} required className="w-full px-3 py-2 rounded-md border" />
                </label>
                <label className="md:col-span-2">
                  <div className="text-sm text-gray-600 mb-1">Operational Hours</div>
                  <input type="text" name="operationalHours" value={form.operationalHours} onChange={handleChange} required className="w-full px-3 py-2 rounded-md border" />
                </label>
              </div>
            </motion.div>
          )}

          {/* Address Fields */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-3">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label>
                <div className="text-sm text-gray-600 mb-1">Address</div>
                <input type="text" name="address" value={form.address} onChange={handleChange} required className="w-full px-3 py-2 rounded-md border" />
              </label>
              <label>
                <div className="text-sm text-gray-600 mb-1">City</div>
                <input type="text" name="city" value={form.city} onChange={handleChange} required className="w-full px-3 py-2 rounded-md border" />
              </label>
              <label>
                <div className="text-sm text-gray-600 mb-1">State</div>
                <input type="text" name="state" value={form.state} onChange={handleChange} required className="w-full px-3 py-2 rounded-md border" />
              </label>
              <label>
                <div className="text-sm text-gray-600 mb-1">Country</div>
                <input type="text" name="country" value={form.country} onChange={handleChange} required className="w-full px-3 py-2 rounded-md border" />
              </label>
            </div>
          </div>
          
          <div className="md:col-span-2 flex justify-between items-center mt-6">
            <button type="button" onClick={onLoginClick} className="text-sm text-blue-500 hover:underline">
              Already have an account? Login
            </button>
            <button type="submit" className="px-6 py-2 rounded-md bg-[#54d22d] text-white hover:bg-green-700 transition duration-300">
              Register
            </button>
          </div>
        </form>
      </motion.div>
      <AnimatePresence>
        {showModal && (
          <Modal
            title={isSuccess ? "Success!" : "Error"}
            content={message}
            isSuccess={isSuccess}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;

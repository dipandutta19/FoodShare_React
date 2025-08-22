import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Utensils, HandHeart, MapPin, Clock, Trash2, CheckCircle2, X, Filter, RefreshCcw, Search, Phone, Info, CheckSquare, CalendarDays, LogOut } from "lucide-react";
// Corrected import path to use CDN link
import { collection, query, onSnapshot, doc, setDoc, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ---- Utilities
const nowISO = () => new Date().toISOString();
const inFuture = (iso) => new Date(iso).getTime() > Date.now();

// Renamed and updated to use Firebase Firestore
function usePosts(db, user) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  useEffect(() => {
    if (!db || !user) return;

    setLoading(true);
    setError(null);

    // Fetch public posts data
    const postsCollectionRef = collection(db, `artifacts/${appId}/public/data/posts`);

    const q = query(postsCollectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        ...doc.data(),
        _id: doc.id
      }));
      setPosts(fetchedPosts);
      setLoading(false);
    }, (err) => {
      console.error("Failed to fetch posts:", err);
      setError("Failed to fetch posts.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, user]);

  return { posts, setPosts, loading, error };
}

// User data hook to fetch profile from Firestore
function useUserProfile(db, user) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';


  useEffect(() => {
    if (!db || !user) return;
    const docRef = doc(db, `artifacts/${appId}/users/${user.uid}/userProfile/profile`);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        console.log("No profile document found!");
        setProfile(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("Failed to fetch user profile:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, user]);

  return { profile, loading };
}


const Badge = ({ children }) => (
  <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 border border-slate-200">
    {children}
  </span>
);

const Pill = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-sm border transition ${
      active
        ? "bg-[#54d22d] text-white border-[#54d22d]"
        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
    }`}
  >
    {children}
  </button>
);

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

export default function FoodLink({ db, user, onLogout }) {
  const { posts, loading, error } = usePosts(db, user);
  const { profile, loading: profileLoading } = useUserProfile(db, user);
  const [showNew, setShowNew] = useState(false);
  const [query, setQuery] = useState("");
  const [dietFilter, setDietFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("open");
  const [toast, setToast] = useState(null);

  const role = profile?.accountType?.toLowerCase() || 'ngo';

  const filtered = useMemo(() => {
    return posts
      .filter((p) => (statusFilter === "all" ? true : p.status === statusFilter))
      .filter((p) =>
        dietFilter === "all" ? true : p.dietary?.includes(dietFilter)
      )
      .filter((p) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          p.canteenName.toLowerCase().includes(q) ||
          p.items.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(a.readyBy) - new Date(b.readyBy));
  }, [posts, query, dietFilter, statusFilter]);

  const openCount = posts.filter((p) => p.status === "open").length;

  const handleClaim = async (postId, ngoName, phone) => {
    try {
      const postRef = doc(db, `artifacts/${appId}/public/data/posts`, postId);
      await updateDoc(postRef, {
        status: 'claimed',
        claimedBy: { ngoName, phone, time: nowISO() }
      });
      setToast({ type: "success", msg: "Post claimed. Contact the canteen to coordinate pickup." });
    } catch (e) {
      console.error("Failed to claim post:", e);
      setToast({ type: "error", msg: "Failed to claim post." });
    }
  };

  const handleComplete = async (postId) => {
    try {
      const postRef = doc(db, `artifacts/${appId}/public/data/posts`, postId);
      await updateDoc(postRef, {
        status: 'completed'
      });
      setToast({ type: "success", msg: "Pickup marked as completed." });
    } catch (e) {
      console.error("Failed to mark complete:", e);
      setToast({ type: "error", msg: "Failed to mark as completed." });
    }
  };

  const handleDelete = async (postId) => {
    try {
      const postRef = doc(db, `artifacts/${appId}/public/data/posts`, postId);
      await deleteDoc(postRef);
      setToast({ type: "info", msg: "Post deleted." });
    } catch (e) {
      console.error("Failed to delete post:", e);
      setToast({ type: "error", msg: "Failed to delete post." });
    }
  };

  const handleCreatePost = async (data) => {
    try {
      const postsCollectionRef = collection(db, `artifacts/${appId}/public/data/posts`);
      await addDoc(postsCollectionRef, {
        ...data,
        createdAt: nowISO(),
        status: "open",
        postedBy: user.uid,
      });
      setShowNew(false);
      setToast({ type: "success", msg: "Surplus post published." });
    } catch (e) {
      console.error("Failed to create post:", e);
      setToast({ type: "error", msg: "Failed to create post." });
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-4 text-[#121a0f]">
            <Utensils className="w-6 h-6" />
            <h2 className="text-xl font-semibold">FoodShare</h2>
          </div>
          <span className="ml-auto" />
          <button onClick={onLogout} type="button" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-slate-600 border border-slate-200 hover:bg-slate-100 transition">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Badge>
              <div className="flex items-center gap-1"><HandHeart className="w-3.5 h-3.5"/> {openCount} open posts</div>
            </Badge>
          </div>

          <div className="flex items-center gap-2 md:ml-auto w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="w-4 h-4 absolute left-2 top-2.5 text-slate-400"/>
              <input
                className="w-full md:w-72 pl-8 pr-3 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#54d22d]/50"
                placeholder="Search canteen, item, or location"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Pill active={dietFilter === "all"} onClick={() => setDietFilter("all")}>All diets</Pill>
              <Pill active={dietFilter === "veg"} onClick={() => setDietFilter("veg")}>Veg</Pill>
              <Pill active={dietFilter === "no-onion-garlic"} onClick={() => setDietFilter("no-onion-garlic")}>No Onion/Garlic</Pill>
              <Pill active={dietFilter === "vegan"} onClick={() => setDietFilter("vegan")}>Vegan</Pill>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500"/>
              <select
                className="px-3 py-2 rounded-xl border bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="open">Open</option>
                <option value="claimed">Claimed</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
        </div>

        {role === "canteen" && (
          <div className="mb-5">
            <button
              onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#54d22d] text-white hover:bg-green-700 shadow-sm"
            >
              <Plus className="w-4 h-4"/> New Surplus Post
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((p) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <PostCard
                  post={p}
                  role={role}
                  onClaim={handleClaim}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                  currentUserId={user?.uid}
                  profile={profile}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <EmptyState role={role} onNew={() => setShowNew(true)} />
        )}
      </main>

      <Footer />

      <AnimatePresence>
        {showNew && (
          <NewPostModal
            onClose={() => setShowNew(false)}
            onCreate={handleCreatePost}
          />
        )}
      </AnimatePresence>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function PostCard({ post, role, onClaim, onComplete, onDelete, currentUserId, profile }) {
  const timeLeft = useMemo(() => {
    const ms = new Date(post.readyBy).getTime() - Date.now();
    if (ms <= 0) return "expired";
    const mins = Math.round(ms / 60000);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const rmins = mins % 60;
    return `${hrs}h ${rmins}m`;
  }, [post.readyBy]);

  const statusColor = {
    open: "bg-emerald-50 text-emerald-700 border-emerald-200",
    claimed: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-slate-50 text-slate-700 border-slate-200",
    expired: "bg-rose-50 text-rose-700 border-rose-200",
  }[post.status];

  const isPoster = post.postedBy === currentUserId;

  return (
    <div className="p-4 rounded-2xl border bg-white shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`px-2 py-1 rounded-lg text-xs border ${statusColor}`}>
          {post.status}
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
          <RefreshCcw className="w-3.5 h-3.5"/> posted {new Date(post.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="mt-3">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Utensils className="w-4 h-4"/> {post.canteenName}
        </h3>
        <p className="text-slate-700 mt-1">{post.items}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {post.dietary?.map((d) => (
            <Badge key={d}>{d}</Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
        <InfoRow icon={<CheckSquare className="w-4 h-4"/>} label="Portions" value={`${post.portions}`} />
        <InfoRow icon={<Clock className="w-4 h-4"/>} label="Ready by" value={`${new Date(post.readyBy).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${timeLeft})`} />
        <InfoRow icon={<MapPin className="w-4 h-4"/>} label="Location" value={post.location} />
        <InfoRow icon={<Phone className="w-4 h-4"/>} label="Contact" value={post.contact} />
      </div>

      {post.notes && (
        <div className="mt-3 text-sm text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5"/> {post.notes}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        {role === "ngo" && post.status === "open" && (
          <ClaimButton 
            postId={post._id} 
            onClaim={onClaim}
            profile={profile}
          />
        )}
        {isPoster && post.status === "claimed" && (
          <button
            onClick={() => onComplete(post._id)}
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <CheckCircle2 className="w-4 h-4"/> Mark Completed
          </button>
        )}
        {isPoster && (
          <button
            onClick={() => onDelete(post._id)}
            type="button"
            className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-slate-600 hover:bg-slate-50"
          >
            <Trash2 className="w-4 h-4"/> Delete
          </button>
        )}
      </div>

      {post.claimedBy && (
        <div className="mt-4 p-3 rounded-xl border bg-slate-50">
          <div className="text-sm text-slate-700">Claimed by:</div>
          <div className="font-medium">{post.claimedBy.ngoName} — {post.claimedBy.phone}</div>
          <div className="text-xs text-slate-500">at {new Date(post.claimedBy.time).toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-slate-700">
      <div className="text-slate-500">{icon}</div>
      <div className="text-slate-500 w-24">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function ClaimButton({ postId, onClaim, profile }) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState(profile?.phoneNumber || "");

  const handleConfirm = () => {
    if (!profile?.orgName || !phone) {
      // Handle missing data without an alert
      console.error("Missing NGO name or phone number in profile.");
      return;
    }
    onClaim(postId, profile.orgName, phone);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#54d22d] text-white hover:bg-green-700"
      >
        <HandHeart className="w-4 h-4"/> Claim for Pickup
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 flex items-end md:items-center md:justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white w-full md:max-w-md rounded-2xl p-4 border shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Claim this surplus</h3>
                <button onClick={() => setOpen(false)} type="button" className="p-1 rounded hover:bg-slate-100">
                  <X className="w-5 h-5"/>
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-1">Share your NGO details so the canteen can coordinate pickup.</p>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-sm text-slate-600">NGO Name</label>
                  <input value={profile?.orgName || "Not available"} readOnly className="w-full mt-1 px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#54d22d]/50"/>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Contact Phone</label>
                  <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#54d22d]/50" placeholder="e.g., +91 98XXXXXX"/>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 justify-end">
                <button onClick={()=>setOpen(false)} type="button" className="px-3 py-2 rounded-xl border">Cancel</button>
                <button
                  onClick={handleConfirm}
                  type="button"
                  className="px-3 py-2 rounded-xl bg-[#54d22d] text-white"
                >
                  Confirm Claim
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NewPostModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    canteenName: "",
    items: "",
    portions: 20,
    readyBy: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16), // for input[type=datetime-local]
    location: "",
    dietary: ["veg"],
    contact: "",
    notes: "",
  });
  const [message, setMessage] = useState('');

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const toggleDiet = (tag) => {
    setForm((prev) => {
      const has = prev.dietary.includes(tag);
      return { ...prev, dietary: has ? prev.dietary.filter((t) => t !== tag) : [...prev.dietary, tag] };
    });
  };

  const submit = () => {
    if (!form.canteenName || !form.items || !form.location || !form.contact) {
      // Replaced alert with state-based message display
      setMessage('Please fill out all required fields.');
      return;
    }
    const payload = {
      ...form,
      readyBy: new Date(form.readyBy).toISOString(),
      portions: Number(form.portions) || 0,
    };
    onCreate(payload);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 flex items-end md:items-center md:justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-white w-full md:max-w-2xl rounded-2xl p-4 border shadow-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">New Surplus Post</h3>
          <button onClick={onClose} type="button" className="p-1 rounded hover:bg-slate-100">
            <X className="w-5 h-5"/>
          </button>
        </div>
        <p className="text-sm text-slate-600 mt-1">Share surplus details so NGOs can claim and pick up quickly.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label="Canteen Name">
            <input value={form.canteenName} onChange={(e)=>set("canteenName", e.target.value)} className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#54d22d]/50" placeholder="e.g., South Campus Food Court"/>
          </Field>
          <Field label="Contact Phone">
            <input value={form.contact} onChange={(e)=>set("contact", e.target.value)} className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#54d22d]/50" placeholder="e.g., +91 9XXXXXXXXX"/>
          </Field>

          <Field label="Location / Pickup Point">
            <input value={form.location} onChange={(e)=>set("location", e.target.value)} className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#54d22d]/50" placeholder="Building, Gate, Landmark"/>
          </Field>
          <Field label={<span className="inline-flex items-center gap-1"><Clock className="w-4 h-4"/> Ready By</span>}>
            <input type="datetime-local" value={form.readyBy} onChange={(e)=>set("readyBy", e.target.value)} className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#54d22d]/50"/>
          </Field>

          <Field label="Food Items">
            <textarea value={form.items} onChange={(e)=>set("items", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#54d22d]/50" placeholder="e.g., Rice (10kg), Dal (5kg), 80 rotis"/>
          </Field>
          <Field label="Approx. Portions">
            <input type="number" value={form.portions} onChange={(e)=>set("portions", e.target.value)} className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#54d22d]/50"/>
          </Field>

          <Field label={<span className="inline-flex items-center gap-1"><CalendarDays className="w-4 h-4"/> Dietary Tags</span>}>
            <div className="flex flex-wrap gap-2">
              {[
                {k:"veg", label:"Veg"},
                {k:"vegan", label:"Vegan"},
                {k:"no-onion-garlic", label:"No Onion/Garlic"},
                {k:"gluten-free", label:"Gluten-free"},
              ].map((t)=> (
                <button key={t.k} type="button" onClick={()=>toggleDiet(t.k)} className={`px-3 py-1 rounded-full border ${form.dietary.includes(t.k) ? "bg-[#54d22d] text-white border-[#54d22d]" : "bg-white"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Notes (storage, allergens, container reqs)">
            <input value={form.notes} onChange={(e)=>set("notes", e.target.value)} className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#54d22d]/50" placeholder="e.g., Consume within 3 hours; bring steel containers"/>
          </Field>
        </div>
        {message && (
          <div className="mt-4 text-center text-red-600">
            {message}
          </div>
        )}
        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} type="button" className="px-3 py-2 rounded-xl border">Cancel</button>
          <button onClick={submit} type="button" className="px-4 py-2 rounded-xl bg-[#54d22d] text-white">Publish Post</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm text-slate-600 mb-1">{label}</div>
      {children}
    </label>
  );
}

function EmptyState({ role, onNew }) {
  return (
    <div className="mt-16 border rounded-2xl p-8 text-center bg-white shadow-sm">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
        {role === "canteen" ? <Plus className="w-6 h-6"/> : <HandHeart className="w-6 h-6"/>}
      </div>
      <h3 className="mt-4 text-lg font-semibold">No posts found</h3>
      <p className="text-slate-600 mt-1">{role === "canteen" ? "Create your first surplus post so NGOs can claim quickly." : "Try adjusting filters or ask canteens to post their surplus here."}</p>
      {role === "canteen" && (
        <button onClick={onNew} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#54d22d] text-white">
          <Plus className="w-4 h-4"/> New Surplus Post
        </button>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-10 py-10 border-t">
      <div className="max-w-6xl mx-auto px-4 text-sm text-slate-600 flex flex-col md:flex-row gap-2 md:items-center">
        <div>Built with ♥ to eliminate food waste — connect canteens with NGOs, fast.</div>
        <div className="md:ml-auto">Powered by Firebase Firestore.</div>
      </div>
    </footer>
  );
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl shadow-lg border bg-white z-50"
        >
          <div className="text-sm">{toast.msg}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

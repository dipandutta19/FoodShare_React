// src/App.jsx

import { useState, useEffect } from "react";
import FoodLink from "./react.jsx";
import Login from "./login.jsx";
import Register from "./Register.jsx";
import LandingPage from "./LandingPage.jsx";

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithCustomToken, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Global variables provided by the canvas environment.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase outside the component to prevent re-initialization
let auth, db;
// Check if firebaseConfig is a valid object before initializing Firebase
if (firebaseConfig && Object.keys(firebaseConfig).length > 0) {
    try {
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    } catch (e) {
        console.error("Firebase initialization failed:", e);
    }
} else {
    console.error("Firebase initialization failed: Invalid or empty firebaseConfig.");
}


export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('landing');
  const [registerAccountType, setRegisterAccountType] = useState('NGO');

  // Listen for Firebase auth state changes
  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // The `app` view is now dependent on the user being logged in
        setView('app');
      } else {
        setUser(null);
        setView('landing');
      }
      setAuthReady(true);
    });

    // Sign in with the provided custom token if available
    const signIn = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase authentication failed:", error);
      }
    };
    signIn();

    return () => unsubscribe();
  }, [auth]);

  // Handle logout
  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
    }
  };

  const handleRegisterClick = (accountType) => {
    setRegisterAccountType(accountType);
    setView('register');
  };

  // Render the appropriate view based on state
  const renderView = () => {
    if (!authReady) {
      // Show a loading screen while Firebase auth is initializing
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 w-full max-w-none">
          <div className="text-gray-500 text-lg">Loading...</div>
        </div>
      );
    }

    switch (view) {
      case 'landing':
        return <LandingPage onLoginClick={() => setView('login')} onRegisterClick={handleRegisterClick} />;
      case 'login':
        return <Login onLogin={() => setView('app')} onRegisterClick={() => handleRegisterClick('NGO')} onBackClick={() => setView('landing')} />;
      case 'register':
        return <Register onRegister={() => setView('app')} onLoginClick={() => setView('login')} onBackClick={() => setView('landing')} initialAccountType={registerAccountType} />;
      case 'app':
        // Pass the db and user to the main app component
        return <FoodLink db={db} user={user} onLogout={handleLogout} />;
      default:
        return <LandingPage onLoginClick={() => setView('login')} onRegisterClick={handleRegisterClick} />;
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen mx-auto">
      {renderView()}
    </div>
  );
}

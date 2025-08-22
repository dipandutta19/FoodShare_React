import React, { useState } from 'react';
import { LogIn, ArrowLeft, X } from 'lucide-react';
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { motion, AnimatePresence } from 'framer-motion';

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

const Login = ({ onLogin, onRegisterClick, onBackClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const auth = getAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setShowModal(false);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setMessage("Login successful!");
            setIsSuccess(true);
            setShowModal(true);
            // Wait a moment before navigating to give the user time to see the success message.
            setTimeout(onLogin, 1500);
        } catch (error) {
            console.error('Login failed:', error);
            setMessage('Failed to log in. Please check your email and password.');
            setIsSuccess(false);
            setShowModal(true);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
                <div className="flex justify-start mb-6">
                    <button onClick={onBackClick} type="button" className="p-2 rounded-full hover:bg-gray-200 transition">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Login to FoodShare</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring focus:border-blue-300"
                        />
                         <div className="mt-2 flex items-center justify-start">
                            <input
                                type="checkbox"
                                id="show-password-login"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                                className="w-4 h-4 text-[#54d22d] rounded"
                            />
                            <label htmlFor="show-password-login" className="ml-2 text-sm text-gray-600">
                                Show Password
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#54d22d] text-white py-2 rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-4 h-4"/> Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <button onClick={onRegisterClick} type="button" className="text-sm text-blue-500 hover:underline">
                        Don't have an account? Register
                    </button>
                </div>
            </div>
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

export default Login;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import config from '../config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${config.API_BASE_URL}/customers/send-email-otp`, { email });
      if (res.data.success || res.status === 200) {
        setIsOtpSent(true);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Server error. Could not send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${config.API_BASE_URL}/customers/verify-email-otp`, { email, otp });
      if (res.data.token) {
        login(res.data.customer, res.data.token);
        // If customer is missing details, they should probably go to profile to fill them in, 
        // but for now redirect to home or previous page
        navigate('/');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Server error. Could not verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-orange-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back 👋</h2>
          <p className="text-gray-500 text-sm">Login with your email to track orders and more.</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-center">{error}</div>}

        {!isOtpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                placeholder="you@example.com" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 hover:bg-black transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Verification Code</label>
              <input 
                type="text" 
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all tracking-widest text-center text-xl font-black"
                placeholder="000000" 
                maxLength="6"
              />
              <p className="text-xs text-gray-400 mt-2 text-center">We sent a code to <span className="font-bold text-gray-700">{email}</span></p>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-orange-600 transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            
            <button 
              type="button"
              onClick={() => setIsOtpSent(false)}
              className="w-full text-center text-sm font-bold text-gray-500 hover:text-orange-600 transition-colors"
            >
              Use a different email
            </button>
          </form>
        )}

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 font-medium">
            New here? <Link to="/signup" className="text-orange-600 font-black hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

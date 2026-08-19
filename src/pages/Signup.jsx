import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import config from '../config';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  // Details state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, token, updateDetails } = useAuth();
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
        
        if (!res.data.customer.name || !res.data.customer.phone) {
          setIsVerified(true); // Proceed to fill details
        } else {
          navigate('/'); // Already has details, just go home
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Server error. Could not verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.put(`${config.API_BASE_URL}/customers/details`, 
        { name, phone, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateDetails(res.data);
      navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-orange-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Join Us 🌶️</h2>
          <p className="text-gray-500 text-sm">Create an account to order and track easily.</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-center">{error}</div>}

        {!isOtpSent && !isVerified && (
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
        )}

        {isOtpSent && !isVerified && (
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
              {loading ? 'Verifying...' : 'Verify'}
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

        {isVerified && (
          <form onSubmit={handleSaveDetails} className="space-y-4">
            <h3 className="font-black text-xl mb-4 text-center">Almost Done!</h3>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-600 outline-none transition-all"
                placeholder="John Doe" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input 
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-600 outline-none transition-all"
                placeholder="+91 0000000000" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address (Optional)</label>
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-600 outline-none transition-all"
                placeholder="Street, City..." 
                rows="3"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 hover:bg-black transition-all disabled:opacity-50 mt-4"
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </form>
        )}

        {!isVerified && (
          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 font-medium">
              Already have an account? <Link to="/login" className="text-orange-600 font-black hover:underline">Log in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

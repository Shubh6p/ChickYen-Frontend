import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

import config from '../config';

export default function Profile() {
  const { user, token, isAuthenticated, logout, updateDetails } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user, isAuthenticated, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.put(`${config.API_BASE_URL}/customers/details`, 
        { name, phone, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateDetails(res.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 h-fit">
          <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 mb-6">
            <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl font-black mb-4">
              {user.name ? user.name.charAt(0).toUpperCase() : <User />}
            </div>
            <h2 className="text-xl font-black text-gray-900">{user.name || 'Customer'}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          
          <nav className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-orange-50 text-orange-600 font-bold flex items-center gap-3">
              <User className="w-5 h-5" /> My Profile
            </button>
            <button onClick={() => navigate('/orders')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-bold flex items-center gap-3 transition">
              📦 My Orders
            </button>
            <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 font-bold flex items-center gap-3 transition mt-4 border-t border-gray-100">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black mb-6 text-gray-900">Personal Information</h2>
          
          {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm">{error}</div>}
          {success && <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-xl font-bold text-sm">{success}</div>}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-600 outline-none transition" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={user.email} 
                  disabled
                  className="w-full px-5 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 outline-none cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-600 outline-none transition" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Saved Delivery Address</label>
              <textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                rows="4"
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-600 outline-none transition" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

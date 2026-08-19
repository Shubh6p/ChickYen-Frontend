import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import config from '../config';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setStatus('');
    
    try {
      const res = await axios.post(`${config.API_BASE_URL}/subscribers`, { email });
      setStatus(res.data.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Error subscribing. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer-glass">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <div className="text-xl font-extrabold text-orange-600 flex items-center tracking-tight mb-6">
                        Chicken Pickle <span className="mx-2 h-4 w-[1px] bg-orange-200"></span><span
                            className="text-gray-800">ChickYen Achar</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs">Authentic Manipuri taste delivered to your
                        doorstep. Handmade with love.</p>

                    <div className="flex space-x-4 mt-6">
                        <a href="#"
                            className="w-10 h-10 bg-white border border-orange-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white transition-all shadow-sm group">
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>

                        <a href="#"
                            className="w-10 h-10 bg-white border border-orange-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white transition-all shadow-sm">
                            <i className="fa-brands fa-instagram"></i>
                        </a>

                        <a href="https://wa.me/919876543210"
                            className="w-10 h-10 bg-white border border-orange-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#25D366] hover:text-white transition-all shadow-sm">
                            <i className="fa-brands fa-whatsapp text-lg"></i>
                        </a>

                        <a href="mailto:hello@yenachar.com"
                            className="w-10 h-10 bg-white border border-orange-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#EA4335] hover:text-white transition-all shadow-sm">
                            <i className="fa-solid fa-envelope"></i>
                        </a>
                    </div>
                </div>

                <div className="text-center sm:text-left">
                    <h4 className="font-bold text-gray-800 mb-6">Explore</h4>
                    <ul className="space-y-3 text-gray-500 text-sm">
                        <li><Link to="/about" className="hover:text-orange-600">Our Story</Link></li>
                        <li><Link to="/menu" className="hover:text-orange-600">View Menu</Link></li>
                        <li><Link to="/reviews" className="hover:text-orange-600">Wall of Love</Link></li>
                        <li><Link to="/shipping-policy" className="hover:text-orange-600">Shipping Policy</Link></li>
                    </ul>
                </div>

                <div className="text-center sm:text-left">
                    <h4 className="font-bold text-gray-800 mb-6">Contact</h4>
                    <ul className="space-y-3 text-gray-500 text-sm">
                        <li>📍Near Parul University</li>
                        <li>📞 +91 80020 12665</li>
                        <li>✉️ hello@yenachar.com</li>
                    </ul>
                </div>

                <div className="text-center sm:text-left">
                    <h4 className="font-bold text-gray-800 mb-6">Stay Spicy</h4>
                    <form className="flex flex-col space-y-2" onSubmit={handleSubscribe}>
                        <input 
                            type="email" 
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white border border-orange-100 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-orange-600 outline-none" 
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`py-3 rounded-xl font-bold transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-orange-600'} text-white`}>
                            {loading ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>
                    {status && <p className="mt-2 text-xs font-bold text-orange-600">{status}</p>}
                </div>
            </div>

            <div
                className="mt-12 pt-8 border-t border-orange-100 flex flex-col md:flex-row justify-between items-center text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest text-center gap-4">
                <p>© 2025 ChickYen Achar. All Rights Reserved.</p>
                <div className="flex space-x-6">
                    <Link to="/privacy-policy" className="hover:text-orange-600">Privacy</Link>
                    <Link to="/shipping-policy" className="hover:text-orange-600">Terms</Link>
                </div>
            </div>
        </div>
    </footer>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setIsProfileDropdownOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav-custom sticky top-0 z-50">
        <div className="flex justify-between items-center px-4 md:px-10 py-4 max-w-7xl mx-auto w-full relative">
            {/* MOBILE ONLY: Hamburger (Left) */}
            <button 
                className="md:hidden text-orange-600 p-2 z-50 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <i className="fa-solid fa-bars-staggered text-2xl"></i>
            </button>

            {/* LOGO: Center on Mobile, Left on Desktop */}
            <Link to="/"
                className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:left-0 z-10">
                <img src="/assets/favicon.png" alt="Logo" className="h-10 md:h-14 w-auto" />
                <span className="hidden md:inline-block h-6 w-[1px] bg-orange-200 mx-3"></span>
                <span className="hidden md:inline-block text-gray-800 font-bold text-xl tracking-tight">ChickYen
                    Achar</span>
            </Link>

            {/* DESKTOP NAV: Center */}
            <div className="hidden md:flex flex-1 justify-center space-x-10 font-bold text-gray-700">
                <Link to="/" className="nav-item hover:text-orange-600 transition-colors">Home</Link>
                <Link to="/menu" className="nav-item hover:text-orange-600 transition-colors">Menu</Link>
                <Link to="/about" className="nav-item hover:text-orange-600 transition-colors">About Us</Link>
                <Link to="/contact" className="nav-item hover:text-orange-600 transition-colors">Contact Us</Link>
            </div>

            {/* RIGHT AREA: Profile/Login */}
            <div id="auth-area" className="flex items-center space-x-4 z-50">
                
                {/* Cart Icon */}
                <button onClick={() => setIsCartOpen(true)} className="relative text-gray-800 hover:text-orange-600 transition p-2 cursor-pointer">
                    <i className="fa-solid fa-cart-shopping text-xl"></i>
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                            {cartCount}
                        </span>
                    )}
                </button>

                {!isAuthenticated ? (
                    <Link to="/login"
                        className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-black transition-all shadow-lg shadow-orange-100 font-bold text-sm hidden md:inline-block">
                        Login
                    </Link>
                ) : (
                    <div className="relative group" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm hover:bg-orange-600 hover:text-white transition-all cursor-pointer overflow-hidden">
                            <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                        </button>

                        {isProfileDropdownOpen && (
                            <div
                                className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-orange-50 p-6 z-[100] transform origin-top-right transition-all">
                                <div className="border-b border-orange-50 pb-4 mb-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Welcome back,
                                    </p>
                                    <p className="font-black text-gray-800 truncate text-lg">{user?.name || 'Customer'}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>

                                <nav className="space-y-2">
                                    <Link to="/profile" onClick={() => setIsProfileDropdownOpen(false)}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-orange-50 text-sm font-bold text-gray-700 transition flex items-center gap-3">
                                        <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">👤</span>
                                        My Profile
                                    </Link>
                                    <Link to="/orders" onClick={() => setIsProfileDropdownOpen(false)}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-orange-50 text-sm font-bold text-gray-700 transition flex items-center gap-3">
                                        <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">📦</span>
                                        My Orders
                                    </Link>
                                    <button onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-sm font-bold text-red-500 transition flex items-center gap-3 mt-2 border-t border-gray-50 pt-4">
                                        <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center"><LogOut className="w-4 h-4 text-red-500" /></span>
                                        Logout
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* MOBILE MENU DRAWER */}
        <div id="mobile-menu"
            className={`absolute top-full left-0 w-full bg-[#FFF8F0] border-b border-orange-100 md:hidden flex flex-col p-8 space-y-6 font-bold text-gray-700 shadow-2xl transition-all duration-300 transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl hover:text-orange-600 flex items-center gap-4">
                <span className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">🏠</span> Home
            </Link>
            <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)} className="text-xl hover:text-orange-600 flex items-center gap-4">
                <span className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">🍱</span> Menu
            </Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-xl hover:text-orange-600 flex items-center gap-4">
                <span className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">ℹ️</span> About Us
            </Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-xl hover:text-orange-600 flex items-center gap-4">
                <span className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">✉️</span> Contact Us
            </Link>
            {!isAuthenticated && (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl hover:text-orange-600 flex items-center gap-4 text-orange-600 mt-4 border-t border-orange-100 pt-4">
                    Login
                </Link>
            )}
        </div>
    </nav>
  );
}

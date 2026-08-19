import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Menu, X, Box, BarChart3, PackageOpen, Users, MapPin, UserCog, Star, Mail, Activity } from 'lucide-react';

export default function AdminLayout() {
  const { adminUser, isAdminAuthenticated, isLoading, handleAdminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isLoading, isAdminAuthenticated, navigate]);

  if (isLoading || !isAdminAuthenticated) return <div className="min-h-screen bg-[#FFF8F0]"></div>;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const navItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: <PackageOpen size={18} /> },
    { path: '/admin/orders', name: 'Orders', icon: <PackageOpen size={18} /> },
    { path: '/admin/sales', name: 'Sales Data', icon: <BarChart3 size={18} /> },
    { path: '/admin/products', name: 'Products', icon: <Box size={18} /> },
    { path: '/admin/customers', name: 'Customers', icon: <Users size={18} /> },
    { path: '/admin/locations', name: 'Pickup Points', icon: <MapPin size={18} /> },
    { path: '/admin/staff', name: 'Staff/Admins', icon: <UserCog size={18} /> },
    { path: '/admin/reviews', name: 'Reviews', icon: <Star size={18} /> },
    { path: '/admin/broadcasts', name: 'Broadcasts', icon: <Mail size={18} /> },
    { path: '/admin/logs', name: 'Activity Logs', icon: <Activity size={18} /> },

  ];

  return (
    <div className="bg-[#FFF8F0] min-h-screen flex flex-col md:flex-row overflow-hidden relative">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-orange-100 p-4 sticky top-0 z-[60] flex items-center justify-between shadow-sm">
        <button onClick={toggleSidebar} className="p-2 text-gray-600 hover:bg-orange-50 rounded-xl transition">
          <Menu />
        </button>
        <div className="text-xl font-black text-orange-600 tracking-tight text-center flex-grow">
          Yen <span className="text-gray-800">Achar</span>
        </div>
        <div className="relative">
          <button onClick={toggleProfile} className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl border-2 border-white shadow-sm overflow-hidden focus:ring-2 focus:ring-orange-600 outline-none">
            <span className="text-sm">👤</span>
          </button>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div onClick={closeSidebar} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] md:hidden transition-opacity"></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 w-64 bg-white border-r border-orange-100 flex flex-col p-6 h-screen z-[80] transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="text-2xl font-extrabold text-orange-600 mb-10 px-2 tracking-tight hidden md:block">
          Admin <span className="text-gray-800">Panel</span>
        </div>

        <div className="md:hidden flex justify-between items-center mb-8 px-2">
          <span className="text-lg font-black text-orange-600">Admin Panel</span>
          <button onClick={closeSidebar} className="text-gray-400 hover:text-gray-600"><X /></button>
        </div>

        <nav className="space-y-2 flex-grow">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); closeSidebar(); }}
                className={`w-full flex items-center space-x-3 p-4 rounded-2xl font-bold transition ${isActive ? 'bg-orange-600 text-white shadow-[0_10px_15px_-3px_rgba(234,88,12,0.2)]' : 'text-gray-600 hover:bg-orange-50'}`}
              >
                {item.icon} <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-gray-100 space-y-4">
          <button onClick={() => { handleAdminLogout(); navigate('/admin/login'); }} className="w-full text-left p-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition">
            Logout 👋
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-12 overflow-y-auto h-screen custom-scrollbar">
        {/* Desktop Header */}
        <header className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 leading-tight">Control Center</h1>
            <p className="text-gray-500 font-medium italic">Welcome back, {adminUser?.name || 'Admin'}.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={toggleProfile} className="w-12 h-12 bg-white border border-orange-100 rounded-full flex items-center justify-center text-xl shadow-sm hover:shadow-md transition-all focus:ring-2 focus:ring-orange-600 outline-none">
                👤
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="relative z-0">
          <Outlet />
        </div>
      </main>

      {/* Profile Dropdown */}
      {profileOpen && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setProfileOpen(false)}></div>
          <div className="fixed top-20 right-4 md:top-24 md:right-12 w-64 bg-white rounded-[2rem] shadow-2xl border border-orange-100 p-6 z-[100]">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-3xl border-4 border-orange-50 shadow-inner">
                👤
              </div>
              <div>
                <h4 className="font-black text-gray-800 text-lg leading-tight">{adminUser?.name || 'Admin'}</h4>
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1 italic">{adminUser?.role || 'Role'}</p>
              </div>

              <div className="w-full pt-4 border-t border-gray-50 space-y-3">
                <div className="text-left">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</p>
                  <p className="text-xs text-gray-600 font-medium break-all mt-1">{adminUser?.email || 'admin@yenachar.com'}</p>
                </div>

                <button onClick={() => { handleAdminLogout(); navigate('/admin/login'); }} className="w-full bg-red-50 text-red-600 font-black py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all uppercase text-[10px] tracking-widest mt-4">
                  Logout 👋
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

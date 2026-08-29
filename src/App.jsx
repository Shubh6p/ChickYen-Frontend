import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminModalProvider } from './context/AdminModalContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Menu from './pages/Menu';
// Import other pages when created
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import Reviews from './pages/Reviews';

import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminSales from './pages/admin/Sales';
import AdminOrders from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';
import AdminCustomers from './pages/admin/Customers';
import AdminLocations from './pages/admin/Locations';
import AdminStaff from './pages/admin/Staff';
import AdminReviews from './pages/admin/Reviews';
import Broadcast from './pages/admin/Broadcast';
import ActivityLogs from './pages/admin/ActivityLogs';

const CustomerLayout = () => (
  <div className="flex flex-col min-h-screen w-full">
    <Navbar />
    <CartDrawer />
    <main className="flex-grow flex flex-col items-center">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <AdminModalProvider>
          <CartProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Customer Routes with Layout */}
              <Route path="/" element={<CustomerLayout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="profile" element={<Profile />} />
                <Route path="orders" element={<Orders />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="shipping-policy" element={<ShippingPolicy />} />
                <Route path="reviews" element={<Reviews />} />
              </Route>

              {/* Admin Routes without Customer Navbar/Footer */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="sales" element={<AdminSales />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="broadcasts" element={<Broadcast />} />
                <Route path="logs" element={<ActivityLogs />} />
                <Route path="locations" element={<AdminLocations />} />
                <Route path="staff" element={<AdminStaff />} />
                <Route path="reviews" element={<AdminReviews />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          </CartProvider>
        </AdminModalProvider>
      </AdminAuthProvider>
      <Analytics />
    </AuthProvider>
  );
}

export default App;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { IndianRupee, ShoppingBag, Users, TrendingUp, AlertCircle } from 'lucide-react';

import config from '../../config';

export default function Dashboard() {
  const { adminToken } = useAdminAuth();
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch all orders and calculate stats locally as a fallback
        const res = await axios.get(`${config.API_BASE_URL}/orders/all`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        const orders = Array.isArray(res.data) ? res.data : [];
        
        // Calculate Revenue (delivered orders)
        const revenue = orders.filter(o => o.status === 'Delivered')
                              .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        // Calculate Pending Orders
        const pending = orders.filter(o => ['Processing', 'Verified', 'Packed', 'Out for Delivery'].includes(o.status)).length;
        
        // Get unique customers count based on email or customerId
        const uniqueCustomers = new Set(orders.map(o => o.email || o.customerId).filter(Boolean)).size;

        setStats({
          revenue,
          orders: orders.length,
          customers: uniqueCustomers,
          pending
        });

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (adminToken) fetchDashboardStats();
  }, [adminToken]);

  const statCards = [
    { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: <IndianRupee className="text-emerald-600" />, bg: "bg-emerald-50", color: "text-emerald-600" },
    { title: "Total Orders", value: stats.orders, icon: <ShoppingBag className="text-blue-600" />, bg: "bg-blue-50", color: "text-blue-600" },
    { title: "Active Customers", value: stats.customers, icon: <Users className="text-purple-600" />, bg: "bg-purple-50", color: "text-purple-600" },
    { title: "Pending Orders", value: stats.pending, icon: <AlertCircle className="text-orange-600" />, bg: "bg-orange-50", color: "text-orange-600" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-24 h-24 ${card.bg} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out`}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{card.title}</p>
                  <h3 className="text-3xl font-black text-gray-900 mt-2">{card.value}</h3>
                </div>
                <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center`}>
                  {card.icon}
                </div>
              </div>
              <div className="flex items-center text-xs font-bold text-gray-400">
                <TrendingUp size={14} className="mr-1 text-emerald-500" />
                <span className="text-emerald-500 mr-1">+12%</span> from last month
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-gray-900">Revenue Overview</h3>
            <select className="bg-gray-50 border border-gray-100 text-sm font-bold text-gray-600 rounded-xl px-4 py-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Chart Area (Integration Pending)</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full bg-orange-50 text-orange-600 font-bold p-4 rounded-2xl hover:bg-orange-600 hover:text-white transition flex items-center justify-between group">
              <span>Add New Product</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button className="w-full bg-blue-50 text-blue-600 font-bold p-4 rounded-2xl hover:bg-blue-600 hover:text-white transition flex items-center justify-between group">
              <span>Review Pending Orders</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button className="w-full bg-purple-50 text-purple-600 font-bold p-4 rounded-2xl hover:bg-purple-600 hover:text-white transition flex items-center justify-between group">
              <span>Manage Customers</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

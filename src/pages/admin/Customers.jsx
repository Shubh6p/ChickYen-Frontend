import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Users, Search, Mail, Phone, Calendar } from 'lucide-react';

import config from '../../config';

export default function Customers() {
  const { adminToken } = useAdminAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const [customersRes, ordersRes] = await Promise.all([
          axios.get(`${config.API_BASE_URL}/customers/all`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          }).catch(err => ({ data: [] })),
          axios.get(`${config.API_BASE_URL}/orders/all`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          }).catch(err => ({ data: [] }))
        ]);

        const fetchedCustomers = Array.isArray(customersRes.data) ? customersRes.data : [];
        const allOrdersData = Array.isArray(ordersRes.data) ? ordersRes.data : [];

        const enrichedCustomers = fetchedCustomers.map(c => {
            const userOrders = allOrdersData.filter(o => o.customerId === c._id);
            const sortedOrders = [...userOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return {
                ...c,
                totalOrders: userOrders.length,
                totalSpent: userOrders.reduce((sum, o) => sum + o.totalAmount, 0),
                lastOrder: sortedOrders.length > 0 ? sortedOrders[0].createdAt : c.createdAt
            };
        });

        setCustomers(enrichedCustomers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (adminToken) fetchCustomers();
  }, [adminToken]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Customer Directory</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{customers.length} total customers</p>
          </div>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium text-sm"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCustomers.length === 0 ? (
            <div className="col-span-full py-10 text-center text-gray-500 font-bold">No customers found.</div>
          ) : (
            filteredCustomers.map((customer, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 hover:shadow-md transition group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{customer.name}</h3>
                    <div className="flex items-center text-xs font-bold text-gray-400 gap-1 mt-1">
                      <Calendar size={12} /> Last Order: {new Date(customer.lastOrder).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <Mail size={16} className="text-gray-400" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <Phone size={16} className="text-gray-400" />
                    <span>{customer.phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Orders</p>
                    <p className="font-black text-gray-900 text-xl">{customer.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Spent</p>
                    <p className="font-black text-purple-600 text-xl">₹{customer.totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

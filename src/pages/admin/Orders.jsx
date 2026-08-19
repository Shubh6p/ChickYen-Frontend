import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminModal } from '../../context/AdminModalContext';
import { Search, Phone } from 'lucide-react';

import config from '../../config';

export default function Orders() {
  const { adminToken } = useAdminAuth();
  const { showConfirm, showAlert } = useAdminModal();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/orders/all`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) fetchOrders();
  }, [adminToken]);

  const updateOrderStatus = async (orderId, newStatus) => {
    showConfirm({
      title: 'Update Status',
      message: `Are you sure you want to change this order to ${newStatus}?`,
      icon: '🔄',
      onConfirm: async () => {
        try {
          await axios.put(`${config.API_BASE_URL}/orders/status/${orderId}`, 
            { status: newStatus },
            { headers: { Authorization: `Bearer ${adminToken}` }}
          );
          setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
          console.error("Error updating status:", error);
          showAlert({ title: 'Error', message: 'Failed to update status', icon: '❌', confirmColor: 'bg-red-600' });
        }
      }
    });
  };

  const downloadAdminInvoice = (orderId) => {
    const invoiceUrl = `${config.API_BASE_URL}/orders/invoice/${orderId}?token=${adminToken}`;
    window.open(invoiceUrl, '_blank');
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Processing': return 'text-yellow-600 bg-yellow-50';
      case 'Verified': return 'text-blue-600 bg-blue-50';
      case 'Packed': return 'text-purple-600 bg-purple-50';
      case 'Out for Delivery': return 'text-orange-600 bg-orange-50';
      case 'Delivered': return 'text-green-600 bg-green-50';
      case 'Cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredOrders = orders.filter(order => {
    const orderIdMatch = order.orderId ? order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) : order._id.toLowerCase().includes(searchTerm.toLowerCase());
    const nameMatch = order.customerName ? order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) : (order.shippingAddress?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSearch = orderIdMatch || nameMatch;
    const matchesFilter = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const filterTabs = ['All', 'Processing', 'Verified', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const todayStr = new Date().toLocaleDateString();
  const verifiedStatuses = ["Verified", "Packed", "Out for Delivery", "Delivered"];
  const pendingStages = ["Processing", "Verified", "Packed", "Out for Delivery"];

  const stats = orders.reduce((acc, o) => {
      const orderDate = new Date(o.createdAt).toLocaleDateString();
      const isRevenueValid = verifiedStatuses.includes(o.status);

      if (pendingStages.includes(o.status)) {
          acc.pending++;
          acc.pendingDots.push({ status: o.status, id: o._id });
      }

      if (orderDate === todayStr && isRevenueValid) acc.revenue += o.totalAmount;
      if (o.status === "Delivered") acc.completed++;
      if (isRevenueValid) acc.total++;

      return acc;
  }, { revenue: 0, pending: 0, completed: 0, total: 0, pendingDots: [] });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 leading-tight" id="view-title">Order Management</h2>
            <p className="text-sm font-medium text-gray-500 italic">Welcome to the control center.</p>
          </div>
          {/* Search Bar matching the screenshot */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" size={18} />
            <input 
              type="text" 
              placeholder="Search data..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium text-sm text-gray-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white px-6 py-8 rounded-[2rem] border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Today's Revenue</p>
                <h3 className="text-4xl font-black text-orange-600">₹{stats.revenue}</h3>
            </div>
            <div className="bg-white px-6 py-8 rounded-[2rem] border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pending</p>
                <h3 className="text-4xl font-black text-yellow-500">{stats.pending}</h3>
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {stats.pendingDots.map((dot, idx) => {
                        let dotColor = "bg-gray-400";
                        let extraClass = "";
                        if (dot.status === "Processing") { dotColor = "bg-yellow-400"; extraClass = "animate-pulse"; }
                        else if (dot.status === "Verified") dotColor = "bg-blue-500";
                        else if (dot.status === "Packed") dotColor = "bg-purple-500";
                        else if (dot.status === "Out for Delivery") dotColor = "bg-orange-500";
                        return (
                            <span 
                                key={idx} 
                                title={`Click to view ${dot.status} orders`}
                                onClick={() => setStatusFilter(dot.status)}
                                className={`w-2 h-2 rounded-full shadow-sm cursor-pointer hover:scale-150 transition-transform duration-200 ${dotColor} ${extraClass}`}
                            ></span>
                        )
                    })}
                </div>
            </div>
            <div className="bg-white px-6 py-8 rounded-[2rem] border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Completed</p>
                <h3 className="text-4xl font-black text-green-500">{stats.completed}</h3>
            </div>
            <div className="bg-white px-6 py-8 rounded-[2rem] border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Sales</p>
                <h3 className="text-4xl font-black text-gray-800">{stats.total}</h3>
            </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">

        <div className="flex flex-wrap gap-2">
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition shadow-sm ${statusFilter === tab ? 'bg-orange-600 text-white' : 'bg-white text-gray-400 border border-gray-100 hover:bg-orange-50'}`}
            >
              {tab === 'All' ? 'All Orders' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-10 bg-white rounded-[2rem] text-center border border-gray-100">
            <p className="text-gray-500 font-bold">No orders found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="admin-table-body">
          {filteredOrders.map(o => {
            const displayId = o.orderId ? o.orderId.split('-')[1] : o._id.substring(o._id.length - 6).toUpperCase();
            const customerName = o.customerName || o.shippingAddress?.fullName || 'Unknown';
            const phone = o.phone || o.shippingAddress?.phone;
            const email = o.email || o.shippingAddress?.email || 'No Email';
            const paymentMethod = o.paymentMethod || 'COD';
            const items = o.items || [];
            
            const showLargeCallBtn = (o.status === "Processing" || o.status === "Out for Delivery");

            return (
              <div key={o._id} className="group bg-white rounded-[2rem] p-6 border border-orange-50 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10 flex justify-between items-start mb-4">
                    <div className="flex-grow">
                        <span className="text-[9px] font-black bg-gray-900 text-white px-2 py-1 rounded-md uppercase tracking-widest">#{displayId}</span>
                        <h3 className="font-black text-gray-800 text-base mt-2 truncate max-w-[200px]">{customerName}</h3>
                        
                        <div className="flex flex-col mt-1 space-y-0.5">
                            <span className="text-[9px] font-bold text-gray-500 flex items-center gap-1">
                                📞 {phone || 'No Phone'}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-bold text-gray-400 italic truncate max-w-[100px]">
                                    ✉️ {email}
                                </span>
                                <span className="bg-orange-50 text-orange-600 text-[8px] font-black px-2 py-0.5 rounded-full border border-orange-100 uppercase">
                                    {paymentMethod}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase ${getStatusBadgeClass(o.status)}`}>
                            {o.status}
                        </span>
                        
                        {showLargeCallBtn && phone ? (
                            <a href={`tel:${phone}`} 
                              className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl shadow-lg shadow-green-100 hover:bg-green-600 hover:scale-110 transition-all animate-pulse"
                              title="Call Customer">
                              <Phone size={20} />
                            </a>
                        ) : <div className="w-12 h-12"></div>} 
                    </div>
                </div>

                <div className="relative z-10 space-y-3 mb-6">
                    <div className="text-[10px] text-gray-500 font-medium">
                        <p className="uppercase font-bold text-gray-400 mb-1">Items:</p>
                        {items.map((i, idx) => (
                            <span key={idx} className="block">• {i.name || i.product?.name} - {i.weight || ''} (x{i.quantity})</span>
                        ))}
                    </div>
                    <div className="flex justify-between items-end border-t border-gray-50 pt-3">
                        <div>
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Pickup Point</p>
                            <p className="text-[10px] text-orange-600 font-bold italic">📍 {o.pickupLocation?.locationName || 'Unspecified Point'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Amount</p>
                            <p className="text-lg font-black text-gray-800">₹{o.totalAmount}</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex gap-2">
                    {o.status === "Processing" || o.status === "Pending" ? (
                      <>
                        <button onClick={() => updateOrderStatus(o._id, 'Verified')} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition">Verify</button>
                        <button onClick={() => updateOrderStatus(o._id, 'Cancelled')} className="px-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition">❌</button>
                      </>
                    ) : null}
                    {o.status === "Verified" && (
                      <button onClick={() => updateOrderStatus(o._id, 'Packed')} className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition">Mark Packed</button>
                    )}
                    {o.status === "Packed" && (
                      <button onClick={() => updateOrderStatus(o._id, 'Out for Delivery')} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition">Send Out</button>
                    )}
                    {o.status === "Out for Delivery" && (
                      <button onClick={() => updateOrderStatus(o._id, 'Delivered')} className="flex-1 bg-green-500 hover:bg-green-700 text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition">Confirm Delivery</button>
                    )}
                    
                    {o.status === "Delivered" && (
                        <button onClick={() => downloadAdminInvoice(o._id)} className="flex-1 bg-gray-900 hover:bg-black text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                            📄 Invoice
                        </button>
                    )}
                </div>

                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-orange-50 rounded-full opacity-30 group-hover:scale-110 transition-transform pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

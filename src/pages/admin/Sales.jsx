import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BarChart3, TrendingUp, Package, MapPin } from 'lucide-react';

import config from '../../config';

export default function Sales() {
  const { adminToken } = useAdminAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/orders/all`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Sales fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    if (adminToken) fetchAllOrders();
  }, [adminToken]);

  // Compute Sales Analytics
  const now = new Date();
  const todayStr = now.toLocaleDateString();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let stats = {
    todayRev: 0,
    monthRev: 0,
    totalRev: 0,
    completedOrders: 0,
    totalItemsCount: 0,
    totalWeightGrams: 0,
    productMap: {},
    locationMap: {} 
  };

  orders.forEach(order => {
    const date = new Date(order.createdAt);
    const isToday = date.toLocaleDateString() === todayStr;
    const isThisMonth = date.getMonth() === currentMonth && date.getFullYear() === currentYear;

    if (order.status === "Delivered") {
        stats.completedOrders++;
        stats.totalRev += order.totalAmount;

        if (isToday) stats.todayRev += order.totalAmount;
        if (isThisMonth) stats.monthRev += order.totalAmount;

        const locName = order.pickupLocation?.locationName || "Standard Delivery";
        if (!stats.locationMap[locName]) {
            stats.locationMap[locName] = { count: 0, revenue: 0 };
        }
        stats.locationMap[locName].count++;
        stats.locationMap[locName].revenue += order.totalAmount;

        const items = order.items || [];
        items.forEach(item => {
            const id = item.productId || item.product?._id || item.name;
            const rawWeight = item.weight || "0g";
            const weightValue = parseInt(rawWeight) || 0;

            stats.totalWeightGrams += (weightValue * item.quantity);
            stats.totalItemsCount += item.quantity;

            if (!stats.productMap[id]) {
                stats.productMap[id] = {
                    name: item.name || item.product?.name,
                    img: item.image || item.product?.image,
                    rev: 0,
                    totalQty: 0,
                    itemWeight: rawWeight
                };
            }

            stats.productMap[id].totalQty += item.quantity;
            stats.productMap[id].rev += ((item.price || item.product?.price || 0) * item.quantity);
        });
    }
  });

  const totalWeightKg = (stats.totalWeightGrams / 1000).toFixed(2);
  const sortedProducts = Object.values(stats.productMap).sort((a, b) => b.totalQty - a.totalQty);
  const sortedLocations = Object.entries(stats.locationMap).sort((a, b) => b[1].count - a[1].count);
  const mostSold = sortedProducts[0] || { name: "N/A", totalQty: 0 };

  if (loading) {
    return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-600"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in p-4">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="admin-card p-4 rounded-3xl bg-white border-b-4 border-red-500 shadow-sm">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Revenue</p>
              <h3 className="text-xl font-black text-gray-800">₹{stats.totalRev}</h3>
          </div>
          <div className="admin-card p-4 rounded-3xl bg-white border-b-4 border-yellow-500 shadow-sm">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Today's Revenue</p>
              <h3 className="text-xl font-black text-orange-600">₹{stats.todayRev}</h3>
          </div>
          <div className="admin-card p-4 rounded-3xl bg-white border-b-4 border-orange-500 shadow-sm">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Orders Completed</p>
              <h3 className="text-xl font-black text-gray-800">{stats.completedOrders}</h3>
          </div>
          <div className="admin-card p-4 rounded-3xl bg-white border-b-4 border-blue-500 shadow-sm">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Items Sold</p>
              <h3 className="text-xl font-black text-gray-800">{stats.totalItemsCount}</h3>
          </div>
          <div className="admin-card p-4 rounded-3xl bg-white border-b-4 border-green-500 shadow-sm">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Weight Sold</p>
              <h3 className="text-xl font-black text-gray-800">{totalWeightKg}kg</h3>
          </div>
          <div className="admin-card p-4 rounded-3xl bg-gray-900 text-white border-b-4 border-orange-500 shadow-sm">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Most Sold</p>
              <h3 className="text-sm font-black truncate">{mostSold.name}</h3>
              <p className="text-[9px] text-orange-500 font-bold">{mostSold.totalQty} Units</p>
          </div>
      </div>

      {/* Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Inventory & Sales Analytics Table */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-orange-50 shadow-sm">
            <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2">
                <span className="p-2 bg-orange-100 rounded-lg text-sm"><BarChart3 size={18} className="text-orange-600" /></span> Inventory & Sales Analytics
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-50">
                        <tr>
                            <th className="pb-4">Product Name</th>
                            <th className="pb-4 text-center">Unit Weight</th>
                            <th className="pb-4 text-center">Total Quantity</th>
                            <th className="pb-4 text-center">Total Mass (kg)</th>
                            <th className="pb-4 text-right">Revenue Generated</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {sortedProducts.map((p, idx) => {
                            const unitMass = parseInt(p.itemWeight) || 0;
                            const totalMass = ((unitMass * p.totalQty) / 1000).toFixed(2);
                            return (
                                <tr key={idx}>
                                    <td className="py-4 flex items-center gap-3">
                                        {p.img ? <img src={p.img} className="w-8 h-8 rounded-lg object-cover" /> : <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px]">No Img</div>}
                                        <span className="font-bold text-gray-800 text-sm">{p.name}</span>
                                    </td>
                                    <td className="py-4 text-center text-xs font-bold text-gray-400">{p.itemWeight === "0g" ? 'N/A' : p.itemWeight}</td>
                                    <td className="py-4 text-center text-xs font-black text-gray-900">{p.totalQty}</td>
                                    <td className="py-4 text-center text-xs font-bold text-blue-600">{totalMass} kg</td>
                                    <td className="py-4 text-right font-black text-orange-600">₹{p.rev}</td>
                                </tr>
                            );
                        })}
                        {sortedProducts.length === 0 && (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-gray-400 font-bold">No sales data available yet.</td>
                          </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Pickup Point Performance */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-orange-50 shadow-sm">
            <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2">
                <span className="p-2 bg-blue-100 rounded-lg text-sm"><MapPin size={18} className="text-blue-600" /></span> Pickup Point Performance
            </h3>
            <div className="space-y-4">
                {sortedLocations.map(([name, data], idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                            <p className="font-black text-gray-800 text-xs uppercase">{name}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{data.count} Successful Orders</p>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-blue-600">₹{data.revenue}</p>
                            <p className="text-[9px] text-gray-400 font-bold italic">Total Revenue</p>
                        </div>
                    </div>
                ))}
                {sortedLocations.length === 0 && (
                   <p className="text-center text-gray-400 font-bold py-8">No pickup point data available.</p> 
                )}
            </div>
        </div>

      </div>
    </div>
  );
}

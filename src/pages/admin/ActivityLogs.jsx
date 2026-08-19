import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Activity, ShoppingBag, UserPlus, Settings, Calendar } from 'lucide-react';

import config from '../../config';

export default function ActivityLogs() {
  const { adminToken } = useAdminAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [adminToken]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/logs`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setLogs(res.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'NEW_ORDER':
        return <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><ShoppingBag size={18} /></div>;
      case 'NEW_USER_REGISTRATION':
        return <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><UserPlus size={18} /></div>;
      case 'SYSTEM':
      case 'ADMIN_ACTION':
        return <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><Settings size={18} /></div>;
      default:
        return <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Activity size={18} /></div>;
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Activity Logs</h1>
        <p className="text-gray-500 mt-2">Track real-time system events, new users, and orders.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-sm">
        <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2">
          <span className="p-2 bg-orange-100 rounded-lg"><Activity size={18} className="text-orange-600" /></span> 
          Recent Activity Timeline
        </h3>

        {logs.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-medium italic">
            No activities recorded yet.
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {logs.map((log) => (
              <div key={log._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  {getLogIcon(log.type)}
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(log.createdAt)}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white px-2 py-1 rounded text-gray-500 border border-gray-100">
                      {log.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-800 mt-2">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

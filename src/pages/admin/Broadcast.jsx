import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Send, Users, Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

import config from '../../config';

export default function Broadcast() {
  const { adminToken } = useAdminAuth();
  
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isHtml, setIsHtml] = useState(false);
  
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchSubscribers();
  }, [adminToken]);

  const fetchSubscribers = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/subscribers`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setSubscribers(res.data);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    
    setSending(true);
    setStatus(null);
    
    try {
      const res = await axios.post(`${config.API_BASE_URL}/subscribers/broadcast`, {
        subject,
        message,
        isHtml
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      setStatus({ type: 'success', text: res.data.message });
      setSubject('');
      setMessage('');
    } catch (error) {
      setStatus({ type: 'error', text: error.response?.data?.message || 'Failed to send broadcast' });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Broadcast Center</h1>
          <p className="text-gray-500 mt-2">Send newsletters to all your active subscribers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compose Email Form */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2">
            <span className="p-2 bg-orange-100 rounded-lg text-sm"><Mail size={18} className="text-orange-600" /></span> 
            Compose Broadcast
          </h3>
          
          {status && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-bold text-sm">{status.text}</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Subject Line</label>
              <input 
                type="text" 
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. 🔥 Special Discount for our Loyal Customers!"
                className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-orange-600 outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">Message Body</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isHtml} 
                    onChange={(e) => setIsHtml(e.target.checked)} 
                    className="rounded text-orange-600 focus:ring-orange-600"
                  />
                  <span className="text-xs font-bold text-gray-500">Send as HTML</span>
                </label>
              </div>
              <textarea 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={10}
                placeholder={isHtml ? "<h1>Hello</h1><p>Write your HTML here...</p>" : "Write your plain text message here..."}
                className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-orange-600 outline-none resize-y"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={sending || subscribers.length === 0}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                sending || subscribers.length === 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-900 text-white hover:bg-orange-600 shadow-xl shadow-orange-100'
              }`}
            >
              {sending ? (
                <><Loader2 className="animate-spin" size={20} /> Sending to {subscribers.length} recipients...</>
              ) : (
                <><Send size={20} /> Send Broadcast</>
              )}
            </button>
          </form>
        </div>

        {/* Subscriber List */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-black text-gray-800 flex items-center gap-2">
                 <span className="p-2 bg-blue-100 rounded-lg text-sm"><Users size={18} className="text-blue-600" /></span> 
                 Subscribers
               </h3>
               <span className="bg-orange-100 text-orange-600 font-black text-sm px-3 py-1 rounded-full">{subscribers.length}</span>
             </div>
             
             <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-3 mt-6">
               {subscribers.length === 0 ? (
                 <p className="text-sm text-gray-400 text-center py-6 font-medium italic">No active subscribers yet.</p>
               ) : (
                 subscribers.map(sub => (
                   <div key={sub._id} className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs">
                       {sub.email.charAt(0).toUpperCase()}
                     </div>
                     <div className="overflow-hidden">
                       <p className="text-sm font-bold text-gray-700 truncate">{sub.email}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(sub.createdAt).toLocaleDateString()}</p>
                     </div>
                   </div>
                 ))
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

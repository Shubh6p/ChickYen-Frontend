import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminModal } from '../../context/AdminModalContext';
import { Star, CheckCircle, Clock } from 'lucide-react';

import config from '../../config';

export default function Reviews() {
  const { adminToken } = useAdminAuth();
  const { showConfirm, showAlert } = useAdminModal();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/reviews/all-admin`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) fetchReviews();
  }, [adminToken]);

  const handleReviewAction = async (id, action) => {
    let confirmMsg = "";
    let newStatus = "";

    if (action === 'approve') {
        confirmMsg = "This review will be published and visible to all customers on the website.";
        newStatus = "Approved";
    } else if (action === 'delete') {
        confirmMsg = "This review will be permanently deleted.";
    } else if (action === 'unapprove') {
        confirmMsg = "This review will move back to Pending and be hidden from the website.";
        newStatus = "Pending";
    }

    showConfirm({
      title: 'Confirm Action',
      message: confirmMsg,
      icon: action === 'delete' ? '🗑️' : '📝',
      confirmColor: action === 'delete' ? 'bg-red-600' : 'bg-orange-600',
      onConfirm: async () => {
        try {
            if (action === 'delete') {
                await axios.delete(`${config.API_BASE_URL}/reviews/${id}`, {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });
            } else {
                await axios.put(`${config.API_BASE_URL}/reviews/status/${id}`, { status: newStatus }, {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });
            }
            fetchReviews();
        } catch (error) {
            console.error(error);
            showAlert({ title: 'Error', message: 'Failed to process action', icon: '❌', confirmColor: 'bg-red-600' });
        }
      }
    });
  };

  const pendingReviews = reviews.filter(r => r.status && r.status !== "Approved");
  const approvedReviews = reviews.filter(r => r.status === "Approved");

  const renderCard = (r, isPending) => (
    <div key={r._id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 hover:shadow-md transition-all group">
        <div className="w-20 h-20 rounded-2xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 relative">
            {r.imageUrl ? (
              <img src={r.imageUrl} alt="Review" className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" onClick={() => window.open(r.imageUrl, '_blank')} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">📝</div>
            )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <h4 className="font-black text-gray-800 text-sm truncate">{r.customerName}</h4>
                    <span className="text-[10px] font-bold text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-orange-500 font-black">{r.rating}⭐</span>
                    <span className="text-[10px] text-gray-400">•</span>
                    <span className="text-xs text-red-500 font-black">{"🌶️".repeat(r.spiceLevel || 1)}</span>
                </div>
                <p className="text-xs text-gray-500 italic mt-1 line-clamp-3">"{r.comment}"</p>
            </div>

            <div className="flex gap-2 mt-3 justify-end">
                {isPending ? (
                  <>
                    <button onClick={() => handleReviewAction(r._id, 'delete')} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-[10px] font-black uppercase transition">Delete</button>
                    <button onClick={() => handleReviewAction(r._id, 'approve')} className="px-4 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-green-600 text-[10px] font-black uppercase transition shadow-md">Approve</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleReviewAction(r._id, 'delete')} className="px-3 py-1.5 rounded-lg text-gray-400 hover:text-red-600 text-[10px] font-bold uppercase transition">Delete</button>
                    <button onClick={() => handleReviewAction(r._id, 'unapprove')} className="px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-500 hover:text-white text-[10px] font-black uppercase transition">Unapprove</button>
                  </>
                )}
            </div>
        </div>
    </div>
  );

  if (loading) {
    return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-600"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in p-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-900" id="view-title">Review Management</h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Moderate customer feedback and photos.</p>
      </div>

      <div className="flex flex-col gap-12 w-full">
        {/* Pending Section */}
        <section>
            <div className="flex items-center gap-4 mb-6 sticky top-0 bg-[#FFF8F0]/95 backdrop-blur-sm z-10 py-4 border-b border-orange-100">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm"><Clock size={16} /></span>
                    Pending Reviews
                </h3>
                <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">{pendingReviews.length}</span>
            </div>
            
            {pendingReviews.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingReviews.map(r => renderCard(r, true))}
            </div>
            ) : (
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-[2rem] text-center">
                <p className="text-gray-400 font-bold">All caught up! No pending reviews.</p>
            </div>
            )}
        </section>

        {/* Approved Section */}
        <section>
            <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm"><CheckCircle size={16} /></span>
                    Live Reviews
                </h3>
                <span className="bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">{approvedReviews.length}</span>
            </div>
            
            {approvedReviews.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {approvedReviews.map(r => renderCard(r, false))}
            </div>
            ) : (
            <p className="text-gray-400 font-bold text-center py-8">No approved reviews yet.</p>
            )}
        </section>
      </div>
    </div>
  );
}

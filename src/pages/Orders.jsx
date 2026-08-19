import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, ShieldCheck, MapPin, CreditCard, ShoppingBag, Star, Flame, FileText, CheckCircle, X } from 'lucide-react';

import config from '../config';

export default function Orders() {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [rating, setRating] = useState(0);
  const [spiceLevel, setSpiceLevel] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewImage, setReviewImage] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  const statusSteps = ["Processing", "Verified", "Packed", "Out for Delivery", "Delivered"];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [ordersRes, reviewsRes] = await Promise.all([
          axios.get(`${config.API_BASE_URL}/orders/user-history`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${config.API_BASE_URL}/reviews/all`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setOrders(ordersRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, token]);

  const openReviewModal = (orderId) => {
    setSelectedOrderId(orderId);
    setRating(0);
    setSpiceLevel(0);
    setComment('');
    setReviewImage(null);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleReviewSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    setSubmittingReview(true);
    try {
      const formData = new FormData();
      formData.append('orderId', selectedOrderId);
      formData.append('rating', rating);
      formData.append('spiceLevel', spiceLevel);
      formData.append('comment', comment);
      if (reviewImage) {
        formData.append('reviewImage', reviewImage);
      }

      await axios.post(`${config.API_BASE_URL}/reviews/add`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update local state to show it was reviewed
      setReviews([...reviews, { orderId: selectedOrderId }]);
      closeReviewModal();
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (err) {
      alert("Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const downloadInvoice = (orderId) => {
    window.open(`${config.API_BASE_URL}/orders/invoice/${orderId}?token=${token}`, '_blank');
  };

  if (!user) return null;

  return (
    <div className="bg-[#FFF8F0] min-h-screen p-4 md:p-10 font-['Plus_Jakarta_Sans']">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div>
                <button onClick={() => navigate('/menu')} className="text-orange-600 font-bold text-sm mb-2 block hover:underline text-left">
                  ← Continue Shopping
                </button>
                <h1 className="text-4xl font-black text-gray-900">Order <span className="text-orange-600">History</span></h1>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-orange-50 flex flex-col items-center md:items-end">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck size={12} /> Active Token Session
                </p>
                <p className="text-sm font-bold text-green-600">Securely Logged In</p>
            </div>
        </div>

        {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>
        ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-3xl font-bold border border-red-100">{error}</div>
        ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-orange-200">
                <p className="text-gray-400 font-bold">No orders found in your account.</p>
                <button onClick={() => navigate('/menu')} className="mt-4 inline-block text-orange-600 font-black hover:underline">
                  Go to Menu →
                </button>
            </div>
        ) : (
          <div className="space-y-8">
            {orders.map(o => {
                const statusIndex = statusSteps.indexOf(o.status);
                const progressWidth = `${(Math.max(0, statusIndex) / (statusSteps.length - 1)) * 100}%`;
                const isDelivered = o.status === "Delivered";
                const alreadyReviewed = reviews.some(r => r.orderId === o._id);

                return (
                  <div key={o._id} className="bg-white p-6 md:p-10 rounded-[3.5rem] shadow-xl relative overflow-hidden transition-all hover:shadow-2xl border border-orange-50">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[5rem] -z-10 opacity-50"></div>

                      <div className="flex flex-col md:flex-row justify-between border-b border-gray-100 pb-6 mb-8 gap-4">
                          <div>
                              <span className="text-[10px] font-black bg-gray-900 text-white px-3 py-1 rounded-lg uppercase tracking-widest">Order #{o.orderId}</span>
                              <p className="text-xs text-gray-400 font-bold mt-2 uppercase flex items-center gap-1">
                                <Clock size={12} /> Placed on {new Date(o.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                              </p>
                          </div>
                          <div className="md:text-right">
                              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Grand Total</p>
                              <p className="text-3xl font-black text-orange-600">₹{o.totalAmount}</p>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                          <div>
                              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                  <MapPin size={14} className="mr-2 text-orange-600" /> Pickup Address
                              </h4>
                              <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
                                  <p className="font-bold text-gray-800">{o.customerName}</p>
                                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{o.pickupLocation?.fullAddress || 'Address details unavailable'}</p>
                                  <div className="flex flex-wrap gap-4 items-center mt-3">
                                      <p className="text-xs font-bold text-gray-500">📞 {o.phone || 'N/A'}</p>
                                      <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-orange-100 rounded-full">
                                          <CreditCard size={10} className="grayscale" />
                                          <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">{o.paymentMethod || 'COD'}</span>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div>
                              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                  <ShoppingBag size={14} className="mr-2 text-orange-600" /> Order Summary
                              </h4>
                              <ul className="space-y-3">
                                  {o.items.map((item, idx) => (
                                      <li key={idx} className="flex justify-between items-center text-sm">
                                          <span className="font-bold text-gray-700">{item.name} <span className="text-gray-400 ml-1">x{item.quantity}</span></span>
                                          <span className="font-black text-gray-900">{item.weight}</span>
                                          <span className="font-black text-gray-900">₹{item.price * item.quantity}</span>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>

                      {/* Payment WhatsApp Warning for Processing Orders */}
                      {o.status === "Processing" && (
                          <div className="bg-orange-100/50 border border-orange-200 p-4 rounded-2xl mb-8 flex items-start gap-4">
                              <div className="text-xl mt-1">📱</div>
                              <div>
                                  <p className="text-xs font-black text-orange-800 uppercase tracking-widest mb-1">Payment Verification Pending</p>
                                  <p className="text-sm font-bold text-orange-700/80 leading-relaxed">
                                      Our team will contact you shortly via phone or WhatsApp to verify your order and provide payment instructions. 
                                      We are currently not using automated payment gateways to ensure a personal touch. We appreciate your cooperation!
                                  </p>
                              </div>
                          </div>
                      )}

                      {/* Progress Bar */}
                      <div className="relative py-10">
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
                          <div className="absolute top-1/2 left-0 h-0.5 bg-orange-600 -translate-y-1/2 z-10 transition-all duration-1000" style={{ width: progressWidth }}></div>
                          <div className="flex justify-between relative z-20">
                              {statusSteps.map((step, idx) => (
                                  <div key={idx} className="flex flex-col items-center">
                                      <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] ${idx <= statusIndex ? 'bg-orange-600 shadow-[0_0_0_4px_rgba(234,88,12,0.2)] text-white' : 'bg-gray-100'}`}>
                                          {idx <= statusIndex && <CheckCircle size={12} strokeWidth={4} />}
                                      </div>
                                      <span className={`text-[8px] md:text-[10px] font-black uppercase mt-3 text-center ${idx <= statusIndex ? 'text-orange-600' : 'text-gray-300'}`}>
                                        {step}
                                      </span>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                          <p className="text-xs font-bold text-gray-500">Current Status: <span className="text-orange-600 font-black uppercase tracking-widest">{o.status}</span></p>
                          
                          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                              {isDelivered ? (
                                  alreadyReviewed ? (
                                      <div className="flex-1 md:flex-none bg-green-50 text-green-600 text-[10px] font-black uppercase px-8 py-4 rounded-2xl border border-green-100 flex items-center justify-center gap-2">
                                          <CheckCircle size={14} /> Review Submitted
                                      </div>
                                  ) : (
                                      <button onClick={() => openReviewModal(o._id)} className="flex-1 md:flex-none bg-orange-600 hover:bg-black text-white text-[10px] font-black uppercase px-8 py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2">
                                          <Star size={14} fill="currentColor" /> Review Product
                                      </button>
                                  )
                              ) : (
                                  <button disabled className="flex-1 md:flex-none bg-gray-100 text-gray-400 text-[10px] font-black uppercase px-8 py-4 rounded-2xl cursor-not-allowed">
                                      Review available after delivery
                                  </button>
                              )}
                              
                              <button onClick={() => downloadInvoice(o._id)} className="flex-1 md:flex-none bg-gray-900 hover:bg-orange-600 text-white text-[10px] font-black uppercase px-8 py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2">
                                  <FileText size={14} /> Invoice
                              </button>
                          </div>
                      </div>
                  </div>
                );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
            <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-fade-in">
                <button onClick={closeReviewModal} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition">
                  <X size={20} />
                </button>
                
                <div className="text-center mb-6 mt-2">
                    <h3 className="text-2xl font-black text-gray-900">Share Your <span className="text-orange-600">Experience</span></h3>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">How was the heat?</p>
                </div>

                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center block mb-2">Overall Rating</label>
                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setRating(star)} className={`text-4xl transition-colors ${rating >= star ? 'text-orange-400' : 'text-gray-200 hover:text-orange-200'}`}>
                        ★
                      </button>
                    ))}
                </div>

                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center block mb-2">Spice Intensity</label>
                <div className="flex justify-center gap-4 mb-6 bg-orange-50 p-4 rounded-2xl border border-orange-100">
                    {[1, 2, 3, 4, 5].map(spice => (
                      <button key={spice} onClick={() => setSpiceLevel(spice)} className={`transition-all text-2xl ${spiceLevel >= spice ? 'grayscale-0 scale-110' : 'grayscale opacity-50 hover:grayscale-0'}`} title={`Level ${spice}`}>
                        🌶️
                      </button>
                    ))}
                </div>

                <textarea 
                  placeholder="Describe the taste, crunch, and heat..." 
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-orange-50 border border-orange-100 p-5 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-600 font-bold transition-all resize-none mb-4"
                ></textarea>

                <div className="mb-6">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setReviewImage(e.target.files[0])}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-orange-100 file:text-orange-600 cursor-pointer" 
                    />
                </div>

                <div className="flex gap-3">
                    <button onClick={handleReviewSubmit} disabled={submittingReview} className="flex-1 bg-gray-900 text-white font-black py-4 rounded-2xl hover:bg-orange-600 transition-all uppercase tracking-widest text-xs disabled:opacity-50 flex justify-center items-center">
                        {submittingReview ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Post Review"}
                    </button>
                    <button onClick={closeReviewModal} disabled={submittingReview} className="px-6 bg-gray-100 text-gray-400 font-black py-4 rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
            <div className="bg-white p-10 rounded-[2rem] text-center max-w-sm w-full animate-fade-in relative overflow-hidden">
                <div className="w-16 h-16 bg-green-50 border-4 border-green-500 text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">Review Posted!</h2>
                <p className="text-gray-500 text-sm mt-2 font-bold">Your experience has been shared successfully.</p>
                <div className="absolute bottom-0 left-0 h-1 bg-green-500 w-full animate-[shrink_3s_linear_forwards]"></div>
            </div>
        </div>
      )}
    </div>
  );
}

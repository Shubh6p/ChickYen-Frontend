import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, ShoppingBag } from 'lucide-react';

import config from '../config';

export default function Reviews() {
  const [allReviews, setAllReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const galleryRef = useRef(null);

  const reviewsPerPage = 10;
  const VITE_API_URL = import.meta.env.VITE_API_URL || `${config.API_BASE_URL}`;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/reviews/public`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setAllReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  const photoOnly = allReviews.filter(r => r.imageUrl);
  
  const totalPages = Math.ceil(allReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const paginatedReviews = allReviews.slice(startIndex, endIndex);

  const scrollGallery = (distance) => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  const openModal = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
    document.body.style.overflow = 'auto';
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: document.getElementById('reviewsFeed')?.offsetTop - 150, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#FFFBF7] min-h-screen font-['Plus_Jakarta_Sans']">
      
      <header className="max-w-6xl mx-auto text-center mt-12 mb-12 px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-bold text-xs uppercase tracking-widest mb-4">
              <CheckCircle2 size={14} />
              <span>Verified Taste Tests</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter">
              The <span className="text-orange-600 italic">Wall</span> of Love
          </h1>
          <p className="mt-4 text-gray-500 font-medium text-lg max-w-2xl mx-auto italic">
              "The heat you can't resist, the flavor you'll always remember."
          </p>
      </header>

      {/* PHOTO GALLERY SECTION */}
      {photoOnly.length > 0 && (
        <section className="max-w-7xl mx-auto mb-16 px-6 relative group">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Customer Gallery</h3>
                    <p className="text-xs font-bold text-orange-600">Real photos from real kitchens.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => scrollGallery(-300)}
                        className="w-10 h-10 rounded-full border border-orange-200 flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => scrollGallery(300)}
                        className="w-10 h-10 rounded-full border border-orange-200 flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div ref={galleryRef} className="flex gap-5 overflow-x-auto pb-8 snap-x no-scrollbar scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {photoOnly.map((r) => (
                    <div 
                        key={r._id}
                        onClick={() => openModal(r)}
                        className="flex-shrink-0 w-44 h-60 rounded-[2.5rem] overflow-hidden cursor-pointer snap-start relative group shadow-lg"
                    >
                        <img 
                          src={`${VITE_API_URL.replace('/api', '')}${r.imageUrl}`} 
                          alt="Review"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                ))}
            </div>
        </section>
      )}

      {/* REVIEWS FEED SECTION */}
      <section className="max-w-4xl mx-auto px-6 mb-20" id="reviewsFeed">
          <div className="border-b border-gray-100 pb-6 mb-10">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Verified Feedback</h3>
          </div>

          <div className="space-y-16">
            {paginatedReviews.map((r) => {
              const postDate = new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
              const buyDate = r.purchaseDate ? new Date(r.purchaseDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recently';

              return (
                <div key={r._id} className="bg-white p-8 md:p-10 rounded-[3.5rem] border border-orange-50 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(234,88,12,0.15)]">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl">
                                {r.customerName ? r.customerName[0].toUpperCase() : 'Y'}
                            </div>
                            <div>
                                <h4 className="text-base font-black text-gray-900 uppercase tracking-tight leading-none">{r.customerName || 'Anonymous'}</h4>
                                <p className="text-[10px] text-green-600 font-black uppercase tracking-widest mt-1">Verified Purchase ✅</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Posted On</p>
                            <p className="text-[11px] font-bold text-gray-600">{postDate}</p>
                        </div>
                    </div>

                    <div className="flex gap-6 mb-6">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Rating</p>
                            <p className="text-sm font-bold text-orange-500">{"⭐".repeat(r.rating || 5)}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Heat Level</p>
                            <p className="text-sm font-bold text-red-600">{"🌶️".repeat(r.spiceLevel || 1)}</p>
                        </div>
                    </div>

                    <p className="text-2xl font-bold text-gray-800 leading-relaxed tracking-tight mb-8">"{r.comment}"</p>

                    <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">🛍️</span>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Items Bought</p>
                                <div className="text-xs font-black text-gray-900 leading-tight">
                                    {r.orderId?.items?.map((item, idx) => (
                                        <div key={idx}>
                                            {item.name} <span className="text-orange-600 font-bold ml-1">({item.quantity}x{item.weight})</span>
                                        </div>
                                    )) || 'Standard Pack (Original)'}
                                </div>
                            </div>
                        </div>
                        <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Bought In</p>
                            <p className="text-[11px] font-bold text-gray-700 uppercase italic">{buyDate}</p>
                        </div>
                    </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-20 flex flex-wrap justify-center items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-12 h-12 rounded-xl font-black text-xs transition-all duration-300 ${page === currentPage ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-100 hover:bg-orange-50'}`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
      </section>

      {/* PHOTO MODAL */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-0 md:p-12">
            <div className="bg-white w-full max-w-7xl h-full md:h-[85vh] md:rounded-[4rem] overflow-hidden flex flex-col md:flex-row relative">
                <button onClick={closeModal} className="absolute top-8 right-8 z-50 bg-black/10 text-white w-14 h-14 rounded-full flex items-center justify-center font-bold backdrop-blur-md border border-white/20 hover:bg-orange-600 transition-colors">
                    <X size={24} />
                </button>

                <div className="flex-[1.4] bg-[#0a0a0a] flex items-center justify-center p-4">
                    <img src={`${VITE_API_URL.replace('/api', '')}${selectedReview.imageUrl}`} className="max-w-full max-h-full object-contain shadow-2xl" alt="Customer Review" />
                </div>

                <div className="flex-1 p-12 flex flex-col justify-between bg-white overflow-y-auto no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="flex flex-col h-full">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between pr-16 md:pr-0">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Rating</span>
                                    <div className="flex text-orange-500 text-sm">{"⭐".repeat(selectedReview.rating || 5)}</div>
                                </div>
                                <div className="flex flex-col items-end mr-4">
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Spice Intensity</span>
                                    <div className="flex text-sm">{"🌶️".repeat(selectedReview.spiceLevel || 1)}</div>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-[1.2] tracking-tighter italic">"{selectedReview.comment}"</h2>
                            
                            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                                      <ShoppingBag size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Authentic Product</p>
                                        <div className="text-base font-black text-gray-900 uppercase tracking-tight">
                                            {selectedReview.orderId?.items?.map((item, idx) => (
                                                <div key={idx}>
                                                    {item.name} <span className="text-orange-600 font-bold ml-1">({item.quantity}x{item.weight})</span>
                                                </div>
                                            )) || 'Standard Pack (Original)'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200/50">
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Ordered On</p>
                                        <p className="text-[10px] font-bold text-gray-700">
                                          {selectedReview.purchaseDate ? new Date(selectedReview.purchaseDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Recently'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Review Posted</p>
                                        <p className="text-[10px] font-bold text-gray-700">
                                          {new Date(selectedReview.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-5 pt-12 mt-auto border-t border-gray-50">
                            <div className="w-16 h-16 bg-gray-900 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-2xl">
                              {selectedReview.customerName ? selectedReview.customerName[0].toUpperCase() : 'Y'}
                            </div>
                            <div>
                                <p className="font-black text-gray-900 text-xl uppercase tracking-tight leading-none mb-1">{selectedReview.customerName || 'Anonymous'}</p>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Verified Contributor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Additional CSS for hiding scrollbar globally in this component */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}

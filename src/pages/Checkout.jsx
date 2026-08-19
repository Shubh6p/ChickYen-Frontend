import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, CreditCard, ChevronRight, CheckCircle } from 'lucide-react';

import config from '../config';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [pickupPoints, setPickupPoints] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [selectedPickup, setSelectedPickup] = useState(null);

  // Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
    
    // Don't redirect to menu if we just successfully placed an order
    if (cart.length === 0 && !placedOrder && !showSuccessModal) {
      navigate('/menu');
    }
  }, [user, isAuthenticated, cart, navigate, placedOrder, showSuccessModal]);

  useEffect(() => {
    const fetchPickupPoints = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/locations/pickup-points`);
        setPickupPoints(res.data);
      } catch (err) {
        console.error("Failed to fetch pickup points", err);
      } finally {
        setLoadingPoints(false);
      }
    };
    fetchPickupPoints();
  }, []);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/orders');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please provide your full name for the order.");
      return;
    }
    if (!user) {
      alert("Please login before placing an order.");
      navigate('/login');
      return;
    }
    if (!selectedPickup) {
      alert("Please select a pickup point to proceed!");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        customerId: user._id,
        customerName: name,
        email: email,
        phone: phone,
        pickupLocation: {
          locationName: selectedPickup.name,
          fullAddress: selectedPickup.address
        },
        paymentMethod: 'upi',
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          weight: item.weight,
          image: item.image
        }))
      };

      const res = await axios.post(`${config.API_BASE_URL}/orders/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPlacedOrder({
        orderId: res.data.orderId,
        customerName: name,
        pickupAddr: selectedPickup.address,
        items: cart
      });
      setShowSuccessModal(true);
      clearCart();
      
    } catch (err) {
      setError(err.response?.data?.error || 'Server error connection.');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccessModal && placedOrder) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div className="bg-[#FFF8F0] w-full max-w-md p-8 rounded-[3rem] shadow-2xl text-center border-4 border-white animate-fade-in relative">
            <button 
              onClick={() => { setShowSuccessModal(false); navigate('/orders'); }}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition"
            >
              <User size={16} className="hidden" /> {/* Temp hidden icon to reuse imports, normally use X */}
              <span className="font-bold text-sm">✕</span>
            </button>
            <div className="text-4xl mb-4 mt-2">🎉</div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Order Placed!</h2>
            <div className="text-left text-xs bg-white/80 p-5 rounded-3xl border border-orange-100 space-y-2 mb-6">
                <p><strong>Order ID:</strong> <span className="text-orange-600">#{placedOrder.orderId}</span></p>
                <p><strong>Customer:</strong> <span>{placedOrder.customerName}</span></p>
                <p><strong>Pickup At:</strong> <span className="text-gray-500">{placedOrder.pickupAddr}</span></p>
                <div className="pt-2 border-t border-orange-50 mt-2">
                    <p className="font-bold uppercase text-[10px] text-gray-400">Items:</p>
                    <ul className="mt-1 font-bold text-gray-700 list-disc ml-4">
                      {placedOrder.items.map((item, idx) => (
                        <li key={idx}>{item.name} (x{item.quantity}) - <span className="font-normal">{item.weight}</span></li>
                      ))}
                    </ul>
                </div>
            </div>
            <p className="text-xs text-gray-400 font-bold animate-pulse">Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
      
      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-bold">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT COLUMN: Personal Details & Pickup Points */}
        <div className="bg-white/85 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border border-orange-600/10 space-y-8">
          
          {/* Personal Details */}
          <div>
            <h2 className="text-2xl font-black mb-6 text-gray-800 flex items-center gap-2">👤 Personal Details</h2>
            <div className="space-y-4">
              <div className="text-left">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Full Name</label>
                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/50 border border-orange-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-600 transition" required />
              </div>

              <div className="text-left">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-1 block flex items-center gap-1">
                    Email <span className="text-green-500 font-black tracking-normal lowercase text-[9px] bg-green-50 px-2 py-0.5 rounded-full">Verified</span>
                  </label>
                  <input type="email" placeholder="Email Address" value={email} readOnly
                      className="w-full bg-gray-100 border border-orange-100 px-5 py-4 rounded-2xl outline-none cursor-not-allowed opacity-70" required />
              </div>

              <div className="text-left">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-1 block flex items-center gap-1">
                    Phone
                  </label>
                  <input type="text" placeholder="Phone Number" value={phone} readOnly
                      className="w-full bg-gray-100 border border-orange-100 px-5 py-4 rounded-2xl outline-none cursor-not-allowed opacity-70" required />
              </div>
            </div>
          </div>

          {/* Pickup Points */}
          <div>
            <h2 className="text-2xl font-black mb-6 text-gray-800 flex items-center gap-2">📍 Select Pickup Point</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {loadingPoints ? (
                <div className="animate-pulse text-gray-400 text-sm italic">Loading pickup points...</div>
              ) : pickupPoints.length === 0 ? (
                <p className="text-gray-400 text-xs italic">No pickup points available.</p>
              ) : (
                pickupPoints.map((loc) => (
                  <label key={loc._id} className={`flex items-start p-4 rounded-2xl cursor-pointer border-2 transition relative ${selectedPickup?._id === loc._id ? 'border-orange-600 bg-orange-50' : 'border-transparent bg-white shadow-sm hover:border-orange-200'}`}>
                      <input 
                        type="radio" 
                        name="pickupLoc" 
                        className="mt-1 w-5 h-5 accent-orange-600" 
                        checked={selectedPickup?._id === loc._id}
                        onChange={() => setSelectedPickup(loc)}
                      />
                      <div className="ml-4 flex-grow">
                          <p className="font-black text-gray-800 text-sm uppercase">{loc.name}</p>
                          <p className="text-[10px] text-gray-500 mt-1">{loc.address}</p>
                          {loc.googleMapsLink && (
                            <a href={loc.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline mt-2 inline-block">📍 Map Link</a>
                          )}
                      </div>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Payment & Order Summary */}
        <div className="bg-white/85 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border border-orange-600/10 h-fit">
          <h2 className="text-2xl font-black mb-6 text-gray-800 flex items-center gap-2">💳 Payment</h2>
          
          <div className="space-y-3 mb-8">
            <label className="flex flex-col p-4 bg-white border-2 border-orange-600 rounded-2xl cursor-pointer transition shadow-xl shadow-orange-100/50">
                <div className="flex items-center">
                    <input type="radio" name="payment" value="upi" className="w-5 h-5 accent-orange-600" checked readOnly />
                    <span className="ml-3 font-bold text-gray-800 uppercase text-xs tracking-widest">Digital Payment (UPI)</span>
                </div>
                <div className="mt-4 px-4 py-3 bg-orange-50 rounded-xl border border-orange-100 border-dashed">
                    <p className="text-[10px] text-orange-800 font-bold leading-relaxed">
                        <span className="mr-1">ℹ️</span>
                        Manual Verification: We'll share our payment details via WhatsApp once you confirm. We're currently transitioning to automated payments to serve you better!
                    </p>
                </div>
            </label>

            <label className="flex items-center p-4 bg-gray-50 rounded-2xl cursor-not-allowed border-2 border-transparent opacity-60 transition">
                <input type="radio" name="payment" value="cod" className="w-5 h-5 accent-gray-400" disabled />
                <div className="ml-3 flex flex-col">
                    <span className="font-bold text-gray-400 uppercase text-xs tracking-widest line-through">Cash on Delivery</span>
                    <span className="text-[9px] font-black text-orange-600 uppercase tracking-tighter mt-1">Temporarily Unavailable</span>
                </div>
            </label>
          </div>

          <div className="border-t border-orange-100 pt-6">
            <h3 className="font-black text-gray-400 mb-4 uppercase text-xs tracking-widest">Order Summary</h3>
            
            <ul className="text-sm text-gray-600 mb-6 space-y-3 font-medium">
              {cart.map((item) => (
                <li key={item.id} className="flex items-center justify-between w-full py-1">
                  <span className="flex-1 text-left line-clamp-1">
                      {item.name} <span className="text-gray-400 font-medium">(x{item.quantity})</span>
                  </span>
                  <span className="flex-1 text-center font-bold text-orange-600">
                      {item.weight}
                  </span>
                  <span className="flex-1 text-right font-black text-gray-900">
                      ₹{item.price * item.quantity}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center bg-orange-600 p-5 rounded-2xl text-white shadow-lg">
                <span className="font-bold text-sm uppercase">Total</span>
                <span className="text-2xl font-black">₹{cartTotal}</span>
            </div>

            <button 
              type="button" 
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full mt-6 py-4 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-sm font-black flex justify-center items-center gap-2 ${loading ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-gray-900 hover:bg-black text-white active:scale-95'}`}
            >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : 'Confirm Order'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

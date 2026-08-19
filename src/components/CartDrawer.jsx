import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, cartTotal, isCartOpen, setIsCartOpen, changeQty, removeItem, cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Floating Cart Button */}
      {location.pathname === '/menu' && (
        <button
          id="cartToggle"
          onClick={(e) => {
            e.stopPropagation();
            setIsCartOpen(!isCartOpen);
          }}
          className={`fixed bottom-6 right-6 md:right-10 bg-orange-600 text-white p-4 sm:p-5 rounded-full shadow-2xl z-50 hover:bg-black hover:scale-110 transition-all flex items-center justify-center ${cartCount === 0 ? 'hidden' : ''}`}
        >
          <span className="text-lg sm:text-xl">🛒</span>
          {cartCount > 0 && (
            <span 
              id="navCartCount"
              className="absolute -top-1 -right-1 bg-white text-orange-600 text-[10px] font-black w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-md border border-orange-100"
            >
              {cartCount}
            </span>
          )}
        </button>
      )}

      {/* Cart Panel */}
      <div 
        id="cartPanel"
        onClick={(e) => e.stopPropagation()}
        className={`fixed bottom-24 right-4 sm:right-6 w-[320px] sm:w-[350px] max-w-[92vw] cart-glass shadow-2xl rounded-[2rem] p-4 sm:p-6 z-50 border-white/20 transition-all duration-300 ${isCartOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <h3 className="text-lg sm:text-xl font-black mb-4 flex justify-between items-center">
          Your Bag 
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-400 text-xs uppercase font-bold tracking-widest"
          >
            Close
          </button>
        </h3>
        
        <div id="cartItems" className="space-y-4 max-h-[35vh] sm:max-h-[45vh] overflow-y-auto pr-1 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-10 px-4 flex flex-col items-center">
              <p className="text-gray-400 text-sm italic font-medium mb-4">Your jar is empty... please fill it up with our spicy ChickYen Achar!</p>
              <button 
                onClick={() => { setIsCartOpen(false); navigate('/menu'); }}
                className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-orange-700 transition"
              >
                Go to Menu
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-white/50 p-3 rounded-2xl border border-orange-50 mb-2">
                <div className="flex items-center space-x-3">
                  <img src={item.image?.startsWith('http') ? item.image : `/${item.image}`} className="w-12 h-12 rounded-xl object-cover" alt={item.name} />
                  <div>
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{item.weight || '250g'}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button onClick={() => changeQty(item.id, -1)} className="px-2 bg-orange-100 rounded text-xs">-</button>
                      <span className="text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => changeQty(item.id, 1)} className="px-2 bg-orange-100 rounded text-xs">+</button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                    <p className="font-black text-sm text-gray-800">₹{item.price * item.quantity}</p>
                    <button onClick={() => removeItem(item.id)} className="text-[9px] text-gray-400 hover:text-red-500 font-bold uppercase mt-1">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-orange-100">
            <div className="flex justify-between font-black text-base sm:text-lg mb-4 px-1">
                <span>Total</span>
                <span id="cartTotal" className="text-orange-600">₹{cartTotal}</span>
            </div>
            <button 
                id="checkoutBtn"
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full text-white font-bold py-3 sm:py-4 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-xs sm:text-sm ${cart.length === 0 ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-orange-600 hover:bg-black shadow-orange-100'}`}
            >
                Checkout Now
            </button>
        </div>
      </div>
    </>
  );
}

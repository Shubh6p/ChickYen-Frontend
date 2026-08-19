import { useCart } from '../context/CartContext';

import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const spiceCount = Number(product.spiceLevel) || 1;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  const handleAdd = (e) => {
    const cartIcon = document.getElementById("cartToggle");
    const button = e.currentTarget;
    
    if (cartIcon && button) {
      const img = document.createElement("img");
      img.src = product.image?.startsWith('http') ? product.image : `/${product.image}`;
      img.className = "fly-img";
      document.body.appendChild(img);

      const btnRect = button.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      img.style.top = btnRect.top + "px";
      img.style.left = btnRect.left + "px";

      requestAnimationFrame(() => {
        img.style.transform = `translate(${cartRect.left - btnRect.left}px, ${cartRect.top - btnRect.top}px) scale(0.1)`;
        img.style.opacity = "0";
      });

      setTimeout(() => img.remove(), 800);
    }
    
    addToCart(product);
  };

  return (
    <div className={`bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 group ${isOutOfStock ? 'opacity-75' : ''}`}>
      <div className="relative overflow-hidden rounded-[2rem] aspect-square bg-gray-100 mb-4 group">
        <img 
          src={product.image?.startsWith('http') ? product.image : `/${product.image}`} 
          alt={product.name}
          className={`object-cover w-full h-full group-hover:scale-110 transition duration-500 ${isOutOfStock ? 'grayscale' : ''}`}
        />
        
        {product.weight && (
          <div className="absolute bottom-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-black">
            {product.weight}
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <Link to="/reviews" className="bg-white text-gray-900 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-orange-600 hover:text-white transition">
              See Product Reviews
           </Link>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className={`text-lg font-black ${isOutOfStock ? 'text-gray-400' : 'text-gray-800'}`}>{product.name}</h3>
          <span className="text-lg font-bold text-orange-600">₹{product.price}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-orange-500 text-[10px]">
            ⭐⭐⭐⭐⭐
          </div>
          <Link to="/reviews" className="inline-flex items-center">
              <button className="bg-orange-500 text-white px-3 py-1 rounded-lg flex items-center gap-2 shadow-sm hover:bg-gray-900 transition-all duration-300 group">
                  <span className="text-[9px] font-black uppercase tracking-widest">
                      See Reviews
                  </span>
                  <i className="fa-solid fa-star text-[8px] animate-pulse"></i>
              </button>
          </Link>
        </div>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {product.description}
        </p>

        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isOutOfStock ? 'bg-gray-100 text-gray-500' : isLowStock ? 'bg-red-100 text-red-600' : 'hidden'}`}>
          {isOutOfStock ? 'Out of Stock' : 'Limited Stock'}
        </span>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xs font-bold text-gray-400 uppercase">
            Spice:
            <span className="text-red-500">{"🌶️".repeat(spiceCount)}</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`px-6 py-2 rounded-xl font-bold transition ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-orange-600'}`}
          >
            {isOutOfStock ? 'Sold Out' : 'Add +'}
          </button>
        </div>
      </div>
    </div>
  );
}

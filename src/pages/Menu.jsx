import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

import config from '../config';

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Updated port based on standard dev server vs actual backend. Assuming backend is 5000.
        const res = await axios.get(`${config.API_BASE_URL}/products/public`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
      <header className="text-center py-8 md:py-12 px-6">
        <span className="text-orange-600 font-bold tracking-[0.2em] uppercase text-xs sm:text-sm">Our Specialties</span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mt-2">
          Yen Singju <span className="text-orange-600">Series</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-4 max-w-xl mx-auto">
          Hand-shredded chicken mixed with traditional Manipuri herbs, infused with the heat of roasted U-Morok.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 font-bold">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8" id="productsContainer">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}

          {/* Static Coming Soon Card */}
          <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-dashed border-orange-300 flex flex-col justify-between">
            <div className="relative overflow-hidden rounded-[2rem] aspect-square bg-orange-50 flex items-center justify-center">
              <span className="text-orange-600 font-black text-base sm:text-lg text-center px-6">Customize Your Own Pickle</span>
              <div className="absolute top-4 left-4 bg-orange-600 px-3 py-1 rounded-full text-[10px] font-bold text-white">🚧 Coming Soon</div>
            </div>
            <div className="p-4">
              <h3 className="text-lg sm:text-xl font-black text-gray-800">Custom Taste</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-6">Choose ingredients, spice level, and oil quantity.</p>
              <button 
                onClick={() => alert("Notification feature coming soon!")} 
                className="w-full bg-gray-200 text-gray-500 px-6 py-2 rounded-xl font-bold cursor-not-allowed text-sm hover:bg-gray-300 transition"
              >
                Notify Me
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminModal } from '../../context/AdminModalContext';
import { Box, Plus, Search, Edit2, Trash2, Tag, Percent } from 'lucide-react';

import config from '../../config';

export default function Products() {
  const { adminToken } = useAdminAuth();
  const { showConfirm, showAlert } = useAdminModal();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '', category: 'Pickle', price: '', oldPrice: '', weight: '',
    spiceLevel: 1, type: 'Non-Veg', image: '', isAvailable: true, stock: 0, description: ''
  });

  const fetchProducts = async () => {
    try {
      // NOTE: Using admin product endpoint
      const res = await axios.get(`${config.API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (currentProduct._id) {
        // Edit
        await axios.put(`${config.API_BASE_URL}/products/${currentProduct._id}`, currentProduct, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
      } else {
        // Create
        await axios.post(`${config.API_BASE_URL}/products/add`, currentProduct, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
      }
      setIsModalOpen(false);
      fetchProducts();
      showAlert({ title: 'Success', message: 'Product saved successfully!', icon: '✅', confirmColor: 'bg-green-600' });
    } catch (error) {
      console.error("Error saving product:", error);
      showAlert({ title: 'Error', message: 'Failed to save product', icon: '❌', confirmColor: 'bg-red-600' });
    }
  };

  const handleDeleteProduct = async (id) => {
    showConfirm({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product?',
      icon: '🗑️',
      confirmColor: 'bg-red-600',
      onConfirm: async () => {
        try {
          await axios.delete(`${config.API_BASE_URL}/products/${id}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          fetchProducts();
        } catch (error) {
          console.error("Error deleting product:", error);
          showAlert({ title: 'Error', message: 'Failed to delete product', icon: '❌', confirmColor: 'bg-red-600' });
        }
      }
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
            <Box size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Products</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{products.length} total items</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-medium text-sm"
            />
          </div>
          <button 
            onClick={() => {
              setCurrentProduct({ name: '', category: 'Pickle', price: '', oldPrice: '', weight: '', spiceLevel: 1, type: 'Non-Veg', image: '', isAvailable: true, stock: 0, description: '' });
              setIsModalOpen(true);
            }}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group">
              <div className="h-48 bg-gray-100 relative">
                <img src={product.image || "https://placehold.co/400x300?text=No+Image"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.isAvailable ? 'Active' : 'Hidden'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? (product.stock < 10 ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700') : 'bg-red-100 text-red-700'}`}>
                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">{product.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  <span>{product.weight}</span> • <span>{product.category}</span>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    {product.oldPrice && <p className="text-gray-400 line-through text-sm font-bold">₹{product.oldPrice}</p>}
                    <p className="text-2xl font-black text-orange-600">₹{product.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setCurrentProduct(product); setIsModalOpen(true); }}
                      className="w-10 h-10 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center hover:bg-orange-600 hover:text-white transition"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product._id)}
                      className="w-10 h-10 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-black text-gray-900">{currentProduct._id ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition text-2xl font-black">&times;</button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-grow custom-scrollbar">
              <form id="productForm" onSubmit={handleSaveProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                    <input type="text" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} required className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <select value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold appearance-none">
                      <option value="Pickle">Pickle</option>
                      <option value="Snack">Snack</option>
                      <option value="Spice">Spice</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                    <input type="number" value={currentProduct.price || ''} onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} required className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Old Price (Optional)</label>
                    <input type="number" value={currentProduct.oldPrice || ''} onChange={e => setCurrentProduct({...currentProduct, oldPrice: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Weight (e.g. 250g)</label>
                    <input type="text" value={currentProduct.weight || ''} onChange={e => setCurrentProduct({...currentProduct, weight: e.target.value})} required className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Spice Level (1-5)</label>
                    <input type="number" min="1" max="5" value={currentProduct.spiceLevel || 1} onChange={e => setCurrentProduct({...currentProduct, spiceLevel: Number(e.target.value)})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Image URL</label>
                    <input type="text" value={currentProduct.image || ''} onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})} required placeholder="https://..." className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description (Optional)</label>
                  <textarea value={currentProduct.description || ''} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} rows="3" placeholder="Add a delicious description..." className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold custom-scrollbar"></textarea>
                </div>

                <div className="flex gap-6 pt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={currentProduct.isAvailable || false} onChange={e => setCurrentProduct({...currentProduct, isAvailable: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-600" />
                    <span className="font-bold text-gray-700">Is Available (Visible)</span>
                  </label>
                  <div className="flex-grow flex items-center gap-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 whitespace-nowrap">Stock Quantity</label>
                    <input type="number" min="0" value={currentProduct.stock || 0} onChange={e => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})} required className="w-full max-w-[150px] px-5 py-2 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-bold" />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-200 transition">Cancel</button>
              <button type="submit" form="productForm" className="px-8 py-4 rounded-2xl font-black text-white bg-orange-600 hover:bg-black transition shadow-lg shadow-orange-200">
                {currentProduct._id ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

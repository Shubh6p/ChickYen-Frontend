import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminModal } from '../../context/AdminModalContext';
import { MapPin, Trash2, X, Plus } from 'lucide-react';

import config from '../../config';

export default function Locations() {
  const { adminToken } = useAdminAuth();
  const { showConfirm, showAlert } = useAdminModal();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [locName, setLocName] = useState('');
  const [locAddress, setLocAddress] = useState('');
  const [locMaps, setLocMaps] = useState('');

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/locations/pickup-points`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setLocations(res.data);
    } catch (err) {
      console.error("Failed to load locations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) fetchLocations();
  }, [adminToken]);

  const deleteLocation = async (id) => {
    showConfirm({
      title: 'Delete Location',
      message: 'Are you sure you want to delete this pickup point? This location will no longer be available for customer selection.',
      icon: '🗑️',
      confirmColor: 'bg-red-600',
      onConfirm: async () => {
        try {
          await axios.delete(`${config.API_BASE_URL}/locations/pickup-points/${id}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          setLocations(locations.filter(l => l._id !== id));
          showAlert({ title: 'Success', message: 'Location deleted successfully', icon: '✅', confirmColor: 'bg-green-600' });
        } catch (err) {
          console.error(err);
          showAlert({ title: 'Error', message: 'Failed to delete location.', icon: '❌', confirmColor: 'bg-red-600' });
        }
      }
    });
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`${config.API_BASE_URL}/locations/pickup-points`, {
        name: locName,
        address: locAddress,
        googleMapsLink: locMaps
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setIsModalOpen(false);
      setLocName('');
      setLocAddress('');
      setLocMaps('');
      fetchLocations();
      showAlert({ title: 'Success', message: 'Location saved successfully', icon: '✅', confirmColor: 'bg-green-600' });
    } catch (err) {
      console.error(err);
      showAlert({ title: 'Error', message: 'Failed to save pickup point.', icon: '❌', confirmColor: 'bg-red-600' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-600"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900" id="view-title">Pickup Points</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Manage customer collection centers.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-black transition flex items-center gap-2">
            <Plus size={16} /> Add New Point
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map(loc => (
            <div key={loc._id} className="admin-card p-6 rounded-[2.5rem] bg-white border border-orange-50 shadow-sm relative group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-100 rounded-2xl text-xl text-orange-600"><MapPin size={24} /></div>
                    <button onClick={() => deleteLocation(loc._id)} className="text-gray-300 hover:text-red-500 transition">
                        <Trash2 size={20} />
                    </button>
                </div>
                <h3 className="font-black text-gray-800 text-lg uppercase">{loc.name}</h3>
                <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">{loc.address}</p>
                {loc.googleMapsLink && (
                  <a href={loc.googleMapsLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                      Open in Maps ↗
                  </a>
                )}
            </div>
        ))}
        {locations.length === 0 && (
          <div className="col-span-full p-10 bg-white rounded-[2rem] text-center border border-gray-100">
            <p className="text-gray-500 font-bold">No pickup locations configured yet.</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-scale-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-gray-800">Add <span className="text-orange-600">Location</span></h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleLocationSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location Name</label>
                        <input 
                            type="text" 
                            required 
                            value={locName}
                            onChange={e => setLocName(e.target.value)}
                            placeholder="e.g., Downtown Store" 
                            className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-medium" 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Address</label>
                        <textarea 
                            required 
                            value={locAddress}
                            onChange={e => setLocAddress(e.target.value)}
                            placeholder="Complete physical address..." 
                            className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-medium h-24 resize-none"
                        ></textarea>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Google Maps Link</label>
                        <input 
                            type="url" 
                            value={locMaps}
                            onChange={e => setLocMaps(e.target.value)}
                            placeholder="https://goo.gl/maps/..." 
                            className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-medium" 
                        />
                    </div>
                    <button type="submit" disabled={saving} className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-orange-700 transition uppercase tracking-widest text-xs mt-4">
                        {saving ? 'Saving...' : 'Save Location'}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}

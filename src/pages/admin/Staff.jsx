import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminModal } from '../../context/AdminModalContext';
import { UserPlus, UserCog, Trash2, Edit2, X } from 'lucide-react';

import config from '../../config';

export default function Staff() {
  const { adminToken, adminUser } = useAdminAuth();
  const { showConfirm, showAlert } = useAdminModal();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [otp, setOtp] = useState('');

  const isOwner = adminUser?.role === 'owner';

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setStaffList(res.data);
    } catch (err) {
      console.error("Failed to load staff", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) fetchStaff();
  }, [adminToken]);

  const openAddModal = () => {
    setEditingStaffId(null);
    setName('');
    setEmail('');
    setRole('admin');
    setOtp('');
    setStep(1);
    setIsModalOpen(true);
  };

  const openEditModal = (staff) => {
    setEditingStaffId(staff._id);
    setName(staff.name);
    setEmail(staff.email);
    setRole(staff.role);
    setStep(1);
    setIsModalOpen(true);
  };

  const deleteStaff = async (id) => {
    showConfirm({
      title: 'Remove Staff',
      message: 'Are you sure you want to remove this staff member?',
      icon: '🗑️',
      confirmColor: 'bg-red-600',
      onConfirm: async () => {
        try {
          await axios.delete(`${config.API_BASE_URL}/auth/users/${id}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          setStaffList(staffList.filter(s => s._id !== id));
          showAlert({ title: 'Success', message: 'Staff member removed', icon: '✅', confirmColor: 'bg-green-600' });
        } catch (err) {
          console.error(err);
          showAlert({ title: 'Error', message: 'Failed to delete staff.', icon: '❌', confirmColor: 'bg-red-600' });
        }
      }
    });
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await axios.post(`${config.API_BASE_URL}/auth/register-staff-init`, { email }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setStep(2);
    } catch (err) {
      console.error(err);
      showAlert({ title: 'Error', message: err.response?.data?.error || 'Could not send invite code.', icon: '❌', confirmColor: 'bg-red-600' });
    } finally {
      setProcessing(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await axios.post(`${config.API_BASE_URL}/auth/register-staff-complete`, {
        email, otp, name, role
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setIsModalOpen(false);
      fetchStaff();
      showAlert({ title: 'Success', message: 'Admin added successfully!', icon: '✅', confirmColor: 'bg-green-600' });
    } catch (err) {
      console.error(err);
      showAlert({ title: 'Error', message: err.response?.data?.error || 'Invalid code.', icon: '❌', confirmColor: 'bg-red-600' });
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await axios.put(`${config.API_BASE_URL}/auth/update-staff/${editingStaffId}`, {
        name, email, role
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setIsModalOpen(false);
      fetchStaff();
      showAlert({ title: 'Success', message: 'Staff updated successfully!', icon: '✅', confirmColor: 'bg-green-600' });
    } catch (err) {
      console.error(err);
      showAlert({ title: 'Error', message: err.response?.data?.error || 'Update failed.', icon: '❌', confirmColor: 'bg-red-600' });
    } finally {
      setProcessing(false);
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
          <h2 className="text-2xl font-black text-gray-900" id="view-title">Staff Management</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Manage team access and permissions.</p>
        </div>
        {isOwner && (
          <button onClick={openAddModal} className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-orange-600 transition flex items-center gap-2">
              <UserPlus size={16} /> Register New Staff
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map(staff => (
            <div key={staff._id} className="admin-card p-6 rounded-[2.5rem] bg-white border border-orange-50 shadow-sm relative group">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">👤</div>
                    
                    {isOwner && staff.role !== 'owner' && (
                        <div className="flex gap-2">
                            <button onClick={() => openEditModal(staff)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => deleteStaff(staff._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>
                <h3 className="font-black text-gray-800 text-sm uppercase">{staff.name}</h3>
                <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest mb-2">{staff.role}</p>
                <p className="text-xs text-gray-400 truncate italic">{staff.email}</p>
                
                {staff.role === 'owner' && (
                    <div className="mt-4 pt-3 border-t border-gray-50">
                        <span className="text-[8px] bg-black text-white px-2 py-0.5 rounded-full uppercase font-black tracking-widest">Protected Account</span>
                    </div>
                )}
            </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-scale-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-gray-800">
                        {editingStaffId ? 'Edit' : step === 1 ? 'Invite' : 'Verify'} <span className="text-orange-600">{editingStaffId ? 'Staff' : 'Admin'}</span>
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition">
                        <X size={24} />
                    </button>
                </div>
                
                {step === 1 ? (
                    <form onSubmit={editingStaffId ? handleUpdate : sendOtp} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-medium" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-medium" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role</label>
                            <select value={role} onChange={e => setRole(e.target.value)} className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-medium appearance-none">
                                <option value="admin">Admin</option>
                                <option value="owner">Owner</option>
                            </select>
                        </div>
                        <button type="submit" disabled={processing} className={`w-full text-white font-black py-4 rounded-2xl shadow-lg transition uppercase tracking-widest text-xs mt-4 ${editingStaffId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-900 hover:bg-black'}`}>
                            {processing ? 'Processing...' : (editingStaffId ? 'Update Staff' : 'Send Invite Code')}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={verifyOtp} className="space-y-4">
                        <p className="text-sm text-gray-600 mb-4 text-center">We've sent a 6-digit code to <strong>{email}</strong>.</p>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Verification Code</label>
                            <input type="text" required value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 font-medium text-center tracking-widest text-lg" />
                        </div>
                        <button type="submit" disabled={processing} className="w-full bg-green-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-green-700 transition uppercase tracking-widest text-xs mt-4">
                            {processing ? 'Verifying...' : 'Verify & Add'}
                        </button>
                    </form>
                )}
            </div>
        </div>
      )}
    </div>
  );
}

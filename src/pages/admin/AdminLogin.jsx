import { useState } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';

import config from '../../config';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { handleAdminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await axios.post(`${config.API_BASE_URL}/auth/send-admin-otp`, { email });
      if (res.status === 200) {
        setStep(2);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Access Denied. Ensure your email is authorized.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await axios.post(`${config.API_BASE_URL}/auth/verify-admin-otp`, { email, otp });
      if (res.status === 200) {
        handleAdminLogin(res.data.user, res.data.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Verification failed. Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setOtp('');
    setErrorMsg('');
  };

  return (
    <div className="bg-[#FFF8F0] min-h-screen flex items-center justify-center p-6 w-full">
      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl border border-orange-100 relative overflow-hidden">
        
        <div className="text-center mb-8 relative z-10">
          <div className="text-orange-600 text-4xl mb-4">🛡️</div>
          <h1 className="text-3xl font-black text-gray-900">
              Admin <span className="text-orange-600">Access</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium text-sm">Secure OTP Authentication</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl text-center mb-6 border border-red-100">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: EMAIL INPUT */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-5 relative z-10">
            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Authorized Email
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@yenachar.com" required
                    className="w-full px-5 py-4 bg-gray-50 border border-orange-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 transition font-bold text-gray-800" />
            </div>

            <button type="submit" disabled={loading}
                className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-orange-600 transition-all active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Secure OTP'}
            </button>
          </form>
        )}

        {/* STEP 2: OTP INPUT */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-5 relative z-10">
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 mb-4">
                <p className="text-xs text-orange-800 font-medium text-center">
                    OTP sent to <span className="font-black">{email}</span>
                </p>
            </div>

            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Enter 6-Digit Code
                </label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" maxLength="6" required
                    className="w-full px-5 py-4 bg-gray-50 border border-orange-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 transition font-bold text-gray-800 text-center text-xl tracking-[0.5em]" />
            </div>

            <button type="submit" disabled={loading}
                className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50">
                {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button type="button" onClick={resetForm}
                className="w-full text-center text-xs font-black text-gray-400 uppercase tracking-widest hover:text-orange-600 transition mt-4">
                Try Different Email
            </button>
          </form>
        )}

        <p className="text-center mt-8 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
            Protected by Yen Achar Security
        </p>
      </div>
    </div>
  );
}

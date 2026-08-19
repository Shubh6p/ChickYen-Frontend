import { useState } from 'react';
import axios from 'axios';

import config from '../config';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: 'Bulk & Wholesale Inquiry',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastIcon, setToastIcon] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${config.API_BASE_URL}/contact/send`, formData);
      if (response.status === 200 || response.status === 201) {
        setToastMsg("Enquiry Shared! Our team will contact you.");
        setToastIcon("✓");
        setFormData({ ...formData, message: '', name: '', phone: '' });
      }
    } catch (error) {
      setToastMsg("Server Error. Please try again later.");
      setToastIcon("✕");
    } finally {
      setToastVisible(true);
      setLoading(false);
      setTimeout(() => setToastVisible(false), 4000);
    }
  };

  return (
    <div className="relative flex-grow flex flex-col w-full">
      <div className="blob top-0 left-0"></div>
      <div className="blob bottom-0 right-0" style={{ animationDelay: '-5s' }}></div>

      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex-grow w-full relative z-10">
          <div className="text-center mb-16">
              <h4 className="text-orange-600 font-black uppercase tracking-[0.3em] text-sm mb-4">Contact Us</h4>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">Let's start a <br className="hidden md:block" />
                <span className="text-orange-600 underline decoration-orange-200 underline-offset-8">conversation.</span>
              </h1>
          </div>

          <div className="contact-card rounded-[3rem] overflow-hidden flex flex-col lg:flex-row min-h-[700px]">

              <div className="lg:w-2/5 bg-gray-900 p-10 md:p-16 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 opacity-10 rounded-full -mr-32 -mt-32"></div>

                  <div className="relative z-10">
                      <h2 className="text-3xl font-bold mb-8 italic">Say Hello!</h2>

                      <div className="space-y-10">
                          <div className="group cursor-default">
                              <div className="flex items-center space-x-5">
                                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-orange-600 transition-colors">
                                      📍</div>
                                  <div>
                                      <p className="text-[10px] uppercase font-black text-orange-500 tracking-widest mb-1">Our Base</p>
                                      <p className="font-bold text-lg">Imphal West, Manipur</p>
                                  </div>
                              </div>
                          </div>

                          <div className="group cursor-default">
                              <div className="flex items-center space-x-5">
                                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-orange-600 transition-colors">
                                      📞</div>
                                  <div>
                                      <p className="text-[10px] uppercase font-black text-orange-500 tracking-widest mb-1">Direct Line</p>
                                      <p className="font-bold text-lg">+91 80020 12665</p>
                                  </div>
                              </div>
                          </div>

                          <div className="group cursor-default">
                              <div className="flex items-center space-x-5">
                                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-orange-600 transition-colors">
                                      ✉️</div>
                                  <div>
                                      <p className="text-[10px] uppercase font-black text-orange-500 tracking-widest mb-1">Email Support</p>
                                      <p className="font-bold text-lg lowercase">hello@yenachar.com</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="relative z-10 pt-16 border-t border-white/10 flex items-center justify-between">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Follow the heat</p>
                      <div className="flex space-x-3">
                          <a href="#" className="social-btn w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-bold text-xs hover:bg-orange-600">IG</a>
                          <a href="#" className="social-btn w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-bold text-xs hover:bg-orange-600">FB</a>
                          <a href="#" className="social-btn w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-bold text-xs hover:bg-orange-600">WA</a>
                      </div>
                  </div>
              </div>

              <div className="lg:w-3/5 p-10 md:p-16 flex flex-col justify-center">
                  <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Your Name</label>
                              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" required
                                  className="input-pill w-full px-6 py-5 bg-gray-100/50 border border-transparent rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all" />
                          </div>
                          <div className="space-y-2">
                              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Phone Number</label>
                              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 0000-0000" required
                                  className="input-pill w-full px-6 py-5 bg-gray-100/50 border border-transparent rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all" />
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">What's on your mind?</label>
                          <div className="relative">
                              <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                                  className="input-pill w-full px-6 py-5 bg-gray-100/50 border border-transparent rounded-[1.5rem] focus:outline-none appearance-none cursor-pointer">
                                  <option value="Bulk & Wholesale Inquiry">Bulk & Wholesale Inquiry</option>
                                  <option value="Delivery Tracking Support">Delivery Tracking Support</option>
                                  <option value="Product Feedback">Product Feedback</option>
                                  <option value="Just saying hi!">Just saying hi!</option>
                              </select>
                              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                  <i className="fa-solid fa-chevron-down"></i>
                              </div>
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Detailed Message</label>
                          <textarea rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Tell us more about your inquiry..." required
                              className="input-pill w-full px-6 py-5 bg-gray-100/50 border border-transparent rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all resize-none"></textarea>
                      </div>

                      <button type="submit" disabled={loading}
                          className="bg-orange-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-2xl shadow-orange-200 w-full md:w-auto transform active:scale-95 disabled:opacity-50">
                          {loading ? 'Submitting...' : 'Send Inquiry →'}
                      </button>
                  </form>
              </div>
          </div>
      </main>

      {/* Toast Notification */}
      <div 
        className={`fixed bottom-10 right-10 bg-gray-900 text-white px-8 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 font-black transition-all duration-500 flex items-center space-x-4 ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${toastIcon === '✓' ? 'bg-green-500' : 'bg-red-500'}`}>{toastIcon}</div>
          <span>{toastMsg}</span>
      </div>
    </div>
  );
}

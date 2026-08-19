import React from 'react';
import { Shield, Lock, ShieldCheck, MapPin, Package, Phone, UserCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <main className="flex-grow px-6 py-12 md:py-20 font-['Plus_Jakarta_Sans'] bg-[#FFF8F0]">
        <div className="max-w-4xl mx-auto">

            <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full mb-6">
                    <span className="text-orange-600 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2">
                        <Shield size={14} /> Trust & Transparency
                    </span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                    Privacy <span className="text-orange-600">Policy</span>
                </h1>
                <p className="text-gray-500 text-lg italic">
                    "Your data is as safe as our secret spice recipe."
                </p>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm mb-10 border border-orange-50">
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                    <Package className="mr-3 text-orange-600" /> Quality Check & Return Policy
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                    <p className="font-bold text-gray-800">
                        ChickYen Achar maintains a strict "No Returns Allowed" policy once an item has been accepted and removed from the designated pickup point.
                    </p>

                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                        <h4 className="font-black text-orange-600 uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                            <UserCheck size={14} /> Mandatory Agent Surveillance
                        </h4>
                        <p className="text-sm">
                            Customers are required to inspect items at the pickup point under the direct surveillance of our delivery agent. Complaints regarding product quality or quantity will not be entertained after leaving the point.
                        </p>
                    </div>

                    <ul className="list-disc pl-5 space-y-4 text-sm font-medium">
                        <li><strong>Mutual Disagreement:</strong> If both the agent and customer verify the product is unfit at the pickup point, the order will be held and rescheduled.</li>
                        <li><strong>Rescheduling:</strong> Verified quality issues result in an automated rescheduling notification sent via your registered contact.</li>
                        <li><strong>Refunds:</strong> Refunds are processed only if a replacement cannot be fulfilled. Credits typically appear in the original payment source within 5-7 business days.</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm mb-10 border border-orange-50">
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                    <MapPin className="mr-3 text-orange-600" /> Delivery Point Policy
                </h2>
                <div className="space-y-4 text-gray-600 text-sm leading-relaxed font-medium">
                    <p><strong>No Home Delivery:</strong> To maintain efficiency, we use a Designated Point System instead of doorstep delivery.</p>
                    <p><strong>The Arrival Call:</strong> When our partner reaches your selected point, you will receive a phone call. If you are unable to reach the point within 10-15 minutes, the order may be returned to the kitchen for rescheduling.</p>
                </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-orange-50">
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                    <Lock className="mr-3 text-orange-600" /> Privacy Policy
                </h2>
                <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
                    <p className="font-bold text-gray-800 text-base">We collect essential data (Name, Phone, Location) only to facilitate your orders.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h4 className="font-black text-orange-600 uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                                <ShieldCheck size={14} /> Secure Payments
                            </h4>
                            <p className="font-medium">We do not store bank or card details; all transactions occur via encrypted industry-standard gateways.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h4 className="font-black text-orange-600 uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                                <Phone size={14} /> No Data Sharing
                            </h4>
                            <p className="font-medium">Your contact data is strictly for delivery coordination and is never shared with third-party marketing agencies.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
}

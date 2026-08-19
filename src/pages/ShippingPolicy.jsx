import React from 'react';
import { Truck, MapPin, Phone, Handshake, Package, ShieldCheck, Info } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <main className="flex-grow px-6 py-12 md:py-20 font-['Plus_Jakarta_Sans'] bg-[#FFF8F0]">
        <div className="max-w-4xl mx-auto">

            <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full mb-6">
                    <span className="text-orange-600 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2">
                        <Truck size={14} /> Delivery Point Policy
                    </span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                    How We <span className="text-orange-600">Deliver</span>
                </h1>
                <p className="text-gray-500 text-lg italic">
                    "Simple, efficient, and direct. Here is how you get your pickles."
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-8 shadow-sm rounded-[2rem] border border-orange-50">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                        <MapPin size={24} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-3">No Home Delivery</h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-medium">
                        To maintain fast delivery and affordability, we use a <strong>Designated Point System</strong> instead of doorstep delivery.
                    </p>
                </div>

                <div className="bg-white p-8 shadow-sm rounded-[2rem] border border-orange-50">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                        <Package size={24} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-3">Select Your Point</h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-medium">
                        During checkout, select a predefined location (Point) near you from our list of trusted delivery hubs.
                    </p>
                </div>

                <div className="bg-white p-8 shadow-sm rounded-[2rem] border border-orange-50">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                        <Phone size={24} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-3">The Arrival Call</h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-medium">
                        When our partner reaches your point, you will receive a direct phone call on your registered number.
                    </p>
                </div>

                <div className="bg-white p-8 shadow-sm rounded-[2rem] border border-orange-50">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                        <Handshake size={24} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-3">Handover</h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-medium">
                        Proceed to the point to collect your order. Bring your Order ID or registered phone for verification.
                    </p>
                </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm mb-12 border border-orange-50">
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                    <Package className="mr-3 text-orange-600" /> Quality Check & Return Policy
                </h2>

                <div className="space-y-6 text-gray-600 leading-relaxed">
                    <p className="font-bold text-gray-800">
                        Please note that ChickYen Achar maintains a strict "No Returns Allowed" policy once an item has been accepted and taken away from the pickup point.
                    </p>

                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                        <h4 className="font-black text-orange-600 uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                            <ShieldCheck size={14} /> Mandatory Agent Surveillance
                        </h4>
                        <p className="text-sm text-gray-700 font-medium">
                            You are requested to inspect your items thoroughly at the designated pickup point. All inspections must occur under the direct surveillance of our delivery agent. Once you leave the pickup point, we cannot entertain complaints regarding product quality or quantity.
                        </p>
                    </div>

                    <ul className="list-disc pl-5 space-y-4 text-sm font-medium">
                        <li><strong>Mutual Disagreement on Quality:</strong> If the product appears damaged or unfit for consumption, and this is verified by both the customer and our agent on-site, the order will not be handed over.</li>
                        <li><strong>Rescheduling:</strong> In cases of verified quality issues at the point, the order will be rescheduled. You will receive an automated notification regarding the new delivery timeline via your registered phone/email.</li>
                        <li><strong>Refund Terms:</strong> If a replacement is unavailable, a refund will be processed under our Terms and Conditions. Refunds are typically credited back to the original payment source within 5-7 business days.</li>
                    </ul>
                </div>
            </div>

            <div className="bg-orange-600 rounded-[3rem] p-8 md:p-12 text-white text-center shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 text-orange-500 opacity-20">
                    <Info size={150} />
                </div>
                <h2 className="text-2xl font-black mb-4 relative z-10">Important Notice</h2>
                <p className="opacity-90 leading-relaxed max-w-2xl mx-auto font-medium relative z-10">
                    Please ensure your phone is reachable. If you are unable to reach the point within 10-15 minutes of the call, the order may be returned to the kitchen and will require rescheduling.
                </p>
            </div>
        </div>
    </main>
  );
}

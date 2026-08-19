import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FFF8F0] px-4 py-16">
      <div className="text-center max-w-lg mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-full shadow-sm border border-orange-100 text-orange-600">
              <FileQuestion size={64} strokeWidth={1.5} />
            </div>
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-4 tracking-tight">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Oops! The jar is empty.</h2>
        
        <p className="text-gray-500 mb-10 text-lg leading-relaxed">
          We can't seem to find the page you're looking for. It might have been moved, deleted, or perhaps it was too spicy to handle!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-gray-700 font-bold border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-orange-600 text-white font-bold hover:bg-orange-700 transition-colors shadow-md shadow-orange-600/20"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

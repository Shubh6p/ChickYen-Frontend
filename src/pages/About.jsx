import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="py-12 md:py-20 px-6 max-w-7xl mx-auto flex-grow w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        <div className="relative order-1 lg:order-1">
          <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
              alt="Our Chef"
              className="rounded-[2rem] shadow-2xl relative z-10 w-full h-[350px] md:h-[500px] object-cover border-4 border-white" />

          <div
              className="absolute -bottom-6 -right-2 md:-bottom-10 md:-right-6 lg:-right-10 z-20 bg-orange-600 text-white p-5 md:p-8 rounded-3xl shadow-xl max-w-[200px] md:max-w-xs transition-transform hover:scale-105">
              <p className="text-xl md:text-3xl font-black mb-1">Made with Love</p>
              <p className="text-orange-100 text-xs md:text-sm font-medium">Crafted with care and authentic Manipuri passion.</p>
          </div>

          <div
              className="absolute top-10 -left-10 w-48 md:w-64 h-48 md:h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse">
          </div>
        </div>

        <div className="space-y-6 md:space-y-8 order-2 lg:order-2">
          <div className="text-center lg:text-left">
              <span className="text-orange-600 font-bold tracking-widest uppercase text-xs md:text-sm">Our Story</span>
              <h2 className="text-3xl md:text-5xl font-black mt-4 leading-tight">We Don’t Just Make Pickles, <br className="hidden md:block" /> We <span className="text-orange-600">Create.</span></h2>
          </div>

          <p className="text-gray-500 text-base md:text-lg leading-relaxed text-center lg:text-left">
              Born in Manipur, ChickYen Achar started with a single mission: to bring the bold, fermented, and
              spicy flavors of our heritage to food lovers everywhere. We use traditional smoking techniques and
              organic U-Morok to ensure every jar tells a story.
          </p>

          <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/50 border border-orange-50 shadow-sm">
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-600 text-xl">🌿</div>
                  <div>
                      <h4 className="font-bold text-gray-800 text-lg">100% Organic</h4>
                      <p className="text-gray-500 text-sm">Locally sourced chicken and hand-picked spices.</p>
                  </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/50 border border-orange-50 shadow-sm">
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-600 text-xl">👨‍🍳</div>
                  <div>
                      <h4 className="font-bold text-gray-800 text-lg">Authentic Recipe</h4>
                      <p className="text-gray-500 text-sm">Perfected over generations in Manipuri kitchens.</p>
                  </div>
              </div>
          </div>

          <div className="pt-6 flex justify-center lg:justify-start">
              <Link to="/contact"
                  className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition shadow-lg flex items-center justify-center group">
                  Let's Chat
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

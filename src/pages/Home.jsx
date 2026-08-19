import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="flex-grow flex items-center justify-center px-6 py-12 md:py-20">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <div className="space-y-6 text-center md:text-left order-2 md:order-1">
                <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full">
                    <span className="text-orange-600 text-xs sm:text-sm font-black uppercase tracking-wider">🔥 15% OFF YOUR
                        FIRST ORDER</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                    Crafting <span className="text-orange-600">Flavors</span>, <br className="hidden sm:block" /> Delivering Joy.
                </h1>

                <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto md:mx-0">
                    Experience the perfect blend of taste and convenience with Chicken Pickle | ChickYen Achar. Freshly
                    made, delivered fast.
                </p>

                <div
                    className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                    <Link to="/menu"
                        className="w-full sm:w-auto bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-orange-200 text-center">
                        Order Now
                    </Link>
                    <button
                        className="w-full sm:w-auto bg-white border-2 border-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:border-orange-600 transition-all flex items-center justify-center">
                        <span className="mr-2">▶</span> Watch Video
                    </button>
                </div>

                <div className="flex justify-center md:justify-start space-x-8 pt-8 border-t border-orange-100">
                    <div>
                        <p className="text-xl sm:text-2xl font-black">12k+</p>
                        <p className="text-gray-400 text-xs sm:text-sm">Happy Customers</p>
                    </div>
                    <div>
                        <p className="text-xl sm:text-2xl font-black">4.9/5</p>
                        <p className="text-gray-400 text-xs sm:text-sm">Top Rated</p>
                    </div>
                </div>
            </div>

            <div className="relative order-1 md:order-2">
                <div
                    className="absolute inset-0 bg-orange-200 rounded-full filter blur-3xl opacity-30 transform scale-75 sm:scale-100">
                </div>
                <div className="relative z-10 floating max-w-[300px] sm:max-w-md mx-auto">
                    <img src="/assets/brand_image.png" alt="Chicken Pickle"
                        className="rounded-[2rem] sm:rounded-[3rem] shadow-2xl border-4 sm:border-8 border-white w-full" />
                </div>
            </div>
        </div>
    </main>
  );
}

import { Bell, Search, User } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between z-20 sticky top-0">
            <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl w-96 transition-all focus-within:ring-2 focus-within:ring-primary-100 focus-within:bg-white border border-transparent focus-within:border-primary-200 group">
                <Search size={18} className="text-gray-400 group-focus-within:text-primary-500" />
                <input
                    type="text"
                    placeholder="Search reports, students..."
                    className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors group">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-accent-violet rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125"></span>
                </button>

                <div className="h-8 w-px bg-gray-100 mx-2"></div>

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 leading-none group-hover:text-primary-600 transition-colors">Admin Owner</p>
                        <p className="text-xs text-gray-500 mt-1">Academy Owner</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-primary-100 transition-transform group-hover:scale-105">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

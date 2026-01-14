import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BarChart3,
    LogOut,
    ShieldCheck,
    UserPlus
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../context/AuthContext';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Tutors', path: '/tutors' },
        { icon: UserPlus, label: 'Parents', path: '/parents' },
        { icon: GraduationCap, label: 'Students', path: '/students' },
        { icon: BarChart3, label: 'Reports', path: '/reports' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-30">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
                    <ShieldCheck size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900">MentorLog</span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                            isActive
                                ? "bg-primary-50 text-primary-600 shadow-sm"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <item.icon className={cn(
                            "transition-colors duration-200",
                            "group-hover:text-primary-600"
                        )} size={20} />
                        <span className="font-medium text-sm">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
                    <LogOut size={20} />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

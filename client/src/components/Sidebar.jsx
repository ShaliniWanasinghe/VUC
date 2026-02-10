import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Heart, Users, Calendar, Trophy, Briefcase, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth(); // Need to get user role
    const location = useLocation();

    const menuItems = [
        { name: 'General', icon: Home, path: '/' },
        // Show Pending Notices for Admin and Moderator
        ...(user?.role === 'admin' || user?.role === 'moderator' ? [
            { name: 'Pending Notices', icon: ClipboardList, path: '/pending-notices' }
        ] : []),
        { name: 'Academic', icon: BookOpen, path: '/category/academic' },
        { name: 'Welfare', icon: Heart, path: '/category/welfare' },
        { name: 'Student Services', icon: Briefcase, path: '/student-services' },
        { name: 'Societies', icon: Users, path: '/category/societies' },
        { name: 'Sports', icon: Trophy, path: '/category/sports' }
    ];

    return (
        <aside className="w-64 bg-[#3f0e20] text-white flex flex-col min-h-screen">
            {/* Logo Area */}
            <div className="p-6 flex flex-col items-center border-b border-[#5e1931]">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg p-1">
                    <img
                        src="/logo.png"
                        alt="VUC Logo"
                        className="w-full h-full object-contain rounded-full"
                        onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=VUC'; }}
                    />
                </div>
                <h1 className="font-bold text-lg tracking-wide text-center text-[#fbbf24]">VUC Portal</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                        return (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-4 ${isActive
                                        ? 'bg-[#5e1931] border-[#fbbf24] text-[#fbbf24]'
                                        : 'border-transparent text-gray-300 hover:bg-[#5e1931] hover:text-white'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#fbbf24]' : ''}`} />
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;

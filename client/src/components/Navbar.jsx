import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Bell } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-wide hover:opacity-90 transition-opacity">
                    <Bell className="w-6 h-6" />
                    <span>VUC</span>
                </Link>
                <div>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm hidden sm:inline">
                                Hi, <strong>{user.name}</strong>
                            </span>
                            <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full capitalize font-medium">
                                {user.role}
                            </span>
                            <button
                                onClick={logout}
                                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="hover:underline font-medium">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

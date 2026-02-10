import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Bell, Search, User } from 'lucide-react';

const Header = ({ title = "Student Services" }) => {
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const notifRef = useRef(null);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
        } catch (err) {
            console.error('Error fetching notifications', err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Optional: Set up interval for polling
            const interval = setInterval(fetchNotifications, 60000); // every minute
            return () => clearInterval(interval);
        }
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (err) {
            console.error('Error marking as read', err);
        }
    };

    const markAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            fetchNotifications();
        } catch (err) {
            console.error('Error marking all as read', err);
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <Search className="w-5 h-5 text-gray-400" />
                </div>

                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                    >
                        <Bell className="w-5 h-5 text-gray-500" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {isNotifOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="text-[10px] text-indigo-600 hover:underline font-semibold"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">
                                        <p className="text-xs">No notifications yet</p>
                                    </div>
                                ) : (
                                    notifications.map(notif => (
                                        <div
                                            key={notif._id}
                                            onClick={() => markAsRead(notif._id)}
                                            className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!notif.isRead ? 'bg-indigo-500' : 'bg-transparent'}`}></div>
                                                <div>
                                                    <p className={`text-xs ${!notif.isRead ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                                                        {notif.message}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-1">
                                                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-700">{user?.name || 'Guest User'}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role || 'Guest'}</p>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3f0e20]"
                        >
                            {user?.name ? (
                                <span className="font-bold text-[#3f0e20]">{user.name.charAt(0).toUpperCase()}</span>
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    <p className="text-xs text-gray-400 mt-1 font-mono">{user?.userId}</p>
                                </div>
                                <a
                                    href="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Your Profile
                                </a>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

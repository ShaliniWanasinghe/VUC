import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Trash2, CheckCircle, XCircle, Edit3, Loader2, AlertTriangle, Calendar, User } from 'lucide-react';
import EditNotice from './EditNotice';

const categoryColors = {
    'Academic': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-400', badge: 'bg-blue-100' },
    'Sports': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-400', badge: 'bg-green-100' },
    'Clubs & Societies': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-400', badge: 'bg-purple-100' },
    'Welfare & Student Services': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-400', badge: 'bg-amber-100' },
    'Marketplace': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-400', badge: 'bg-emerald-100' },
    'Lost & Found': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-400', badge: 'bg-gray-100' },
    'Donations': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-400', badge: 'bg-rose-100' },
    'Hostel & Accommodation': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-400', badge: 'bg-indigo-100' }
};

const statusBadge = {
    published: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700'
};

const NoticeList = ({ categoryFilter, statusFilter, refresh }) => {
    const { user } = useAuth();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingNotice, setEditingNotice] = useState(null);

    useEffect(() => {
        fetchNotices();
    }, [user, categoryFilter, statusFilter, refresh]);

    const fetchNotices = async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            if (categoryFilter) queryParams.append('category', categoryFilter);
            if (statusFilter) queryParams.append('status', statusFilter);

            const res = await api.get(`/notices?${queryParams.toString()}`);
            setNotices(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load notices');
            console.error('Error fetching notices', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this notice?')) return;
        try {
            await api.delete(`/notices/${id}`);
            toast.success('Notice deleted');
            fetchNotices();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete notice');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.patch(`/notices/${id}/status`, { status });
            toast.success(`Notice ${status}`);
            fetchNotices();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-3" />
                <p className="text-sm">Loading notices...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-red-400">
                <AlertTriangle className="w-8 h-8 mb-3" />
                <p className="text-sm font-medium">{error}</p>
                <button
                    onClick={fetchNotices}
                    className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {notices.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-lg font-medium">No notices found</p>
                        <p className="text-sm">Check back later for updates</p>
                    </div>
                ) : null}
                {notices.map(notice => {
                    const colors = categoryColors[notice.category] || categoryColors['Academic'];
                    const authorId = notice.author?.userId || notice.author;
                    const authorName = notice.author?.name || 'Unknown';
                    const isAuthor = notice.author?._id === user.id;

                    return (
                        <div
                            key={notice._id}
                            className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${colors.border} hover:shadow-md transition-shadow duration-200`}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.badge} ${colors.text}`}>
                                            {notice.category}
                                        </span>
                                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusBadge[notice.status]}`}>
                                            {notice.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">{notice.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{notice.content}</p>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(notice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User className="w-3.5 h-3.5" />
                                            {authorName}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-1.5 flex-shrink-0">
                                    {/* Admin: Approve/Reject pending notices */}
                                    {user.role === 'admin' && notice.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(notice._id, 'published')}
                                                className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors"
                                                title="Approve"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(notice._id, 'rejected')}
                                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                title="Reject"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                    {/* Edit: Admin or Author */}
                                    {(user.role === 'admin' || isAuthor) && (
                                        <button
                                            onClick={() => setEditingNotice(notice)}
                                            className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit3 className="w-4.5 h-4.5" />
                                        </button>
                                    )}
                                    {/* Delete: Admin or Author */}
                                    {(user.role === 'admin' || isAuthor) && (
                                        <button
                                            onClick={() => handleDelete(notice._id)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4.5 h-4.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Edit Modal */}
            {editingNotice && (
                <EditNotice
                    notice={editingNotice}
                    onClose={() => setEditingNotice(null)}
                    onUpdated={fetchNotices}
                />
            )}
        </>
    );
};

// Bell icon for empty state (not imported at top to avoid conflict)
const Bell = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);

export default NoticeList;

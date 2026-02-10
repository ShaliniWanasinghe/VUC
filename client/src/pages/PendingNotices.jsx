import Layout from '../components/Layout';
import NoticeList from '../components/NoticeList';
import { useAuth } from '../context/AuthContext';

const PendingNotices = () => {
    const { user } = useAuth();

    // Safety check just in case
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
        return (
            <Layout title="Pending Notices">
                <div className="text-center py-10 text-red-500">
                    Access Denied. You do not have permission to view this page.
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Pending Notices">
            <div className="max-w-4xl mx-auto">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                These notices are waiting for approval. Review them carefully before publishing.
                            </p>
                        </div>
                    </div>
                </div>

                <NoticeList statusFilter="pending" />
            </div>
        </Layout>
    );
};

export default PendingNotices;

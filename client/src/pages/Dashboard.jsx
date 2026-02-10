import { useState } from 'react';
import Layout from '../components/Layout';
import NoticeList from '../components/NoticeList';
import CreateNotice from '../components/CreateNotice';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Trophy, Users, Heart, Share2, ShoppingCart } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <Layout title="General Notices">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        All Updates
                    </div>
                </div>
                {/* Create Notice Button (Only for Admin/Mod) */}
                <CreateNotice onNoticeCreated={handleRefresh} />
            </div>

            {/* Notices List */}
            <NoticeList key={refreshTrigger} refresh={refreshTrigger} />
        </Layout>
    );
};

export default Dashboard;

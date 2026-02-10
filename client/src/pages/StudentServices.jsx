import { useState } from 'react';
import Layout from '../components/Layout';
import NoticeList from '../components/NoticeList';
import CreateNotice from '../components/CreateNotice';
import { ShoppingCart, Search, Gift, Home } from 'lucide-react';

const StudentServices = () => {
    const [activeTab, setActiveTab] = useState('Marketplace');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const tabs = [
        { id: 'Marketplace', label: 'Marketplace', icon: ShoppingCart },
        { id: 'Lost & Found', label: 'Lost & Found', icon: Search },
        { id: 'Donations', label: 'Donations', icon: Gift },
        { id: 'Hostel & Accommodation', label: 'Hostel', icon: Home },
    ];

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <Layout title="Student Services">
            {/* Tab Navigation */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 pb-4 px-1 font-medium text-sm border-b-2 transition-colors whitespace-nowrap
                                    ${isActive
                                        ? 'border-[#3f0e20] text-[#3f0e20]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                `}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-[#fbbf24]' : ''}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Description Area */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-100 mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{activeTab}</h3>
                <p className="text-sm text-gray-500">
                    {activeTab === 'Marketplace' && 'Buy and sell academic materials, electronics, and other essentials within the university community.'}
                    {activeTab === 'Lost & Found' && 'Report lost items or help return found belongings to their owners.'}
                    {activeTab === 'Donations' && 'Coordinate blood drives, charity events, and community support initiatives.'}
                    {activeTab === 'Hostel & Accommodation' && 'Find finding accommodation, roommate requests, and hostel updates.'}
                </p>

                {/* Create Button Positioned Here or use the shared one */}
                <div className="mt-4">
                    <CreateNotice
                        onNoticeCreated={handleRefresh}
                        defaultCategory={activeTab} // Optional: Pass default category to create form
                    />
                </div>
            </div>

            {/* Notice List Filtered by Active Tab */}
            <NoticeList
                key={`${activeTab}-${refreshTrigger}`}
                categoryFilter={activeTab}
                refresh={refreshTrigger}
            />
        </Layout>
    );
};

export default StudentServices;

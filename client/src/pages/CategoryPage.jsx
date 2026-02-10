import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import NoticeList from '../components/NoticeList';
import { BookOpen, Trophy, Users, Heart, Briefcase } from 'lucide-react';

const CategoryPage = () => {
    const { category } = useParams();

    // Map URL param to display name and icon
    const categoryConfig = {
        'academic': { label: 'Academic', icon: BookOpen, description: 'Course updates, exam schedules, and academic announcements.' },
        'sports': { label: 'Sports', icon: Trophy, description: 'Match schedules, team selections, and sports events.' },
        'societies': { label: 'Clubs & Societies', icon: Users, description: 'Club meetings, events, and membership information.' },
        'welfare': { label: 'Welfare & Student Services', icon: Heart, description: 'Student support, health services, and welfare news.' },
        'services': { label: 'Student Services', icon: Briefcase, description: 'General student services and support.' }
    };

    const config = categoryConfig[category.toLowerCase()] || { label: category, icon: BookOpen, description: 'Category notices' };
    const Icon = config.icon;

    // NoticeList expects exact category string match as stored in DB
    // We map URL param to likely DB value. 
    // Ideally DB values should be normalized, but based on seed data: 'Academic', 'Sports', 'Clubs & Societies', 'Welfare & Student Services'
    const dbCategoryMap = {
        'academic': 'Academic',
        'sports': 'Sports',
        'societies': 'Clubs & Societies',
        'welfare': 'Welfare & Student Services',
        'services': 'Welfare & Student Services' // Assuming 'Services' maps to Welfare or generic
    };

    const filterCategory = dbCategoryMap[category.toLowerCase()] || category;

    return (
        <Layout title={config.label}>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Icon className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{config.label}</h2>
                    <p className="text-gray-500 mt-1">{config.description}</p>
                </div>
            </div>

            <NoticeList categoryFilter={filterCategory} />
        </Layout>
    );
};

export default CategoryPage;

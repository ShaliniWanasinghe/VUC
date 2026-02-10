import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { User, LogOut, Shield, Hash } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <Layout title="Your Profile">
                <div className="text-center py-10">Loading profile...</div>
            </Layout>
        );
    }

    return (
        <Layout title="Your Profile">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-[#3f0e20] h-32 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                    <User className="w-12 h-12" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-8 px-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h2>
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full capitalize">
                            {user.role}
                        </span>

                        <div className="mt-8 space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="bg-white p-2 rounded-md shadow-sm text-gray-500">
                                    <Hash className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">University ID</p>
                                    <p className="font-semibold text-gray-700">{user.userId}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="bg-white p-2 rounded-md shadow-sm text-gray-500">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Account Role</p>
                                    <p className="font-semibold text-gray-700 capitalize">{user.role}</p>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <button
                                onClick={logout}
                                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-medium py-3 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;

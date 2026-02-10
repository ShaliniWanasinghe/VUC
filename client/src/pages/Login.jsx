import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleDemoLogin = async (role) => {
        setLoading(true);
        let credentials = {};
        if (role === 'admin') credentials = { id: '2020/ADM/001', pass: 'admin' };
        else if (role === 'moderator') credentials = { id: '2020/MOD/001', pass: 'mod' };
        else credentials = { id: '2021/ICT/075', pass: 'student' };

        setUserId(credentials.id);
        setPassword(credentials.pass);

        const success = await login(credentials.id, credentials.pass);
        if (success) {
            navigate('/');
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(userId, password);
        if (success) {
            navigate('/');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-[400px] bg-white rounded-lg shadow-sm p-8 text-center">
                {/* Logo Area */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#fbbf24] p-2">
                        <img
                            src="/logo.png"
                            alt="University Logo"
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=VUC'; }}
                        />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-[#3f0e20] mb-1">Welcome Back</h1>
                <p className="text-gray-500 text-xs mb-8">Sign in with your university email</p>

                <form onSubmit={handleSubmit} className="text-left space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">Username / Email</label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#3f0e20] focus:bg-white transition-colors"
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-900 focus:bg-white transition-colors"
                                placeholder="Enter password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#3f0e20] text-[#fbbf24] font-bold py-3 rounded-lg hover:bg-[#5e1931] transition-colors mt-2 text-sm shadow-md"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Demo Logins */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Quick Demo Access</p>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => handleDemoLogin('admin')}
                            disabled={loading}
                            className="text-[10px] py-2 px-1 bg-amber-50 text-amber-700 border border-amber-200 rounded hover:bg-amber-100 transition-colors font-bold uppercase"
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => handleDemoLogin('moderator')}
                            disabled={loading}
                            className="text-[10px] py-2 px-1 bg-rose-50 text-rose-700 border border-rose-200 rounded hover:bg-rose-100 transition-colors font-bold uppercase"
                        >
                            Mod
                        </button>
                        <button
                            onClick={() => handleDemoLogin('student')}
                            disabled={loading}
                            className="text-[10px] py-2 px-1 bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors font-bold uppercase"
                        >
                            Student
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-[#3f0e20] hover:underline font-semibold">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

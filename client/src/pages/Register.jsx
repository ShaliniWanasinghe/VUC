import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        userId: '',
        name: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate University ID format
        const idRegex = /^\d{4}\/[a-zA-Z]{1,4}\/[a-zA-Z0-9]{1,3}$/;
        if (!idRegex.test(formData.userId)) {
            alert('University ID must follow the format Year/CourseCode/RegNo (e.g., 2021/ICT/075)');
            return;
        }

        setLoading(true);
        const success = await register(formData.userId, formData.name, formData.email, formData.password, formData.role);
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

                <h1 className="text-2xl font-bold text-[#3f0e20] mb-1">Create Account</h1>
                <p className="text-gray-500 text-xs mb-8">Join the Virtual University Communicator</p>

                <form onSubmit={handleSubmit} className="text-left space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">University ID</label>
                        <input
                            type="text"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#3f0e20] focus:bg-white transition-colors"
                            placeholder="e.g., 2021/ICT/075"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#3f0e20] focus:bg-white transition-colors"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#3f0e20] focus:bg-white transition-colors"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#3f0e20] focus:bg-white transition-colors"
                                placeholder="Create a password"
                                required
                                minLength={3}
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
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#3f0e20] hover:underline font-semibold">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

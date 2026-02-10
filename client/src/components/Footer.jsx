import { Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#3f0e20] text-white pt-12 pb-6 text-sm border-t-4 border-[#fbbf24]">
            <div className="container mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Column 1: University Info */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">University of Vavuniya</h3>
                        <p className="text-gray-300 mb-1">Pampaimadu, Vavuniya, Sri Lanka</p>
                        <p className="text-gray-300 mb-1">info@vau.ac.lk</p>
                        <p className="text-gray-300">+94 24 222 2265</p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li><a href="#" className="hover:text-white transition">Home</a></li>
                            <li><a href="#" className="hover:text-white transition">Faculties</a></li>
                            <li><a href="#" className="hover:text-white transition">Library</a></li>
                            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Student Services */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Student Services</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li><a href="#" className="hover:text-white transition">Welfare Division</a></li>
                            <li><a href="#" className="hover:text-white transition">Health Center</a></li>
                            <li><a href="#" className="hover:text-white transition">IT Support</a></li>
                            <li><a href="#" className="hover:text-white transition">Career Guidance</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Follow Us */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-[#fbbf24] transition"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-[#fbbf24] transition"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-[#fbbf24] transition"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-red-800 pt-6 text-center text-xs text-gray-400">
                    <p>&copy; 2023 University of Vavuniya. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

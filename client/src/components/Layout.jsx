import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, title }) => {
    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen">
                <Header title={title} />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;

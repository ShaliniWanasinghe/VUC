import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CategoryPage from './pages/CategoryPage';

import StudentServices from './pages/StudentServices';
import PendingNotices from './pages/PendingNotices';

function App() {
    return (
        <AuthProvider>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/student-services" element={<StudentServices />} />
                    <Route path="/pending-notices" element={<PendingNotices />} />
                    <Route path="/category/:category" element={<CategoryPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;

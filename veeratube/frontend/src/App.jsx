import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Upload from './pages/Upload';
import Watch from './pages/Watch';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-brand-dark">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
          <span className="font-display text-2xl tracking-wider text-white group-hover:text-brand-red transition-colors">
            VEERATUBE
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/upload"
                className="flex items-center gap-2 btn-primary text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload
              </Link>
              <div className="flex items-center gap-2">
                <Link
                  to={`/profile/${user.id}`}
                  className="w-9 h-9 bg-brand-red rounded-full flex items-center justify-center text-white font-semibold text-sm hover:bg-red-600 transition-colors"
                >
                  {user.name.charAt(0).toUpperCase()}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-white transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Log in</Link>
              <Link to="/register" className="btn-primary text-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

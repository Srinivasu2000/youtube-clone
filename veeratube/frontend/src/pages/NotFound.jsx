import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="font-display text-8xl text-brand-red mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-2">Page not found</h2>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary inline-block">Go Home</Link>
      </div>
    </div>
  );
}

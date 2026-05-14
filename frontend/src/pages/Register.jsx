import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-red rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
          <h1 className="font-display text-4xl tracking-wider text-white">VEERATUBE</h1>
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>

        <div className="card p-8">
          {success ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-green-900/40 border border-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-white font-semibold text-lg mb-2">Check your email</h2>
              <p className="text-gray-400 text-sm">{success}</p>
              <Link to="/login" className="btn-primary inline-block mt-6 text-sm">Go to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Full name</label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Your name" required className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" required className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                <input
                  type="password" name="password" value={form.password} onChange={handleChange}
                  placeholder="Minimum 6 characters" required className="input-field"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
              <p className="text-center text-gray-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-red hover:underline">Log in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

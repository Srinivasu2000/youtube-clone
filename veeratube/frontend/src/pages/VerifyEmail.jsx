import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }
    api.get(`/auth/verify-email?token=${token}`)
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed');
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card p-10 text-center max-w-md w-full">
        {status === 'loading' && (
          <>
            <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-14 h-14 bg-green-900/40 border border-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-white font-semibold text-xl mb-2">Email Verified!</h2>
            <p className="text-gray-400 text-sm mb-6">{message}</p>
            <Link to="/login" className="btn-primary inline-block">Continue to Login</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-14 h-14 bg-red-900/40 border border-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-white font-semibold text-xl mb-2">Verification Failed</h2>
            <p className="text-gray-400 text-sm mb-6">{message}</p>
            <Link to="/register" className="btn-ghost inline-block">Back to Register</Link>
          </>
        )}
      </div>
    </div>
  );
}

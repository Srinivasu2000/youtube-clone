import { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import api from '../utils/api';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/videos')
      .then((res) => setVideos(res.data))
      .catch(() => setError('Failed to load videos'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-display text-5xl sm:text-7xl text-white tracking-wide">
          TRENDING <span className="text-brand-red">NOW</span>
        </h1>
        <p className="text-gray-500 mt-2">Discover videos from creators around the world</p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {videos.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-brand-card border border-brand-border rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-400">No videos yet</h2>
          <p className="text-gray-600 mt-2">Be the first to upload a video!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </div>
  );
}

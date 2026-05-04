import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import VideoCard from '../components/VideoCard';

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/users/${id}/videos`)
      .then((res) => {
        setProfile(res.data.user);
        setVideos(res.data.videos);
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-400">{error || 'User not found'}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Profile header */}
      <div className="flex items-center gap-6 mb-10">
        <div className="w-20 h-20 bg-brand-red rounded-full flex items-center justify-center text-white font-display text-4xl">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
          <p className="text-gray-600 text-sm mt-1">
            {videos.length} video{videos.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Videos */}
      <div className="border-t border-brand-border pt-8">
        <h2 className="font-display text-2xl text-white tracking-wide mb-6">VIDEOS</h2>
        {videos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No videos uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        )}
      </div>
    </div>
  );
}

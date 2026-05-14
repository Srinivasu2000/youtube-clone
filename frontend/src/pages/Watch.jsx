import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import VideoCard from '../components/VideoCard';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/videos/${id}`),
      api.get('/videos'),
    ])
      .then(([vRes, allRes]) => {
        setVideo(vRes.data);
        setRelated(allRes.data.filter((v) => v.id !== parseInt(id)).slice(0, 8));
      })
      .catch(() => setError('Failed to load video'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !video) return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <p className="text-red-400 text-lg mb-4">{error || 'Video not found'}</p>
        <Link to="/" className="btn-ghost">Go Home</Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main player */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="bg-black rounded-2xl overflow-hidden aspect-video w-full">
            <video
              key={video.video_url}
              src={video.video_url}
              controls
              autoPlay
              className="w-full h-full"
            />
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-xl font-bold text-white">{video.title}</h1>
            <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Link to={`/profile/${video.user_id}`}>
                  <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-semibold hover:bg-red-600 transition-colors">
                    {video.uploader_name?.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <div>
                  <Link to={`/profile/${video.user_id}`} className="font-semibold text-white hover:text-brand-red transition-colors">
                    {video.uploader_name}
                  </Link>
                  <p className="text-gray-500 text-xs">Uploaded {timeAgo(video.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {video.views.toLocaleString()} views
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-brand-border mt-4" />
          </div>
        </div>

        {/* Related Videos */}
        <div className="space-y-4">
          <h2 className="font-semibold text-white text-sm uppercase tracking-widest text-gray-400">Up Next</h2>
          {related.length === 0 ? (
            <p className="text-gray-600 text-sm">No other videos yet</p>
          ) : (
            related.map((v) => <VideoCard key={v.id} video={v} />)
          )}
        </div>
      </div>
    </div>
  );
}

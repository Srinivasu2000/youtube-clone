import { Link } from 'react-router-dom';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
}

function formatViews(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n;
}

export default function VideoCard({ video }) {
  return (
    <div className="group cursor-pointer">
      <Link to={`/watch/${video.id}`}>
        <div className="relative aspect-video bg-[#1a1a1a] rounded-xl overflow-hidden mb-3">
          {video.thumbnail_url ? (
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]">
              <svg className="w-12 h-12 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-14 h-14 bg-brand-red/90 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex gap-3">
        <Link to={`/profile/${video.user_id}`} className="flex-shrink-0">
          <div className="w-9 h-9 bg-brand-red rounded-full flex items-center justify-center text-white font-semibold text-sm mt-0.5 hover:bg-red-600 transition-colors">
            {video.uploader_name?.charAt(0).toUpperCase()}
          </div>
        </Link>
        <div className="min-w-0">
          <Link to={`/watch/${video.id}`}>
            <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 hover:text-brand-red transition-colors">
              {video.title}
            </h3>
          </Link>
          <Link to={`/profile/${video.user_id}`} className="text-gray-500 text-xs hover:text-gray-300 transition-colors mt-1 block">
            {video.uploader_name}
          </Link>
          <p className="text-gray-600 text-xs mt-0.5">
            {formatViews(video.views)} views · {timeAgo(video.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}

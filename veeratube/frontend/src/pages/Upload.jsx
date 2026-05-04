import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef();
  const thumbRef = useRef();
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'video/mp4') {
      setError('Only MP4 videos are allowed');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('Video must be under 50MB');
      return;
    }
    setError('');
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleThumbChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError('Title is required');
    if (!video) return setError('Please select a video file');

    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', video);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    try {
      const res = await api.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setProgress(pct);
        },
      });
      navigate(`/watch/${res.data.video.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl text-white tracking-wide mb-2">UPLOAD VIDEO</h1>
      <p className="text-gray-500 mb-8">Share your content with the world</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Video Title *</label>
          <input
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your video a title..." className="input-field" required
          />
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Video File * (MP4, max 50MB)</label>
          <div
            onClick={() => !uploading && videoRef.current.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              video ? 'border-brand-red bg-red-950/10' : 'border-brand-border hover:border-gray-500'
            }`}
          >
            <input ref={videoRef} type="file" accept="video/mp4" onChange={handleVideoChange} className="hidden" />
            {videoPreview ? (
              <div>
                <video src={videoPreview} className="max-h-40 mx-auto rounded-lg" controls />
                <p className="text-green-400 text-sm mt-3">✓ {video.name}</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-brand-card border border-brand-border rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Click to select video</p>
                <p className="text-gray-600 text-xs mt-1">MP4 format only, up to 50MB</p>
              </>
            )}
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Thumbnail (optional)</label>
          <div
            onClick={() => !uploading && thumbRef.current.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              thumbnail ? 'border-brand-red bg-red-950/10' : 'border-brand-border hover:border-gray-500'
            }`}
          >
            <input ref={thumbRef} type="file" accept="image/*" onChange={handleThumbChange} className="hidden" />
            {thumbPreview ? (
              <div>
                <img src={thumbPreview} alt="Thumbnail preview" className="max-h-32 mx-auto rounded-lg object-cover" />
                <p className="text-green-400 text-sm mt-2">✓ {thumbnail.name}</p>
              </div>
            ) : (
              <>
                <p className="text-gray-400 text-sm">Click to select thumbnail</p>
                <p className="text-gray-600 text-xs mt-1">JPG, PNG, WebP</p>
              </>
            )}
          </div>
        </div>

        {/* Progress */}
        {uploading && (
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-red rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
        >
          {uploading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Uploading {progress}%...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Video
            </>
          )}
        </button>
      </form>
    </div>
  );
}

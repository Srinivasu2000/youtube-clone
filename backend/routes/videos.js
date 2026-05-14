const router = require('express').Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const s3 = require('../config/s3');
const { pool } = require('../config/db');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

const BUCKET = process.env.AWS_BUCKET_NAME;

// Multer-S3 upload configuration
const upload = multer({
  storage: multerS3({
    s3,
    bucket: BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => {
      const folder = file.fieldname === 'video' ? 'videos' : 'thumbnails';
      const ext = file.originalname.split('.').pop();
      cb(null, `${folder}/${uuidv4()}.${ext}`);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video') {
      if (file.mimetype !== 'video/mp4') {
        return cb(new Error('Only MP4 videos are allowed'));
      }
    } else if (file.fieldname === 'thumbnail') {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Thumbnail must be an image'));
      }
    }
    cb(null, true);
  },
});

const uploadFields = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

// POST /videos/upload
router.post('/upload', authMiddleware, (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (!req.files?.video) return res.status(400).json({ error: 'Video file is required' });

    const videoUrl = req.files.video[0].location;
    const thumbnailUrl = req.files.thumbnail ? req.files.thumbnail[0].location : null;

    try {
      const [result] = await pool.query(
        'INSERT INTO videos (title, video_url, thumbnail_url, user_id) VALUES (?, ?, ?, ?)',
        [title, videoUrl, thumbnailUrl, req.user.id]
      );
      const [rows] = await pool.query(
        `SELECT v.*, u.name as uploader_name FROM videos v
         JOIN users u ON v.user_id = u.id WHERE v.id = ?`,
        [result.insertId]
      );
      res.status(201).json({ message: 'Video uploaded successfully', video: rows[0] });
    } catch (dbErr) {
      console.error(dbErr);
      res.status(500).json({ error: 'Failed to save video metadata' });
    }
  });
});

// GET /videos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT v.id, v.title, v.thumbnail_url, v.views, v.created_at,
              u.id as user_id, u.name as uploader_name
       FROM videos v JOIN users u ON v.user_id = u.id
       ORDER BY v.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// GET /videos/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT v.*, u.id as user_id, u.name as uploader_name
       FROM videos v JOIN users u ON v.user_id = u.id WHERE v.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Video not found' });
    await pool.query('UPDATE videos SET views = views + 1 WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

module.exports = router;

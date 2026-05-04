const router = require('express').Router();
const { pool } = require('../config/db');

// GET /users/:id/videos
router.get('/:id/videos', async (req, res) => {
  try {
    const [userRows] = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.params.id]);
    if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });

    const [videos] = await pool.query(
      `SELECT v.id, v.title, v.thumbnail_url, v.views, v.created_at,
              u.id as user_id, u.name as uploader_name
       FROM videos v JOIN users u ON v.user_id = u.id
       WHERE v.user_id = ? ORDER BY v.created_at DESC`,
      [req.params.id]
    );
    res.json({ user: userRows[0], videos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

module.exports = router;

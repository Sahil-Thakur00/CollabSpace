const express = require('express');
const Post = require('../models/Post');
const Board = require('../models/Board');
const authMiddleware = require('../middleware/auth');
const { hasBoardAccess, getBoardOrThrow } = require('../utils/board');

const router = express.Router();

router.use(authMiddleware);

// GET /posts/?boardId=xxx — list all posts for a board
router.get('/', async (req, res) => {
  const { boardId } = req.query;
  if (!boardId) return res.status(400).json({ detail: 'boardId query param required' });

  try {
    const board = await getBoardOrThrow(boardId, res);
    if (!board) return;

    if (!hasBoardAccess(board, req.userId)) {
      return res.status(403).json({ detail: 'Access denied' });
    }

    const posts = await Post.find({ board_id: boardId });
    return res.json({ data: posts });
  } catch (err) {
    console.error('List posts error:', err);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

module.exports = router;
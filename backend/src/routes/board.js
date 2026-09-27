const express = require('express');
const Board = require('../models/Board');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');
const { serializeBoard, hasBoardAccess, getBoardOrThrow } = require('../utils/board');

const router = express.Router();

// All board routes require auth
router.use(authMiddleware);

// POST /boards/ — create a board
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ detail: 'Board name is required' });

  try {
    const board = await Board.create({ name, description: description || '', owner: req.userId });
    await board.populate('members.user');
    return res.status(201).json(serializeBoard(board, req.userId));
  } catch (err) {
    console.error('Create board error:', err);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// GET /boards/ — get all owned + shared boards
router.get('/', async (req, res) => {
  try {
    const owned = await Board.find({ owner: req.userId }).populate('members.user');
    const shared = await Board.find({ 'members.user': req.userId }).populate('members.user');

    return res.json({
      owned: owned.map((b) => serializeBoard(b, req.userId)),
      shared: shared.map((b) => serializeBoard(b, req.userId)),
    });
  } catch (err) {
    console.error('Get boards error:', err);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// POST /boards/import — join a board via share code (must be before /:id)
router.post('/import', async (req, res) => {
  const { share_code } = req.body;
  if (!share_code) return res.status(400).json({ detail: 'share_code is required' });

  try {
    const board = await Board.findOne({ share_code: share_code.toUpperCase() }).populate('members.user');
    if (!board) return res.status(404).json({ detail: 'Invalid share code' });

    const uid = req.userId.toString();

    // Already the owner?
    if (board.owner.toString() === uid) {
      return res.status(400).json({ detail: "You already own this board. You can access it from 'My Boards' section." });
    }

    // Already a member?
    const alreadyMember = board.members.some((m) => m.user._id.toString() === uid);
    if (alreadyMember) {
      return res.status(400).json({ detail: "You are already a member of this board. You can access it from 'Shared With Me' section." });
    }

    // Add as member
    board.members.push({ user: req.userId, role: 'MEMBER' });
    await board.save();
    await board.populate('members.user');

    return res.json(serializeBoard(board, req.userId));
  } catch (err) {
    console.error('Import board error:', err);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// GET /boards/:id — get a single board
router.get('/:id', async (req, res) => {
  const board = await getBoardOrThrow(req.params.id, res);
  if (!board) return;

  if (!hasBoardAccess(board, req.userId)) {
    return res.status(404).json({ detail: 'Board not found' });
  }

  return res.json(serializeBoard(board, req.userId));
});

// DELETE /boards/:id — delete a board (owner only)
router.delete('/:id', async (req, res) => {
  const board = await getBoardOrThrow(req.params.id, res);
  if (!board) return;

  if (board.owner.toString() !== req.userId.toString()) {
    return res.status(403).json({ detail: 'Only the board owner can delete it' });
  }

  await Post.deleteMany({ board_id: board._id });
  await board.deleteOne();
  return res.status(204).send();
});

module.exports = router;
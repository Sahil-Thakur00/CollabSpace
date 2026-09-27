const Board = require('../models/Board');

/**
 * Serialize a board document into the shape the frontend expects.
 */
const serializeBoard = (board, requestingUserId) => {
  const json = board.toJSON();
  json.user_id = board.owner ? board.owner.toString() === requestingUserId.toString() : false;
  delete json.owner;
  json.members = (board.members || []).map((m) => {
    if (m.user && typeof m.user === 'object') {
      return m.user.toJSON ? m.user.toJSON() : m.user;
    }
    return null;
  }).filter(Boolean);
  return json;
};

/**
 * Check if a user has access to a board (owner or member).
 */
const hasBoardAccess = (board, userId) => {
  if (!board || !board.owner) return false;
  const uid = userId.toString();
  if (board.owner.toString() === uid) return true;
  return board.members.some((m) => {
    const memberId = m.user && m.user._id ? m.user._id.toString() : m.user ? m.user.toString() : null;
    return memberId === uid;
  });
};

/**
 * Get a board with members populated, or send a 404 response.
 */
const getBoardOrThrow = async (boardId, res) => {
  let board;
  try {
    board = await Board.findById(boardId).populate('members.user');
  } catch {
    if (res) res.status(400).json({ detail: 'Invalid board ID' });
    return null;
  }
  if (!board) {
    if (res) res.status(404).json({ detail: 'Board not found' });
    return null;
  }
  return board;
};

module.exports = { serializeBoard, hasBoardAccess, getBoardOrThrow };
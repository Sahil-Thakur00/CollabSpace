const Board = require('../../models/Board');
const { hasBoardAccess, getBoardOrThrow } = require('../../utils/board');

/**
 * Get all connected users in a room as user objects.
 */
const getConnectedUsers = async (io, roomId) => {
  const sockets = await io.in(roomId).fetchSockets();
  return sockets
    .filter((s) => s.data.user)
    .map((s) => s.data.user);
};

/**
 * board.connect
 * params: { board_id: string }
 */
const handleBoardConnect = async (io, socket, params) => {
  if (!socket.data.user) {
    socket.emit('board.connect', { success: false, error_message: 'Unauthorized.' });
    return;
  }

  const { board_id } = params || {};
  if (!board_id) {
    socket.emit('board.connect', { success: false, error_message: 'board_id is required' });
    return;
  }

  try {
    const board = await getBoardOrThrow(board_id, null);
    if (!board) {
      socket.emit('board.connect', { success: false, error_message: 'Board not found.' });
      return;
    }

    if (!hasBoardAccess(board, socket.data.user.id)) {
      socket.emit('board.connect', { success: false, error_message: 'Board not found.' });
      return;
    }

    // Get users already in room BEFORE joining
    const existingUsers = await getConnectedUsers(io, board_id);

    // Join the Socket.io room
    socket.join(board_id);

    // Broadcast to ALL in room (including new user) — mirrors the old Python broadcast
    io.to(board_id).emit('board.connect', {
      success: true,
      result: {
        board_id,
        new_user: socket.data.user,
        connected_users: existingUsers,
      },
    });
  } catch (err) {
    console.error('WS board.connect error:', err);
    socket.emit('board.connect', { success: false, error_message: 'Internal server error.' });
  }
};

/**
 * board.disconnect
 * params: { board_id: string }
 */
const handleBoardDisconnect = async (io, socket, params) => {
  if (!socket.data.user) return;

  const { board_id } = params || {};
  if (!board_id) return;

  socket.leave(board_id);

  // Broadcast to remaining users in room
  io.to(board_id).emit('board.disconnect', {
    success: true,
    result: {
      board_id,
      user: socket.data.user,
    },
  });
};

/**
 * Called on socket disconnect — leaves all rooms and notifies them.
 */
const handleSocketDisconnect = async (io, socket) => {
  if (!socket.data.user) return;

  const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
  for (const board_id of rooms) {
    io.to(board_id).emit('board.disconnect', {
      success: true,
      result: {
        board_id,
        user: socket.data.user,
      },
    });
  }
};

module.exports = { handleBoardConnect, handleBoardDisconnect, handleSocketDisconnect };
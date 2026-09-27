const { handleAuthenticate } = require('./handlers/auth');
const { handleBoardConnect, handleBoardDisconnect, handleSocketDisconnect } = require('./handlers/board');
const {
  handlePostCreate, handlePostUpdate, handlePostDelete,
  handlePostFocus, handlePostDrag,
} = require('./handlers/post');
const {
  handleVoiceOffer, handleVoiceAnswer,
  handleVoiceIceCandidate, handleVoiceMute,
} = require('./handlers/voice');

/**
 * Register all Socket.io event handlers for a connection.
 * Called once per connected socket.
 */
const registerSocketHandlers = (io, socket) => {
  console.log('Socket connected:', socket.id);

  // ── Auth ─────────────────────────────────────────────
  socket.on('user.authenticate', (params) => handleAuthenticate(socket, params));

  // ── Board ─────────────────────────────────────────────
  socket.on('board.connect',    (params) => handleBoardConnect(io, socket, params));
  socket.on('board.disconnect', (params) => handleBoardDisconnect(io, socket, params));

  // ── Posts ─────────────────────────────────────────────
  socket.on('post.create', (params) => handlePostCreate(io, socket, params));
  socket.on('post.update', (params) => handlePostUpdate(io, socket, params));
  socket.on('post.delete', (params) => handlePostDelete(io, socket, params));
  socket.on('post.focus',  (params) => handlePostFocus(io, socket, params));
  socket.on('post.drag',   (params) => handlePostDrag(io, socket, params));

  // ── Voice (WebRTC signalling) ─────────────────────────
  socket.on('voice.offer',          (params) => handleVoiceOffer(io, socket, params));
  socket.on('voice.answer',         (params) => handleVoiceAnswer(io, socket, params));
  socket.on('voice.ice_candidate',  (params) => handleVoiceIceCandidate(io, socket, params));
  socket.on('voice.mute',           (params) => handleVoiceMute(io, socket, params));

  // ── Disconnect cleanup ────────────────────────────────
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
    handleSocketDisconnect(io, socket);
  });
};

module.exports = { registerSocketHandlers };
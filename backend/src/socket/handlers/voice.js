/**
 * Find a socket in a room by user ID (for targeted WebRTC signalling)
 */
const findSocketByUserId = async (io, roomId, targetUserId) => {
  const sockets = await io.in(roomId).fetchSockets();
  return sockets.find(
    (s) => s.data.user && s.data.user.id === targetUserId
  ) || null;
};

/**
 * voice.offer — relay SDP offer to a specific user
 * params: { board_id, target_user_id, offer }
 */
const handleVoiceOffer = async (io, socket, params) => {
  if (!socket.data.user) return;
  const { board_id, target_user_id, offer } = params || {};

  const target = await findSocketByUserId(io, board_id, target_user_id);
  if (!target) return;

  target.emit('voice.offer', {
    success: true,
    result: { from_user_id: socket.data.user.id, offer },
  });
};

/**
 * voice.answer — relay SDP answer to a specific user
 * params: { board_id, target_user_id, answer }
 */
const handleVoiceAnswer = async (io, socket, params) => {
  if (!socket.data.user) return;
  const { board_id, target_user_id, answer } = params || {};

  const target = await findSocketByUserId(io, board_id, target_user_id);
  if (!target) return;

  target.emit('voice.answer', {
    success: true,
    result: { from_user_id: socket.data.user.id, answer },
  });
};

/**
 * voice.ice_candidate — relay ICE candidate to a specific user
 * params: { board_id, target_user_id, candidate }
 */
const handleVoiceIceCandidate = async (io, socket, params) => {
  if (!socket.data.user) return;
  const { board_id, target_user_id, candidate } = params || {};

  const target = await findSocketByUserId(io, board_id, target_user_id);
  if (!target) return;

  target.emit('voice.ice_candidate', {
    success: true,
    result: { from_user_id: socket.data.user.id, candidate },
  });
};

/**
 * voice.mute — broadcast mute status to everyone in the board
 * params: { board_id, is_muted }
 */
const handleVoiceMute = (io, socket, params) => {
  if (!socket.data.user) return;
  const { board_id, is_muted } = params || {};

  io.to(board_id).emit('voice.mute', {
    success: true,
    result: { user_id: socket.data.user.id, is_muted },
  });
};

module.exports = {
  handleVoiceOffer,
  handleVoiceAnswer,
  handleVoiceIceCandidate,
  handleVoiceMute,
};
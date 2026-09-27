const Post = require('../../models/Post');

const requireAuth = (socket) => {
  if (!socket.data.user) {
    return false;
  }
  return true;
};

/**
 * post.create
 * params: { board_id, content, pos_x, pos_y, color, height, z_index }
 */
const handlePostCreate = async (io, socket, params) => {
  if (!requireAuth(socket)) return;
  const { board_id, content, pos_x, pos_y, color, height, z_index } = params || {};

  try {
    const post = await Post.create({
      board_id,
      user_id: socket.data.user.id,
      content: content || '',
      pos_x: pos_x || 0,
      pos_y: pos_y || 0,
      color: color || '#FEF08A',
      height: height || 150,
      z_index: z_index || 1,
    });

    io.to(board_id).emit('post.create', {
      success: true,
      result: { post: post.toJSON(), user: socket.data.user },
    });
  } catch (err) {
    console.error('WS post.create error:', err);
    socket.emit('post.create', { success: false, error_message: 'Internal server error.' });
  }
};

/**
 * post.update
 * params: { board_id, id, content?, pos_x?, pos_y?, color?, height?, z_index? }
 */
const handlePostUpdate = async (io, socket, params) => {
  if (!requireAuth(socket)) return;
  const { board_id, id, content, pos_x, pos_y, color, height, z_index } = params || {};

  try {
    const update = {};
    if (content !== undefined) update.content = content;
    if (pos_x !== undefined) update.pos_x = pos_x;
    if (pos_y !== undefined) update.pos_y = pos_y;
    if (color !== undefined) update.color = color;
    if (height !== undefined) update.height = height;
    if (z_index !== undefined) update.z_index = z_index;

    const post = await Post.findByIdAndUpdate(id, update, { new: true });
    if (!post) return;

    io.to(board_id).emit('post.update', {
      success: true,
      result: { post: post.toJSON(), user: socket.data.user },
    });
  } catch (err) {
    console.error('WS post.update error:', err);
  }
};

/**
 * post.delete
 * params: { board_id, post_id }
 */
const handlePostDelete = async (io, socket, params) => {
  if (!requireAuth(socket)) return;
  const { board_id, post_id } = params || {};

  try {
    await Post.findByIdAndDelete(post_id);

    io.to(board_id).emit('post.delete', {
      success: true,
      result: { post_id, board_id, user: socket.data.user },
    });
  } catch (err) {
    console.error('WS post.delete error:', err);
  }
};

/**
 * post.focus — broadcast to others only, no DB write
 * params: { board_id, post_id }
 */
const handlePostFocus = (io, socket, params) => {
  if (!requireAuth(socket)) return;
  const { board_id, post_id } = params || {};

  socket.to(board_id).emit('post.focus', {
    success: true,
    result: { post_id, user: socket.data.user },
  });
};

/**
 * post.drag — broadcast to others only, no DB write (50ms intervals)
 * params: { board_id, post_id, pos_x, pos_y }
 */
const handlePostDrag = (io, socket, params) => {
  if (!requireAuth(socket)) return;
  const { board_id, post_id, pos_x, pos_y } = params || {};

  socket.to(board_id).emit('post.drag', {
    success: true,
    result: { post_id, pos_x, pos_y, user: socket.data.user },
  });
};

module.exports = {
  handlePostCreate,
  handlePostUpdate,
  handlePostDelete,
  handlePostFocus,
  handlePostDrag,
};
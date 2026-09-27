const { verifyToken } = require('../../utils/jwt');
const User = require('../../models/User');

/**
 * user.authenticate
 * params: { jwt: string }
 * Verifies JWT, loads user, stores on socket.data.user
 */
const handleAuthenticate = async (socket, params) => {
  const { jwt } = params || {};
  if (!jwt) {
    socket.emit('user.authenticate', { success: false, error_message: 'JWT is required' });
    return;
  }

  const userId = verifyToken(jwt);
  if (!userId) {
    socket.emit('user.authenticate', { success: false, error_message: 'Invalid JWT token supplied.' });
    return;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      socket.emit('user.authenticate', { success: false, error_message: 'Invalid JWT token supplied.' });
      return;
    }

    socket.data.user = user.toJSON();
    socket.emit('user.authenticate', {
      success: true,
      result: { user: socket.data.user },
    });
  } catch (err) {
    console.error('WS authenticate error:', err);
    socket.emit('user.authenticate', { success: false, error_message: 'Internal server error.' });
  }
};

module.exports = { handleAuthenticate };
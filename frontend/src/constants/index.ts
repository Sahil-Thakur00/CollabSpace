export * from './settings';
export * from './websocket';

// REST API base URL
const isServer = typeof window === 'undefined';
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : isServer
  ? 'http://backend:8080'
  : 'http://localhost:8080';
export const COOKIE_NAME_JWT_TOKEN = 'jwt_token';
export const POST_WIDTH = 275;
export const POST_HEIGHT = 130;
export const BOARD_SPACE_ADD = 150;
export const POST_COLORS: { [key: string]: string } = {
  YELLOW: '#FEF08A',
  GREEN: '#BBF7D0',
  BLUE: '#BAE6FD',
  PURPLE: '#DDD6FE',
  PINK: '#FBCFE8',
  ORANGE: '#FED7AA',
};
// Socket.io server URL (http:// — socket.io upgrades to WS internally)
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL
  ? process.env.NEXT_PUBLIC_WS_URL
  : 'http://localhost:8080';

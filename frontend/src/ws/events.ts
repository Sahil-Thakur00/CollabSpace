import {
  EVENT_BOARD_CONNECT,
  EVENT_BOARD_DISCONNECT,
  EVENT_POST_CREATE,
  EVENT_POST_DELETE,
  EVENT_POST_DRAG,
  EVENT_POST_FOCUS,
  EVENT_POST_UPDATE,
  EVENT_USER_AUTHENTICATE,
} from '@/constants';
import { CreatePostParams, DeletePostParams, DisconnectBoardParams, DragPostParams, FocusPostParams, Send } from './types';
import { Post } from '@/api/post';

export const authenticateUser = (jwtToken: string, send: Send) => {
  send(EVENT_USER_AUTHENTICATE, { jwt: jwtToken });
};

export const connectBoard = (boardId: string, send: Send) => {
  send(EVENT_BOARD_CONNECT, { board_id: boardId });
};

export const createPost = (params: CreatePostParams, send: Send) => {
  send(EVENT_POST_CREATE, params);
};

export const updatePost = (params: Partial<Post>, send: Send) => {
  send(EVENT_POST_UPDATE, params);
};

export const deletePost = (params: DeletePostParams, send: Send) => {
  send(EVENT_POST_DELETE, params);
};

export const focusPost = (params: FocusPostParams, send: Send) => {
  send(EVENT_POST_FOCUS, params);
};

export const dragPost = (params: DragPostParams, send: Send) => {
  send(EVENT_POST_DRAG, params);
};

export const disconnectBoard = (params: DisconnectBoardParams, send: Send) => {
  send(EVENT_BOARD_DISCONNECT, params);
};


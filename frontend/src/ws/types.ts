export type CreatePostParams = {
  board_id: string;
  content: string;
  pos_x: number;
  pos_y: number;
  color: string;
  height: number;
  z_index: number;
};

export type DeletePostParams = {
  post_id: string;
  board_id: string;
};

export type FocusPostParams = {
  post_id: string;
  board_id: string;
};

export type DragPostParams = {
  post_id: string;
  board_id: string;
  pos_x: number;
  pos_y: number;
};

export type DisconnectBoardParams = {
  board_id: string;
};

// Socket.io emit: (eventName, params)
export type Send = (event: string, params: object) => void;

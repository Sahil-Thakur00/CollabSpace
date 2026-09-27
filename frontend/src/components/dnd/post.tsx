'use client';

import { BoardWithMembers, User } from '@/api';
import { POST_COLORS, POST_HEIGHT, POST_WIDTH } from '@/constants';
import { displayColor } from '@/utils';
import { deletePost, focusPost, updatePost } from '@/ws/events';
import { Send } from '@/ws/types';
import { CSSProperties, ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { memo } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import Avatar from '../avatar';
import { PostUI } from './board';

type PostProps = {
  user: User;
  board: BoardWithMembers;
  send: Send;
  setColorSetting: (color: string) => void;
} & PostUI;

export const Post: FC<PostProps> = memo(function Post({
  user,
  id,
  user_id,
  board,
  content,
  color,
  height,
  send,
  setColorSetting,
  typingBy,
}) {
  const [textareaValue, setTextareaValue] = useState(content);
  const [textareaHeight, setTextareaHeight] = useState(height);
  const [currentColor, setCurrentColor] = useState(color || '#FEF08A');
  const [isHovered, setIsHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const allUsers = board.members.concat([user]);
  const authorName = getName(user_id, allUsers) || 'Unknown';

  useEffect(() => {
    setTextareaValue(content);
    setTextareaHeight(height);
  }, [content, height]);

  useEffect(() => {
    if (color) {
      setCurrentColor(color);
    }
  }, [color]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleFocus = () => {
    focusPost({ post_id: id, board_id: board.id }, send);
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setTextareaValue(value);

    if (textareaRef.current) {
      const scrollHeight = textareaRef.current.scrollHeight;
      setTextareaHeight(scrollHeight);
    }
  };

  const handleBlur = () => {
    setTextareaHeight(height);
    updatePost({ id, board_id: board.id, content: textareaValue, height: textareaHeight }, send);
  };

  const handleDelete = () => {
    deletePost({ post_id: id, board_id: board.id }, send);
  };

  const handlePickColor = (newColor: string) => {
    setCurrentColor(newColor);
    updatePost({ id, board_id: board.id, color: newColor }, send);
    setColorSetting(newColor);
  };

  const ColorPicker = () => {
    return (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        {Object.keys(POST_COLORS).map((key) => {
          const colorName = displayColor(key);
          const colorValue = POST_COLORS[key];
          const isSelected = currentColor.toLowerCase() === colorValue.toLowerCase();
          return (
            <button
              key={`color-${key}`}
              type="button"
              title={colorName}
              className={`w-4 h-4 rounded-full border border-black/20 transition-all hover:scale-125 cursor-pointer ${
                isSelected ? 'ring-2 ring-gray-800 ring-offset-1 scale-110 shadow-xs' : 'opacity-85 hover:opacity-100'
              }`}
              style={{ backgroundColor: colorValue }}
              onClick={(e) => {
                e.stopPropagation();
                handlePickColor(colorValue);
              }}
            />
          );
        })}

        {/* Custom Color Wheel Button */}
        <div className="relative flex items-center ml-0.5" title="Custom color wheel">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              colorInputRef.current?.click();
            }}
            className="w-4 h-4 rounded-full border border-black/30 shadow-xs cursor-pointer transition-all hover:scale-125 flex items-center justify-center relative overflow-hidden"
            style={{
              background: 'conic-gradient(red, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff, #ff0080, red)',
            }}
            title="Pick custom color"
          />
          <input
            ref={colorInputRef}
            type="color"
            value={currentColor.startsWith('#') ? currentColor : '#FEF08A'}
            onChange={(e) => {
              e.stopPropagation();
              handlePickColor(e.target.value);
            }}
            className="sr-only"
            tabIndex={-1}
          />
        </div>
      </div>
    );
  };

  const PostActions = () => {
    return (
      <div
        className={`flex justify-between items-center w-full transition-opacity duration-150 ${
          isHovered ? 'opacity-100' : 'opacity-40 hover:opacity-100'
        }`}
      >
        <ColorPicker />
        <button
          type="button"
          className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded hover:bg-black/5 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          title="Delete sticky note"
        >
          <FaRegTrashAlt className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  return (
    <div
      className="rounded-2xl border border-black/10 cursor-move shadow-md hover:shadow-xl transition-all p-3 flex flex-col justify-between group"
      style={{ ...getStyles(currentColor) }}
      role="Post"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header with color actions or typing indicator */}
      <div className="h-6 flex items-center">
        {typingBy ? (
          <div className="text-xs text-gray-600 font-medium"> {`${typingBy.name} is typing...`}</div>
        ) : (
          <PostActions />
        )}
      </div>

      {/* Note Content Textarea */}
      <textarea
        ref={textareaRef}
        className="w-full bg-transparent resize-none outline-none focus:outline-none text-gray-800 placeholder-gray-500/60 text-sm leading-relaxed my-2"
        placeholder="Write a note..."
        value={textareaValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={{ minHeight: Math.max(textareaHeight || 60, 60) }}
      />

      {/* Footer with Author identification & Quick color wheel */}
      <div className="flex justify-between items-center pt-2 border-t border-black/5">
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/5 text-[11px] font-medium text-gray-700 select-none"
          title={`Created by ${authorName}`}
        >
          <Avatar id={user_id} size={14} />
          <span className="truncate max-w-[120px]">{authorName}</span>
        </div>

        {/* Quick color wheel button on bottom-right */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            colorInputRef.current?.click();
          }}
          className="w-3.5 h-3.5 rounded-full border border-black/25 shadow-xs cursor-pointer transition-transform hover:scale-125"
          style={{
            background: 'conic-gradient(red, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff, #ff0080, red)',
          }}
          title="Pick custom color"
        />
      </div>
    </div>
  );
});

function getStyles(color: string): CSSProperties {
  return {
    minHeight: POST_HEIGHT,
    width: POST_WIDTH,
    background: color,
  };
}

function getName(userId: string, boardMembers: User[]): string | undefined {
  let name;
  boardMembers.forEach((user) => {
    if (user.id == userId) {
      name = user.name;
    }
  });
  return name;
}

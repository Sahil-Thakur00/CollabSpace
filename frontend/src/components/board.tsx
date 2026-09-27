'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaShare, FaUsers, FaArrowRight } from 'react-icons/fa';
import { BoardWithMembers } from '@/api/board';
import toast from 'react-hot-toast';

const Board = ({ board }: { board: BoardWithMembers }) => {
  const router = useRouter();

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(board.share_code);
      toast.success(`Share code copied: ${board.share_code}`);
    } catch {
      toast.error('Failed to copy share code');
    }
  };

  const COLORS = ['#f0fdf4', '#eff6ff', '#fdf4ff', '#fff7ed', '#f0f9ff'];
  const ACCENTS = ['#16a34a', '#2563eb', '#9333ea', '#ea580c', '#0891b2'];
  const colorIdx = ((board.name?.charCodeAt(0) || 0) % COLORS.length);

  return (
    <div
      onClick={() => router.push(`/boards/${board.id}`)}
      className="group relative cursor-pointer rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 border"
      style={{
        background: COLORS[colorIdx],
        borderColor: ACCENTS[colorIdx] + '30',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        width: '300px',
      }}
    >
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: ACCENTS[colorIdx] }} />

      <div className="flex justify-between items-start mb-3 mt-1">
        <h3 className="text-base font-bold text-gray-800 leading-tight pr-2 line-clamp-1">{board.name}</h3>
        <button
          onClick={handleShare}
          title="Copy share code"
          className="flex-shrink-0 p-2 rounded-xl transition-colors hover:bg-black/5"
        >
          <FaShare className="text-gray-400 text-xs" />
        </button>
      </div>

      {board.description && (
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{board.description}</p>
      )}

      <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <FaUsers />
          <span>{(board.members?.length || 0) + 1} member{(board.members?.length || 0) > 0 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all"
          style={{ color: ACCENTS[colorIdx] }}>
          Open <FaArrowRight className="text-xs" />
        </div>
      </div>
    </div>
  );
};

export default Board;

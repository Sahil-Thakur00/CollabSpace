'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import { getBoards, createBoard, importBoard, BoardWithMembers } from '@/api/board';
import Board from '@/components/board';
import { COOKIE_NAME_JWT_TOKEN } from '@/constants';
import ImportBoardModal from '@/components/modals/importBoard';
import toast from 'react-hot-toast';
import { FaPlus, FaDownload, FaThLarge, FaUserFriends } from 'react-icons/fa';
import { BASE_URL } from '@/constants';

function BoardSkeleton() {
  return (
    <div className="rounded-2xl p-5 border border-gray-100" style={{ width: '300px', background: '#f9fafb' }}>
      <div className="h-1 rounded-t-full skeleton-shimmer mb-4" />
      <div className="h-4 rounded-lg skeleton-shimmer mb-2 w-3/4" />
      <div className="h-3 rounded-lg skeleton-shimmer mb-1 w-full" />
      <div className="h-3 rounded-lg skeleton-shimmer w-2/3" />
      <div className="flex justify-between mt-6 pt-3 border-t border-gray-100">
        <div className="h-3 w-16 rounded skeleton-shimmer" />
        <div className="h-3 w-12 rounded skeleton-shimmer" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [boards, setBoards] = useState<BoardWithMembers[]>([]);
  const [sharedBoards, setSharedBoards] = useState<BoardWithMembers[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    async function fetchBoards() {
      const cookies = new Cookies();
      const jwtToken = cookies.get(COOKIE_NAME_JWT_TOKEN);
      if (!jwtToken) {
        router.push('/auth/signin');
        return;
      }
      try {
        const data = await getBoards(jwtToken);
        setBoards(data.owned);
        setSharedBoards(data.shared);
      } catch (err: any) {
        if (err?.status === 401 || err?.message?.includes('token') || err?.message?.includes('Not authenticated')) {
          cookies.remove(COOKIE_NAME_JWT_TOKEN, { path: '/' });
          toast.error('Session expired. Please sign in again.');
          router.push('/auth/signin');
        } else {
          toast.error('Failed to load boards');
        }
      } finally {
        setFetching(false);
      }
    }
    fetchBoards();
  }, [router]);

  const handleCreateBoard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cookies = new Cookies();
      const jwtToken = cookies.get(COOKIE_NAME_JWT_TOKEN);
      if (!jwtToken) throw new Error('Please log in.');
      const newBoard = await createBoard({ name, description }, jwtToken);
      setBoards((prev) => [...prev, { ...newBoard, members: [], user_id: true }]);
      setName('');
      setDescription('');
      setShowCreateForm(false);
      toast.success('Board created!');
    } catch (err) {
      toast.error(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    const cookies = new Cookies();
    const jwtToken = cookies.get(COOKIE_NAME_JWT_TOKEN);
    if (!jwtToken) return;
    try {
      await fetch(`${BASE_URL}/boards/${boardId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      setBoards((prev) => prev.filter((b) => b.id !== boardId));
      toast.success('Board deleted');
    } catch {
      toast.error('Failed to delete board');
    }
  };

  const handleImportBoard = async (shareCode: string) => {
    const cookies = new Cookies();
    const jwtToken = cookies.get(COOKIE_NAME_JWT_TOKEN);
    if (!jwtToken) throw new Error('Please log in.');
    const importedBoard = await importBoard(shareCode, jwtToken);
    setSharedBoards((prev) => [...prev, importedBoard]);
    toast.success('Board imported!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Dashboard</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all"
            >
              <FaDownload className="text-xs" /> Import Board
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              <FaPlus className="text-xs" /> New Board
            </button>
          </div>
        </div>

        {/* Create form — expands inline */}
        {showCreateForm && (
          <div className="border-t border-gray-100 bg-indigo-50/50">
            <form onSubmit={handleCreateBoard} className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-3">
              <input
                type="text" placeholder="Board name *" value={name}
                onChange={(e) => setName(e.target.value)} required
                className="flex-1 min-w-[180px] px-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-400 bg-white"
              />
              <input
                type="text" placeholder="Description (optional)" value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 min-w-[220px] px-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-400 bg-white"
              />
              <button type="submit" disabled={loading}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {loading ? 'Creating…' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-700 border border-gray-200 bg-white">
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* My Boards */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <FaThLarge className="text-indigo-500" />
            <h2 className="text-lg font-bold text-gray-800">My Boards</h2>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">{boards.length}</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {fetching ? (
              Array.from({ length: 3 }).map((_, i) => <BoardSkeleton key={i} />)
            ) : boards.length > 0 ? (
              boards.map((board) => (
                <div key={board.id} className="relative group/card">
                  <Board board={board} />
                  <button
                    onClick={() => handleDeleteBoard(board.id)}
                    className="absolute top-3 right-10 opacity-0 group-hover/card:opacity-100 transition-opacity p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 text-xs"
                    title="Delete board"
                  >✕</button>
                </div>
              ))
            ) : (
              <div className="w-full py-16 text-center rounded-2xl border-2 border-dashed border-gray-200">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-gray-500 text-sm mb-4">No boards yet. Create your first one!</p>
                <button onClick={() => setShowCreateForm(true)}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  + New Board
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Shared boards */}
        {(fetching || sharedBoards.length > 0) && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <FaUserFriends className="text-purple-500" />
              <h2 className="text-lg font-bold text-gray-800">Shared With Me</h2>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600">{sharedBoards.length}</span>
            </div>
            <div className="flex flex-wrap gap-4">
              {fetching ? (
                Array.from({ length: 2 }).map((_, i) => <BoardSkeleton key={i} />)
              ) : (
                sharedBoards.map((board) => <Board key={board.id} board={board} />)
              )}
            </div>
          </section>
        )}
      </div>

      <ImportBoardModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportBoard}
      />
    </div>
  );
}

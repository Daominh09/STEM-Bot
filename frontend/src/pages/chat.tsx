import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Plus, MessageSquare, LogOut, Trash2 } from 'lucide-react';
import ChatBox from '@/components/ChatBox';
import PDFUpload from '@/components/PDFUpload';

interface Chat {
  id: number;
  title: string | null;
  created_at: string;
}

const ChatPage: NextPage = () => {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchChats().then(() => setReady(true));
  }, []);

  const fetchChats = async () => {
    try {
      const res = await axios.get('http://localhost:8000/chats/');
      setChats(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  };

  const createNewChat = async () => {
    setIsCreating(true);
    try {
      const res = await axios.post('http://localhost:8000/chats/');
      const newChat: Chat = res.data;
      setChats(prev => [newChat, ...prev]);
      setSelectedChatId(newChat.id);
    } catch (err) {
      console.error('Failed to create chat', err);
    } finally {
      setIsCreating(false);
    }
  };

  const updateChatTitle = (chatId: number, title: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, title } : c));
  };

  const deleteChat = async (chatId: number) => {
    try {
      await axios.delete(`http://localhost:8000/chats/${chatId}`);
      setChats(prev => prev.filter(c => c.id !== chatId));
      if (selectedChatId === chatId) setSelectedChatId(null);
    } catch (err) {
      console.error('Failed to delete chat', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        {/* Logo + New Chat */}
        <div className="p-4 border-b border-gray-700 space-y-3">
          <span className="text-lg font-bold text-green-400 tracking-tight">STEM Bot</span>
          <button
            onClick={createNewChat}
            disabled={isCreating}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition text-sm disabled:opacity-50"
          >
            <Plus size={15} />
            <span>{isCreating ? 'Creating…' : 'New Chat'}</span>
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {chats.length === 0 ? (
            <p className="text-gray-500 text-xs text-center mt-8 px-2">
              No chats yet. Start one above.
            </p>
          ) : (
            chats.map(chat => (
              <div
                key={chat.id}
                className={`group flex items-center rounded-lg mb-1 text-sm transition ${
                  selectedChatId === chat.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <button
                  onClick={() => setSelectedChatId(chat.id)}
                  className="flex-1 text-left px-3 py-2 flex items-center space-x-2 min-w-0"
                >
                  <MessageSquare size={13} className="flex-shrink-0" />
                  <span className="truncate">{chat.title || 'New Chat'}</span>
                </button>
                <button
                  onClick={() => deleteChat(chat.id)}
                  className="pr-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* PDF Upload */}
        <PDFUpload />

        {/* Logout */}
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition text-sm"
          >
            <LogOut size={15} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {selectedChatId !== null ? (
          <ChatBox
            chatId={selectedChatId}
            onTitleChange={title => updateChatTitle(selectedChatId, title)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium text-gray-500">Select a chat or start a new one</p>
            <button
              onClick={createNewChat}
              className="mt-4 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
            >
              New Chat
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;

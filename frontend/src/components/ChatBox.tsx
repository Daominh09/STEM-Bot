import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  content: string;
  created_at: string;
}

interface ChatBoxProps {
  chatId: number;
  onTitleChange?: (title: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ chatId, onTitleChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstMessage = useRef(true);

  useEffect(() => {
    setMessages([]);
    setIsFetching(true);
    fetchMessages();
    isFirstMessage.current = true;
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/chats/${chatId}/messages`);
      setMessages(res.data);
      isFirstMessage.current = res.data.length === 0;
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setIsFetching(false);
    }
  };

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || isLoading) return;

    setInput('');

    const tempUserMsg: Message = {
      id: Date.now(),
      sender: 'user',
      content: question,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const res = await axios.post(`http://localhost:8000/chats/${chatId}/ask`, { question });
      const botMsg: Message = {
        id: res.data.message_id,
        sender: 'bot',
        content: res.data.response,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMsg]);

      if (isFirstMessage.current && onTitleChange) {
        onTitleChange(question.slice(0, 60));
        isFirstMessage.current = false;
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          content: 'Sorry, something went wrong. Please try again.',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
        <span className="font-semibold text-gray-700">STEM Bot</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {isFetching ? (
          <div className="text-center text-gray-400 mt-16">Loading…</div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
            <p className="text-lg font-medium">Ask me anything about STEM!</p>
            <p className="text-sm mt-1 text-gray-400">
              I answer questions based on your uploaded documents.
            </p>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl text-sm text-gray-400 flex items-center space-x-1">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>•</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>•</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>•</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t px-6 py-4 flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a STEM question…"
          disabled={isLoading || isFetching}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

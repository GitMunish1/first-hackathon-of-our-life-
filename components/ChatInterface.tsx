import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';
import { createSwarmChat, sendMessageStream } from '../services/geminiService';
import { Chat } from "@google/genai";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      content: 'Devil AI System Booted. I am the Overseer. How may I assist you?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatInstance = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat only once
  useEffect(() => {
    chatInstance.current = createSwarmChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chatInstance.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const modelMsgId = (Date.now() + 1).toString();
    const modelMsgPlaceholder: ChatMessage = {
      id: modelMsgId,
      role: 'model',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, modelMsgPlaceholder]);

    let fullText = '';

    await sendMessageStream(chatInstance.current, userMsg.content, (chunk) => {
      fullText += chunk;
      setMessages(prev => 
        prev.map(msg => 
          msg.id === modelMsgId 
            ? { ...msg, content: fullText } 
            : msg
        )
      );
    });

    setMessages(prev => 
      prev.map(msg => 
        msg.id === modelMsgId 
          ? { ...msg, isStreaming: false } 
          : msg
      )
    );
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 max-w-4xl mx-auto ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/30 flex-shrink-0">
                <Bot size={18} className="text-blue-400" />
              </div>
            )}
            
            <div
              className={`relative px-6 py-4 rounded-2xl max-w-[80%] shadow-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed text-sm">
                {msg.content}
                {msg.isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-blue-400 animate-pulse align-middle" />
                )}
              </div>
              <span className={`text-[10px] absolute bottom-1 right-3 ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 flex-shrink-0">
                <User size={18} className="text-slate-400" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Transmit message to Devil Core..."
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl py-4 pl-6 pr-14 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none h-[60px]"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-3 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
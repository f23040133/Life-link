import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minus, Sparkles, Bot, User, ChevronRight } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToAI, initializeChat } from '../services/geminiService';

export const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Suggestions to show when chat is empty
  const suggestions = [
    "Am I eligible to donate?",
    "Where is the nearest center?",
    "How to prepare for donation?",
    "Why is my blood type important?"
  ];

  useEffect(() => {
    if (isOpen && !hasInitialized) {
        initializeChat();
        setMessages([
            { 
                id: 'welcome', 
                role: 'model', 
                text: "Hello! I'm LifeLink AI. I can help you with donation eligibility, health questions, or navigating the app. How can I assist you today?", 
                timestamp: new Date() 
            }
        ]);
        setHasInitialized(true);
    }
  }, [isOpen, hasInitialized]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
        const responseText = await sendMessageToAI(text);
        
        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
        const errorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: "I encountered a connection error. Please try again.",
            timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-500 rounded-full shadow-2xl shadow-red-600/40 hover:scale-105 transition-all duration-300 group border-4 border-white dark:border-gray-800"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-8 h-8 text-white" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white dark:border-gray-800"></span>
        </span>
        
        {/* Tooltip */}
        <div className="absolute right-20 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none">
            Chat with LifeLink AI
            <div className="absolute top-1/2 -right-1 w-2 h-2 bg-white dark:bg-gray-800 transform rotate-45 -translate-y-1/2 border-t border-r border-gray-100 dark:border-gray-700"></div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[400px] h-[600px] max-h-[85vh] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-fade-in ring-1 ring-black/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex items-center justify-between shrink-0 shadow-md z-10">
        <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/20 shadow-inner">
                <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
                <h3 className="font-bold text-white text-base">LifeLink Assistant</h3>
                <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <p className="text-red-100 text-xs font-medium">Online • Gemini Powered</p>
                </div>
            </div>
        </div>
        <div className="flex items-center space-x-1">
            <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-white/20 rounded-lg text-white/90 hover:text-white transition-colors"
                aria-label="Minimize chat"
            >
                <Minus className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50 dark:bg-gray-900/50 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-white dark:from-red-900 dark:to-gray-800 flex items-center justify-center mr-2 shadow-sm border border-gray-100 dark:border-gray-700 mt-1 shrink-0">
                    <Sparkles className="w-4 h-4 text-red-500" />
                </div>
            )}
            
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-red-600 text-white rounded-br-sm'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-600 rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>

            {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center ml-2 mt-1 shrink-0">
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                </div>
            )}
          </div>
        ))}
        
        {isTyping && (
           <div className="flex justify-start animate-fade-in">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-white dark:from-red-900 dark:to-gray-800 flex items-center justify-center mr-2 shadow-sm border border-gray-100 dark:border-gray-700">
                <Sparkles className="w-4 h-4 text-red-500" />
             </div>
             <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-sm border border-gray-100 dark:border-gray-600 px-4 py-3 shadow-sm flex items-center space-x-1.5 h-11">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
             </div>
           </div>
        )}

        {/* Suggestions */}
        {messages.length < 2 && !isTyping && (
            <div className="grid grid-cols-1 gap-2 mt-4">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1">Suggested Questions</p>
                {suggestions.map((suggestion, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSendMessage(suggestion)}
                        className="text-left px-4 py-3 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-between group"
                    >
                        {suggestion}
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 transition-colors" />
                    </button>
                ))}
            </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your question..."
                    className="w-full pl-4 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm dark:text-white dark:placeholder-gray-400 transition-all"
                />
            </div>
            <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40 active:scale-95"
            >
                <Send className="w-5 h-5" />
            </button>
        </form>
        <div className="mt-2 text-center">
            <p className="text-[10px] text-gray-400 dark:text-gray-500">AI can make mistakes. Verify important medical info.</p>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, X, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Sender } from '../types';
import { FileUpload } from './FileUpload';
import { MessageBubble } from './MessageBubble';
import { extractTextFromPDF } from '../services/pdfService';
import { initializeChat, sendMessageStream } from '../services/geminiService';

export const ChatView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatReady, setIsChatReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setError(null);

    try {
      const { text } = await extractTextFromPDF(selectedFile);
      await initializeChat(text);
      setIsChatReady(true);
      
      // Add initial greeting
      const greeting: Message = {
        id: uuidv4(),
        text: `Hello! I've read **${selectedFile.name}**. What would you like to know about it?`,
        sender: Sender.BOT,
        timestamp: new Date()
      };
      setMessages([greeting]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process PDF.");
      setFile(null); // Reset on error
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !isChatReady || isProcessing) return;

    const userMessage: Message = {
      id: uuidv4(),
      text: input,
      sender: Sender.USER,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // Create a placeholder bot message for streaming
      const botMessageId = uuidv4();
      const botMessage: Message = {
        id: botMessageId,
        text: '',
        sender: Sender.BOT,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);

      await sendMessageStream(userMessage.text, (chunkText) => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, text: chunkText }
              : msg
          )
        );
      });
    } catch (err: any) {
      console.error(err);
      setError("Failed to get response from AI.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setFile(null);
    setMessages([]);
    setIsChatReady(false);
    setError(null);
    setInput('');
  };

  if (!isChatReady) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50">
        <div className="max-w-2xl w-full text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">PDF AI Assistant</h1>
            <p className="text-gray-600">Upload a research paper or document to start chatting.</p>
        </div>
        <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
        
        {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100 max-w-xl mx-auto w-full">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shadow-sm z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                <FileText size={20} />
            </div>
            <div>
                <h2 className="font-semibold text-gray-800">{file?.name}</h2>
                <p className="text-xs text-gray-500">AI Assistant Active</p>
            </div>
        </div>
        <button 
            onClick={resetChat}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
            title="Close and upload new file"
        >
            <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something about the document..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none shadow-sm"
            rows={1}
            style={{ minHeight: '50px', maxHeight: '150px' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isProcessing}
            className={`
              absolute right-2 top-2 p-2 rounded-lg transition-all
              ${!input.trim() || isProcessing 
                ? 'text-gray-400 bg-transparent cursor-not-allowed' 
                : 'text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm'}
            `}
          >
            <Send size={18} />
          </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-xs text-gray-400">AI can make mistakes. Please verify important information.</p>
        </div>
      </div>
    </div>
  );
};



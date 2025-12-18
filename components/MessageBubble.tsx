import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sender, Message } from '../types';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;

  return (
    <div className={`flex w-full gap-4 mb-6 animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
        ${isUser ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}
      `}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Content */}
      <div className={`
        relative max-w-[85%] lg:max-w-[75%] px-5 py-3.5 rounded-2xl shadow-sm
        ${isUser 
          ? 'bg-indigo-600 text-white rounded-tr-none' 
          : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}
      `}>
        <div className={`markdown-content text-[15px] leading-relaxed ${isUser ? 'text-white' : 'text-gray-800'}`}>
          {isUser ? (
            <p>{message.text}</p>
          ) : (
            <ReactMarkdown 
                components={{
                    ul: ({node, ...props}) => <ul className="list-disc ml-4 my-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal ml-4 my-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-md font-bold mb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-2" {...props} />,
                    code: ({node, className, children, ...props}) => { // Type safe destructuring for code blocks
                        return (
                          <code className={`${className} bg-gray-100 text-red-500 px-1 rounded text-sm font-mono`} {...props}>
                            {children}
                          </code>
                        );
                    },
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2" {...props} />
                }}
            >
              {message.text}
            </ReactMarkdown>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-[10px] mt-1 opacity-60 ${isUser ? 'text-indigo-100 text-right' : 'text-gray-400'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

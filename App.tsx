import React, { useState } from 'react';
import { Database, MessageSquareText } from 'lucide-react';
import { DatasetExplorer } from './components/DatasetExplorer';
import { ChatView } from './components/ChatView';

type ViewMode = 'explorer' | 'chat';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('explorer');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Navigation Rail */}
      <div className="w-16 bg-slate-900 flex flex-col items-center py-6 gap-6 z-20 flex-shrink-0">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg mb-2">
           <span className="font-bold text-lg">U</span>
        </div>

        <button 
          onClick={() => setCurrentView('explorer')}
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative
            ${currentView === 'explorer' 
              ? 'bg-white/10 text-white shadow-inner' 
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}
          `}
          title="Dataset Explorer"
        >
          <Database size={20} />
          {/* Tooltip */}
          <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Data Explorer
          </span>
        </button>

        <button 
          onClick={() => setCurrentView('chat')}
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative
            ${currentView === 'chat' 
              ? 'bg-white/10 text-white shadow-inner' 
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}
          `}
          title="PDF AI Assistant"
        >
          <MessageSquareText size={20} />
          <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            PDF AI Chat
          </span>
        </button>
      </div>

      {/* Main View Area */}
      <div className="flex-1 h-full min-w-0 bg-white">
        {currentView === 'explorer' ? (
          <DatasetExplorer />
        ) : (
          <ChatView />
        )}
      </div>
    </div>
  );
};

export default App;

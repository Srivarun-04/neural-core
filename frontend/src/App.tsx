import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Navbar } from './components/Header/Navbar';
import { ChatArea } from './components/Chat/ChatArea';
import { KnowledgeBase } from './components/KnowledgeBase/KnowledgeBase';
import { useChat } from './hooks/useChat';
import { Menu, Globe, AlertCircle, X } from 'lucide-react';
import { StorageUtil } from './utils/storage';

function App() {
  const {
    conversations,
    activeConversation,
    activeId,
    loading,
    isThinking,
    statusMessage,
    createNewChat,
    selectChat,
    renameChat,
    deleteChat,
    sendMessage,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'knowledge'>('chat');
  const [backendUrl, setBackendUrl] = useState(StorageUtil.getBackendUrl() || 'http://localhost:8000');
  const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');

  // Optimized connection check: Initial ping + 60s interval (paused when tab hidden) + on-focus check
  React.useEffect(() => {
    let intervalId: any = null;

    const checkConnection = async () => {
      if (document.hidden) return;
      try {
        const response = await fetch(`${backendUrl}/health`, { method: 'GET' }).catch(() => null);
        setStatus(response && response.ok ? 'connected' : 'disconnected');
      } catch {
        setStatus('disconnected');
      }
    };

    checkConnection();

    const startPolling = () => {
      if (!intervalId && !document.hidden) {
        intervalId = setInterval(checkConnection, 60000);
      }
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        checkConnection();
        startPolling();
      }
    };

    const handleFocus = () => {
      checkConnection();
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [backendUrl]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageUtil.setBackendUrl(backendUrl);
    setSettingsOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080B14] text-gray-200">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black/60 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelectChat={(id) => {
          selectChat(id);
          setCurrentView('chat');
          setSidebarOpen(false);
        }}
        onRenameChat={renameChat}
        onDeleteChat={deleteChat}
        onCreateNewChat={() => {
          createNewChat();
          setCurrentView('chat');
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Navbar Header */}
        <div className="flex items-center bg-[#0F1424]/80">
          {/* Mobile Sidebar Trigger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-4 text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <Navbar 
              backendUrl={backendUrl} 
              onSettingsClick={() => setSettingsOpen(true)} 
              status={status === 'connected' ? 'connected' : 'disconnected'}
              currentView={currentView}
              onViewChange={(view) => setCurrentView(view)}
            />
          </div>
        </div>

        {/* View Switcher: Chat Workspace vs Knowledge Base Dashboard */}
        {currentView === 'chat' ? (
          <ChatArea
            activeConversation={activeConversation}
            loading={loading}
            isThinking={isThinking}
            statusMessage={statusMessage}
            onSendMessage={sendMessage}
            status={status === 'connected' ? 'connected' : 'disconnected'}
          />
        ) : (
          <KnowledgeBase backendUrl={backendUrl} />
        )}
      </div>

      {/* Settings Modal Dialog */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0F1424] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-500" />
                <span>Backend Settings</span>
              </h3>
              <button 
                onClick={() => setSettingsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  FastAPI Endpoint URL
                </label>
                <input
                  type="url"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl flex gap-3 text-xs text-purple-300 leading-relaxed">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-400" />
                <p>
                  Ensure your FastAPI python server is active and has enabled CORS (Cross-Origin Resource Sharing) for local clients.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save URL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

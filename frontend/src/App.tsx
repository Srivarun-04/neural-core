import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Navbar } from './components/Header/Navbar';
import { ChatArea } from './components/Chat/ChatArea';
import { KnowledgeBase } from './components/KnowledgeBase/KnowledgeBase';
import { useChat } from './hooks/useChat';
import { Menu, Globe, AlertCircle, X } from 'lucide-react';
import { StorageUtil } from './utils/storage';
import { NuraVaultLogo } from './components/common/NuraVaultLogo';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [backendUrl, setBackendUrl] = useState(
    StorageUtil.getBackendUrl() || (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000'
  );
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => StorageUtil.getTheme());

  // Apply theme class on mount and changes
  useEffect(() => {
    StorageUtil.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Connection check: Initial ping + 60s interval + on-focus check
  useEffect(() => {
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
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors">
      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden backdrop-blur-xs transition-opacity"
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
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSettingsClick={() => setSettingsOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Navbar Header */}
        <div className="flex items-center bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
          {/* Mobile Sidebar Hamburger Trigger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <Navbar
              backendUrl={backendUrl}
              onSettingsClick={() => setSettingsOpen(true)}
              status={status}
              currentView={currentView}
              onViewChange={(view) => setCurrentView(view)}
              theme={theme}
              onToggleTheme={toggleTheme}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>

        {/* Workspace View Switcher */}
        {currentView === 'chat' ? (
          <ChatArea
            activeConversation={activeConversation}
            loading={loading}
            isThinking={isThinking}
            statusMessage={statusMessage}
            onSendMessage={sendMessage}
            status={status}
          />
        ) : (
          <KnowledgeBase backendUrl={backendUrl} />
        )}
      </div>

      {/* Settings Modal Dialog */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2.5">
                <NuraVaultLogo size={22} showGlow={false} />
                <span>NuraVault Settings</span>
              </h3>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-card)] cursor-pointer"
                aria-label="Close settings"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  NuraVault Backend URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={backendUrl}
                    onChange={(e) => setBackendUrl(e.target.value)}
                    placeholder="http://localhost:8000"
                    required
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-sky-500/50"
                  />
                </div>
              </div>

              <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl flex gap-3 text-xs text-sky-400 leading-relaxed">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  Ensure your NuraVault FastAPI backend is running and CORS is enabled for frontend origins.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 rounded-xl shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                >
                  Save Configuration
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

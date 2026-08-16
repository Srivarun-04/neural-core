import { Settings, Globe, MessageSquare, Database, Sun, Moon, Search, X } from 'lucide-react';
import { NuraVaultLogo } from '../common/NuraVaultLogo';

interface NavbarProps {
  backendUrl: string;
  onSettingsClick?: () => void;
  status: 'connected' | 'disconnected' | 'connecting';
  currentView: 'chat' | 'knowledge';
  onViewChange: (view: 'chat' | 'knowledge') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Navbar({
  backendUrl,
  onSettingsClick,
  status,
  currentView,
  onViewChange,
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
}: NavbarProps) {
  return (
    <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-10 w-full transition-colors">
      {/* Left: Brand & View Switcher */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <NuraVaultLogo size={32} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-[var(--text-primary)]">
                NuraVault
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 leading-none mt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status === 'connected'
                    ? 'bg-emerald-500 animate-pulse'
                    : status === 'connecting'
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-rose-500'
                }`}
              />
              <span className="hidden sm:inline">
                {status === 'connected'
                  ? 'Connected to NuraVault API'
                  : status === 'connecting'
                  ? 'Connecting to API...'
                  : 'NuraVault API Offline'}
              </span>
              <span className="sm:hidden">
                {status === 'connected' ? 'Online' : 'Offline'}
              </span>
            </p>
          </div>
        </div>

        {/* View Switcher Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-[var(--bg-card)] p-1 border border-[var(--border-subtle)] rounded-xl">
          <button
            onClick={() => onViewChange('chat')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'chat'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Workspace</span>
          </button>

          <button
            onClick={() => onViewChange('knowledge')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'knowledge'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>Knowledge Base</span>
          </button>
        </nav>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search chats & docs..."
            className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl pl-8 pr-7 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-sky-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile View Toggle */}
        <div className="flex md:hidden items-center gap-1 bg-[var(--bg-card)] rounded-lg p-0.5 border border-[var(--border-subtle)]">
          <button
            onClick={() => onViewChange('chat')}
            className={`p-1.5 rounded-md text-xs font-medium transition-all ${
              currentView === 'chat'
                ? 'bg-sky-600 text-white'
                : 'text-[var(--text-muted)]'
            }`}
            title="Chat Workspace"
            aria-label="Chat Workspace"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewChange('knowledge')}
            className={`p-1.5 rounded-md text-xs font-medium transition-all ${
              currentView === 'knowledge'
                ? 'bg-sky-600 text-white'
                : 'text-[var(--text-muted)]'
            }`}
            title="Knowledge Base"
            aria-label="Knowledge Base"
          >
            <Database className="w-4 h-4" />
          </button>
        </div>

        {/* Backend URL (Desktop) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          <span className="truncate max-w-[160px] font-mono text-[11px]">{backendUrl}</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl transition-all cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-sky-600" />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={onSettingsClick}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl transition-all cursor-pointer"
          title="Configure backend settings"
          aria-label="Configure backend settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

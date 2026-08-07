import { Cpu, Settings, Globe } from 'lucide-react';

interface NavbarProps {
  backendUrl: string;
  onSettingsClick?: () => void;
  status: 'connected' | 'disconnected' | 'connecting';
}

export function Navbar({ backendUrl, onSettingsClick, status }: NavbarProps) {
  return (
    <header className="h-16 border-b border-gray-800 bg-[#0F1424]/80 backdrop-blur-md flex items-center justify-between px-6 z-10 w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/20">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2 m-0 p-0">
            AI Brain <span className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full font-medium">RAG Core</span>
          </h1>
          <p className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${
              status === 'connected' ? 'bg-emerald-500 animate-pulse' :
              status === 'connecting' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'
            }`} />
            {status === 'connected' ? 'Connected to core' : status === 'connecting' ? 'Reconnecting...' : 'Core Offline'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-900/60 rounded-lg border border-gray-800 text-xs text-gray-400">
          <Globe className="w-3.5 h-3.5" />
          <span className="truncate max-w-[200px]">{backendUrl}</span>
        </div>
        
        <button 
          onClick={onSettingsClick}
          className="p-2 text-gray-400 hover:text-white bg-gray-900/40 hover:bg-gray-800/80 border border-gray-800 rounded-lg transition-all"
          title="Configure backend settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

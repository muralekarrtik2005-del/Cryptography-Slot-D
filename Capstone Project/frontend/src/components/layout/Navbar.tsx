import React from 'react';
import { Menu, Bell, Lock, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      '/dashboard': 'Security overview',
      '/data-analysis': 'Data analysis',
      '/ai-recommendations': 'AI recommendations',
      '/cryptanalysis': 'Cryptanalysis',
      '/encryption': 'Cipher engine',
      '/reports': 'Assessment reports',
      '/security-dashboard': 'Threat intelligence',
      '/history': 'Security history',
      '/profile': 'Analyst profile',
      '/settings': 'Workspace settings',
    };
    return titles[location.pathname] || 'CipherSense workspace';
  };

  return (
    <header className="sticky top-0 z-30 h-20 px-4 md:px-7 flex items-center justify-between bg-[#08110f]/82 backdrop-blur-xl border-b border-white/[0.07]">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 text-[#91a39b] rounded-xl lg:hidden hover:text-white hover:bg-white/[0.05]"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#688078] mb-1">
            CipherSense / Workspace
          </p>
          <h1 className="text-lg md:text-xl font-semibold text-slate-100 tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/cryptanalysis')}
          className="hidden md:flex h-9 items-center gap-2 px-3.5 rounded-xl text-[12px] font-semibold text-[#baff94] border border-[#a8ff78]/15 bg-[#a8ff78]/[0.07] hover:bg-[#a8ff78]/[0.12]"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Analyze</span>
        </button>
        <button
          onClick={() => navigate('/encryption')}
          className="hidden sm:flex h-9 items-center gap-2 px-3.5 rounded-xl text-[12px] font-semibold text-slate-300 border border-white/[0.07] bg-white/[0.035] hover:bg-white/[0.07]"
        >
          <Lock className="w-3.5 h-3.5 text-[#56dca5]" />
          <span>Encrypt</span>
        </button>
        <button
          className="relative p-2.5 text-[#91a39b] rounded-xl hover:text-white hover:bg-white/[0.05]"
          title="Notifications"
        >
          <Bell className="w-[17px] h-[17px]" />
          <span className="status-pulse absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#a8ff78]" />
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="ml-1 w-9 h-9 rounded-xl bg-gradient-to-br from-[#a8ff78] to-[#56dca5] text-[#08110f] flex items-center justify-center text-[11px] font-bold hover:scale-[1.03]"
          title="Profile"
        >
          {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CS'}
        </button>
      </div>
    </header>
  );
};

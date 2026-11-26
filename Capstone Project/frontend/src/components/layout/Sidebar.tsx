import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCode2,
  BrainCircuit,
  Binary,
  KeyRound,
  FileText,
  ShieldAlert,
  History,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Data analysis', path: '/data-analysis', icon: FileCode2 },
    { name: 'AI recommendations', path: '/ai-recommendations', icon: BrainCircuit },
    { name: 'Cryptanalysis', path: '/cryptanalysis', icon: Binary },
    { name: 'Cipher engine', path: '/encryption', icon: KeyRound },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Threat intelligence', path: '/security-dashboard', icon: ShieldAlert },
    { name: 'History', path: '/history', icon: History },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#020806]/70 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-[248px] bg-[#0a1512]/95 backdrop-blur-xl border-r border-white/[0.07] transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center border-b border-white/[0.07]">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative w-10 h-10 rounded-[14px] bg-[#a8ff78] text-[#08110f] flex items-center justify-center shadow-[0_8px_30px_rgba(168,255,120,.14)]">
              <ShieldCheck className="w-5 h-5" />
              <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full border-2 border-[#0a1512] bg-[#56dca5]" />
            </div>
            <div>
              <p className="font-bold text-[15px] tracking-[0.16em] text-white">CIPHERSENSE</p>
              <p className="text-[9px] mt-0.5 text-[#91a39b] font-mono uppercase tracking-[0.22em]">Security workspace</p>
            </div>
          </NavLink>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[9px] uppercase tracking-[0.22em] text-[#688078] font-semibold">Workspace</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `relative flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group ${
                    isActive ? 'text-[#baff94] bg-[#a8ff78]/[0.09]' : 'text-[#91a39b] hover:text-white hover:bg-white/[0.035]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute -left-3 w-1 h-5 rounded-r-full bg-[#a8ff78]" />}
                    <div className="flex items-center gap-3">
                      <Icon className={`w-[17px] h-[17px] ${isActive ? 'text-[#a8ff78]' : 'text-[#71877e] group-hover:text-[#b0c5bb]'}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                  </>
                )}
              </NavLink>
            );
          })}

          <p className="px-3 pt-5 pb-3 text-[9px] uppercase tracking-[0.22em] text-[#688078] font-semibold">Account</p>
          {[{ name: 'Profile', path: '/profile', icon: User }, { name: 'Settings', path: '/settings', icon: Settings }].map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium ${
                    isActive ? 'text-[#baff94] bg-[#a8ff78]/[0.09]' : 'text-[#91a39b] hover:text-white hover:bg-white/[0.035]'
                  }`
                }
              >
                <Icon className="w-[17px] h-[17px]" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-white/[0.07]">
          <div className="rounded-2xl p-2.5 bg-white/[0.025] border border-white/[0.055] flex items-center gap-2.5">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-[#a8ff78] to-[#56dca5] text-[#08110f] flex items-center justify-center text-xs font-bold">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CS'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-slate-200">{user?.name || 'Analyst'}</p>
              <p className="truncate text-[10px] text-[#71877e]">{user?.email || 'analyst@ciphersense.io'}</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-lg text-[#71877e] hover:text-rose-300 hover:bg-rose-400/10"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

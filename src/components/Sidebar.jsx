import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  BarChart3,
  Users2,
  BellRing,
  FileDown,
  Settings,
  HelpCircle,
  LogOut,
  Zap,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { notifications } = useFitness();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Workouts', to: '/workouts', icon: Dumbbell, badge: 'Track' },
    { name: 'Nutrition', to: '/nutrition', icon: UtensilsCrossed },
    { name: 'Progress', to: '/progress', icon: TrendingUp },
    { name: 'Analytics', to: '/analytics', icon: BarChart3 },
    { name: 'Community', to: '/community', icon: Users2 },
    {
      name: 'Notifications',
      to: '/notifications',
      icon: BellRing,
      badge: unreadCount > 0 ? unreadCount : null,
      badgeColor: 'bg-brand-lime text-dark-950 font-bold'
    },
    { name: 'Reports & Export', to: '/reports', icon: FileDown },
    { name: 'Settings', to: '/settings', icon: Settings },
    { name: 'Support & FAQ', to: '/support', icon: HelpCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-dark-900/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Brand Header */}
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/60">
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-lime to-brand-purple flex items-center justify-center shadow-glow-lime group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 text-dark-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                  PULSE<span className="text-brand-lime">FIT</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-brand-purple uppercase block -mt-0.5">
                  Performance SaaS
                </span>
              </div>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Core Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-lime/15 to-brand-purple/10 text-brand-lime border border-brand-lime/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Bottom */}
        <div className="p-4 border-t border-slate-800/80 bg-dark-950/40">
          <NavLink
            to="/profile"
            onClick={() => onClose && onClose()}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors group mb-2"
          >
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-lime/40"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-brand-lime rounded-full border-2 border-dark-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate group-hover:text-brand-lime transition-colors">
                {user?.name || 'Athlete'}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'Logged in'}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  Plus,
  Dumbbell,
  UtensilsCrossed,
  CheckCircle2,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';

export default function Navbar({ onOpenSidebar, onOpenQuickLog }) {
  const { user } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useFitness();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const unreadNotifications = notifications.filter(n => !n.read);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Route to workouts or community with query parameter
    navigate(`/workouts?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-dark-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises, nutrition logs, community members..."
            className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl border border-slate-800 focus:border-brand-lime/60 focus:ring-1 focus:ring-brand-lime/50 transition-all outline-none"
          />
        </form>
      </div>

      {/* Right: Quick Log, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Log Action Button */}
        <button
          onClick={onOpenQuickLog}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-lime to-emerald-500 text-dark-950 font-bold text-xs sm:text-sm hover:shadow-glow-lime hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden xs:inline">Quick Log</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-purple text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-glow-purple animate-pulse">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {/* Dropdown Panel */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white">Notifications</h4>
                  {unreadNotifications.length > 0 && (
                    <span className="text-[10px] bg-brand-lime/20 text-brand-lime px-2 py-0.5 rounded-full font-semibold">
                      {unreadNotifications.length} new
                    </span>
                  )}
                </div>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-brand-purple hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No notifications yet</p>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n._id}
                      onClick={() => markNotificationRead(n._id)}
                      className={`p-3 rounded-xl transition-colors cursor-pointer flex gap-3 ${
                        n.read ? 'opacity-65 hover:bg-slate-800/40' : 'bg-slate-800/50 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-brand-lime" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 mt-2 text-center">
                <NavLink
                  to="/notifications"
                  onClick={() => setShowNotifDropdown(false)}
                  className="text-xs font-semibold text-brand-lime hover:underline inline-flex items-center gap-1"
                >
                  View all notifications & reminders &rarr;
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {/* User Mini Avatar Link */}
        <NavLink
          to="/profile"
          className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-lime/40 transition-colors"
        >
          <span className="text-xs font-semibold text-slate-300 hidden md:inline">
            {user?.name?.split(' ')[0] || 'Athlete'}
          </span>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
            alt="Profile"
            className="w-8 h-8 rounded-lg object-cover ring-1 ring-brand-lime/30"
          />
        </NavLink>
      </div>
    </header>
  );
}

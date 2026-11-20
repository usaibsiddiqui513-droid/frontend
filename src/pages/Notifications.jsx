import React, { useState } from 'react';
import {
  BellRing,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Award,
  Users2,
  UtensilsCrossed,
  Dumbbell,
  Check,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export default function Notifications() {
  const {
    notifications,
    reminders,
    addReminder,
    toggleReminder,
    deleteReminder,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
  } = useFitness();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread' | 'achievement' | 'reminder'
  const [modalOpen, setModalOpen] = useState(false);
  const [reminderForm, setReminderForm] = useState({
    title: '',
    time: '08:00',
    type: 'workout',
    days: ['Mon', 'Wed', 'Fri']
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'achievement') return n.type === 'achievement';
    if (activeFilter === 'reminder') return n.type === 'reminder';
    return true;
  });

  const handleDayToggle = (day) => {
    setReminderForm(prev => {
      const exists = prev.days.includes(day);
      return {
        ...prev,
        days: exists ? prev.days.filter(d => d !== day) : [...prev.days, day]
      };
    });
  };

  const handleCreateReminder = (e) => {
    e.preventDefault();
    if (!reminderForm.title.trim() || reminderForm.days.length === 0) return;
    addReminder(reminderForm);
    setReminderForm({
      title: '',
      time: '08:00',
      type: 'workout',
      days: ['Mon', 'Wed', 'Fri']
    });
    setModalOpen(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'achievement': return Award;
      case 'workout': return Dumbbell;
      case 'nutrition': return UtensilsCrossed;
      case 'social': return Users2;
      default: return BellRing;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center text-brand-lime shadow-glow-lime">
              <BellRing className="w-5 h-5" />
            </span>
            <span>Notifications & Smart Reminders</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Stay on track with workout alerts, goal milestones, and custom schedule nudges.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-lime to-emerald-500 text-dark-950 font-bold text-sm shadow-glow-lime hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Scheduled Reminder</span>
        </button>
      </div>

      {/* 1. Scheduled Reminders Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-lime" />
            <span>Scheduled Recurring Reminders</span>
          </h3>
          <span className="text-xs text-slate-400">
            {reminders.filter(r => r.enabled).length} of {reminders.length} active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reminders.map((rem) => {
            const RemIcon = getTypeIcon(rem.type);
            return (
              <div
                key={rem._id}
                className={`glass-card rounded-2xl p-5 border transition-all ${
                  rem.enabled ? 'border-slate-800' : 'border-slate-800/40 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-brand-lime">
                      <RemIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{rem.title}</h4>
                      <span className="text-xs text-brand-lime font-mono font-semibold">{rem.time}</span>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleReminder(rem._id)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      rem.enabled ? 'bg-brand-lime' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-dark-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        rem.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Days Active */}
                <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-800/80">
                  {daysOfWeek.map((day) => {
                    const isActive = rem.days.includes(day);
                    return (
                      <span
                        key={day}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                          isActive
                            ? 'bg-brand-lime/20 text-brand-lime border border-brand-lime/30'
                            : 'bg-dark-950 text-slate-600'
                        }`}
                      >
                        {day}
                      </span>
                    );
                  })}
                  <button
                    onClick={() => deleteReminder(rem._id)}
                    className="ml-auto p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Notifications Log */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">System & Achievement Alerts</h3>
            {notifications.some(n => !n.read) && (
              <span className="text-[10px] font-bold bg-brand-lime/20 text-brand-lime px-2.5 py-0.5 rounded-full">
                {notifications.filter(n => !n.read).length} Unread
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Filter buttons */}
            <div className="flex items-center bg-dark-950 border border-slate-800 p-1 rounded-xl">
              {['all', 'unread', 'achievement', 'reminder'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeFilter === f ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-brand-purple hover:underline font-semibold"
            >
              Mark all read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No notifications found in this view.</p>
          ) : (
            filteredNotifications.map((notif) => {
              const IconComp = getTypeIcon(notif.type);
              return (
                <div
                  key={notif._id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    notif.read
                      ? 'bg-dark-950/40 border-slate-800/60 opacity-70 hover:opacity-100'
                      : 'bg-dark-950 border-brand-lime/30 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        notif.type === 'achievement'
                          ? 'bg-brand-lime/10 text-brand-lime'
                          : notif.type === 'social'
                          ? 'bg-brand-purple/10 text-brand-purple'
                          : 'bg-cyan-500/10 text-cyan-400'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-brand-lime" />
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{notif.message}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">{notif.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notif.read && (
                      <button
                        onClick={() => markNotificationRead(notif._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-lime hover:bg-slate-800"
                        title="Mark read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif._id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create Reminder Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-dark-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">Create Custom Reminder</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reminder Label *</label>
                <input
                  type="text"
                  required
                  value={reminderForm.title}
                  onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
                  placeholder="e.g. Afternoon Mobility & Hydration"
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Time</label>
                  <input
                    type="time"
                    required
                    value={reminderForm.time}
                    onChange={(e) => setReminderForm({ ...reminderForm, time: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-brand-lime outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                  <select
                    value={reminderForm.type}
                    onChange={(e) => setReminderForm({ ...reminderForm, type: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-brand-lime outline-none"
                  >
                    <option value="workout">Workout</option>
                    <option value="nutrition">Nutrition & Water</option>
                    <option value="progress">Weigh-In</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Repeat Days</label>
                <div className="grid grid-cols-7 gap-1">
                  {daysOfWeek.map((day) => {
                    const isSelected = reminderForm.days.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-brand-lime text-dark-950 shadow-glow-lime'
                            : 'bg-dark-950 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-lime to-emerald-500 text-dark-950 font-bold text-sm shadow-glow-lime hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Schedule Reminder
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

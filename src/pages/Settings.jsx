import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Scale,
  Palette,
  Shield,
  KeyRound,
  Trash2,
  Check,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { unitPreference, setUnitPreference } = useFitness();

  const [activeTab, setActiveTab] = useState('profile');
  const [saveMessage, setSaveMessage] = useState('');

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Alex Rivera',
    email: user?.email || 'alex.rivera@pulsefit.io',
    bio: user?.bio || 'Fitness enthusiast & marathon trainee.',
    fitnessGoal: user?.fitnessGoal || 'Muscle Gain & Endurance',
    activityLevel: user?.activityLevel || 'Very Active',
  });

  // Notification toggles state
  const [notificationsEnabled, setNotificationsEnabled] = useState({
    workoutReminders: true,
    dailyMacros: true,
    communityReplies: true,
    weeklyReports: false,
    prMilestones: true,
  });

  // Privacy toggles state
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    shareWorkouts: true,
    shareNutrition: false,
    searchableEmail: false,
  });

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    setSaveMessage('Profile settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleUnitToggle = (unit) => {
    setUnitPreference(unit);
    updateProfile({ unitPreference: unit });
    setSaveMessage(`Unit preference updated to ${unit}`);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setSaveMessage('Password updated securely!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-lime shadow-md">
            <SettingsIcon className="w-5 h-5" />
          </span>
          <span>Settings & Preferences</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Customize your profile, biometric units, privacy boundaries, and alerts.
        </p>
      </div>

      {saveMessage && (
        <div className="p-3.5 rounded-2xl bg-brand-lime/10 border border-brand-lime/30 text-brand-lime text-xs font-semibold flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'units', label: 'Units & Metrics', icon: Scale },
          { id: 'notifications', label: 'Alert Preferences', icon: Bell },
          { id: 'privacy', label: 'Privacy & Sharing', icon: Shield },
          { id: 'security', label: 'Security & Account', icon: KeyRound },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-brand-lime border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Profile Settings */}
      {activeTab === 'profile' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 max-w-2xl">
          <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Athlete Bio</label>
              <textarea
                rows="3"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-lime outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Fitness Goal</label>
                <select
                  value={profileForm.fitnessGoal}
                  onChange={(e) => setProfileForm({ ...profileForm, fitnessGoal: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                >
                  <option value="Muscle Gain & Endurance">Muscle Gain & Endurance</option>
                  <option value="Fat Loss & Definition">Fat Loss & Definition</option>
                  <option value="Strength & Powerlifting">Strength & Powerlifting</option>
                  <option value="General Health & Mobility">General Health & Mobility</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Activity Level</label>
                <select
                  value={profileForm.activityLevel}
                  onChange={(e) => setProfileForm({ ...profileForm, activityLevel: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                >
                  <option value="Sedentary">Sedentary (Desk Job)</option>
                  <option value="Moderately Active">Moderately Active (3-4 days/wk)</option>
                  <option value="Very Active">Very Active (5-7 days/wk)</option>
                  <option value="Elite / Professional">Elite / Double Sessions</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-lime to-emerald-500 text-dark-950 font-bold text-sm shadow-glow-lime hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* 2. Units & Preferences */}
      {activeTab === 'units' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 max-w-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">System of Units</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your preferred measurements for bar weights, body weigh-ins, and height.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleUnitToggle('KG')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                unitPreference === 'KG'
                  ? 'bg-brand-lime/10 border-brand-lime shadow-glow-lime'
                  : 'bg-dark-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-lg text-white">Metric (KG / CM)</span>
                {unitPreference === 'KG' && <Check className="w-5 h-5 text-brand-lime" />}
              </div>
              <p className="text-xs text-slate-400">Kilograms, centimeters, meters, and kilometers.</p>
            </button>

            <button
              type="button"
              onClick={() => handleUnitToggle('LBS')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                unitPreference === 'LBS'
                  ? 'bg-brand-purple/10 border-brand-purple shadow-glow-purple'
                  : 'bg-dark-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-lg text-white">Imperial (LBS / IN)</span>
                {unitPreference === 'LBS' && <Check className="w-5 h-5 text-brand-purple" />}
              </div>
              <p className="text-xs text-slate-400">Pounds, inches, feet, and miles.</p>
            </button>
          </div>
        </div>
      )}

      {/* 3. Notification Preferences */}
      {activeTab === 'notifications' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 max-w-2xl space-y-5">
          <h3 className="text-lg font-bold text-white">Notification Preferences</h3>

          {[
            { key: 'workoutReminders', title: 'Workout Reminders', desc: 'Push notifications for scheduled training sessions' },
            { key: 'dailyMacros', title: 'Daily Nutrition Reminders', desc: 'Remind me to log dinner and check remaining protein targets' },
            { key: 'communityReplies', title: 'Community Interactions', desc: 'Notify me when an athlete likes my post or responds' },
            { key: 'prMilestones', title: 'PR Milestone Celebrations', desc: 'Instant alerts whenever a personal record is broken' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-800/80">
              <div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsEnabled({ ...notificationsEnabled, [item.key]: !notificationsEnabled[item.key] })}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  notificationsEnabled[item.key] ? 'bg-brand-lime' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-dark-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    notificationsEnabled[item.key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. Privacy & Sharing */}
      {activeTab === 'privacy' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 max-w-2xl space-y-5">
          <h3 className="text-lg font-bold text-white">Privacy Controls</h3>

          {[
            { key: 'publicProfile', title: 'Public Profile Visibility', desc: 'Allow other athletes in the community to view my bio and follower count' },
            { key: 'shareWorkouts', title: 'Share Workouts on Community Feed', desc: 'Show completed workouts on the public athlete leaderboard' },
            { key: 'shareNutrition', title: 'Keep Nutrition Diary Private', desc: 'Only you can view your calorie and macro intake records' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-800/80">
              <div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setPrivacySettings({ ...privacySettings, [item.key]: !privacySettings[item.key] })}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  privacySettings[item.key] ? 'bg-brand-lime' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-dark-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    privacySettings[item.key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 5. Security & Account */}
      {activeTab === 'security' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 max-w-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Change Password</h3>
            <p className="text-xs text-slate-400 mt-1">Ensure your account is protected with a strong password.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Password</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Password</label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-colors"
            >
              Update Password
            </button>
          </form>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-rose-500/20">
            <h4 className="text-sm font-bold text-rose-400 mb-1">Danger Zone</h4>
            <p className="text-xs text-slate-400 mb-3">
              Permanently wipe all logged workouts, nutrition meals, and biometric check-ins.
            </p>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset your local data?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-colors"
            >
              Reset All Local Records
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import {
  User,
  Camera,
  Mail,
  Scale,
  Ruler,
  Target,
  Activity,
  CheckCircle2,
  Calendar,
  Zap,
  Award,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { workouts, progress, unitPreference, stats } = useFitness();

  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Rivera',
    email: user?.email || 'alex.rivera@pulsefit.io',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    bio: user?.bio || 'Fitness enthusiast & marathon trainee. Aiming for 12% body fat.',
    weight: user?.weight || 77.2,
    targetWeight: user?.targetWeight || 74.0,
    height: user?.height || 180,
    fitnessGoal: user?.fitnessGoal || 'Muscle Gain & Endurance',
    activityLevel: user?.activityLevel || 'Very Active',
    dailyCalorieTarget: user?.dailyCalorieTarget || 2400,
    dailyProteinTarget: user?.dailyProteinTarget || 160,
  });

  const [savedSuccess, setSavedSuccess] = useState('');

  // Curated high quality fitness athlete avatars
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess('Profile updated successfully!');
    setTimeout(() => setSavedSuccess(''), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Profile Header Hero */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-card border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-lime/15 via-brand-purple/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative group">
              <img
                src={formData.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-brand-lime/40 shadow-glow-lime"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{formData.name}</h1>
                <span className="text-[10px] bg-brand-lime/20 text-brand-lime border border-brand-lime/30 px-2 py-0.5 rounded-full font-bold">
                  PRO ATHLETE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{formData.email}</p>
              <p className="text-xs text-slate-300 mt-2 max-w-md italic">"{formData.bio}"</p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-slate-800 text-center min-w-[90px]">
              <span className="text-lg font-extrabold text-brand-lime">{stats.totalWorkouts}</span>
              <span className="text-[10px] text-slate-400 uppercase block">Workouts</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-slate-800 text-center min-w-[90px]">
              <span className="text-lg font-extrabold text-brand-purple">5 Days</span>
              <span className="text-[10px] text-slate-400 uppercase block">Streak</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-slate-800 text-center min-w-[90px]">
              <span className="text-lg font-extrabold text-cyan-400">{formData.weight}</span>
              <span className="text-[10px] text-slate-400 uppercase block">{unitPreference} Weight</span>
            </div>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-brand-lime/10 border border-brand-lime/30 text-brand-lime text-xs font-semibold flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Profile Edit Form & Avatar Picker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Preset Selector */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-brand-lime" />
            <span>Profile Picture</span>
          </h3>
          <p className="text-xs text-slate-400">Choose an athlete avatar preset or enter custom image URL:</p>

          <div className="grid grid-cols-5 gap-2">
            {avatarPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFormData({ ...formData, avatar: preset })}
                className={`rounded-xl overflow-hidden ring-2 transition-all ${
                  formData.avatar === preset ? 'ring-brand-lime scale-105' : 'ring-transparent hover:ring-slate-700'
                }`}
              >
                <img src={preset} alt="Avatar Preset" className="w-full h-12 object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Custom Image URL</label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://..."
              className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-lime outline-none"
            />
          </div>
        </div>

        {/* Profile Info Form (2 Cols) */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 lg:col-span-2">
          <h3 className="text-base font-bold text-white mb-4">Edit Personal & Target Metrics</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Athlete Bio</label>
              <textarea
                rows="2"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-brand-lime outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Current Weight ({unitPreference})
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-brand-lime outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Weight ({unitPreference})
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.targetWeight}
                  onChange={(e) => setFormData({ ...formData, targetWeight: Number(e.target.value) })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-brand-lime outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-brand-lime outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Daily Calorie Target (kcal)</label>
                <input
                  type="number"
                  value={formData.dailyCalorieTarget}
                  onChange={(e) => setFormData({ ...formData, dailyCalorieTarget: Number(e.target.value) })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-brand-lime outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Daily Protein Target (g)</label>
                <input
                  type="number"
                  value={formData.dailyProteinTarget}
                  onChange={(e) => setFormData({ ...formData, dailyProteinTarget: Number(e.target.value) })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-brand-lime outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-brand-lime to-emerald-500 text-dark-950 font-bold text-sm shadow-glow-lime hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Update Profile Details
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Dumbbell,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  Flame,
  Award,
  Layers,
  CheckCircle,
  X,
  ChevronDown
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import confetti from 'canvas-confetti';

export default function Workouts() {
  const { workouts, addWorkout, updateWorkout, deleteWorkout, unitPreference } = useFitness();
  const [searchParams] = useSearchParams();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'heaviest' | 'longest'
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Modal State for Add & Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [formData, setFormData] = useState({
    exerciseName: '',
    category: 'Strength',
    sets: 3,
    reps: 10,
    weightLifted: 50,
    duration: 30,
    caloriesBurned: 250,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    intensity: 'High'
  });

  const categories = ['All', 'Strength', 'Cardio', 'Flexibility', 'Other'];

  const filteredWorkouts = useMemo(() => {
    return workouts
      .filter((w) => {
        const matchesCat = selectedCategory === 'All' || w.category === selectedCategory;
        const matchesSearch =
          w.exerciseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (w.notes && w.notes.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'heaviest') return (Number(b.weightLifted) || 0) - (Number(a.weightLifted) || 0);
        if (sortBy === 'longest') return (Number(b.duration) || 0) - (Number(a.duration) || 0);
        return 0;
      });
  }, [workouts, selectedCategory, searchTerm, sortBy]);

  const handleOpenAdd = () => {
    setEditingWorkout(null);
    setFormData({
      exerciseName: '',
      category: 'Strength',
      sets: 3,
      reps: 10,
      weightLifted: 60,
      duration: 35,
      caloriesBurned: 280,
      date: new Date().toISOString().split('T')[0],
      notes: '',
      intensity: 'High'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      exerciseName: workout.exerciseName,
      category: workout.category,
      sets: workout.sets,
      reps: workout.reps,
      weightLifted: workout.weightLifted,
      duration: workout.duration,
      caloriesBurned: workout.caloriesBurned || 250,
      date: workout.date || new Date().toISOString().split('T')[0],
      notes: workout.notes || '',
      intensity: workout.intensity || 'High'
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.exerciseName.trim()) return;

    if (editingWorkout) {
      updateWorkout(editingWorkout._id, formData);
    } else {
      addWorkout(formData);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    }
    setModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete workout log "${name}"?`)) {
      deleteWorkout(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center text-brand-lime shadow-glow-lime">
              <Dumbbell className="w-5 h-5" />
            </span>
            <span>Workout Management</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Log exercises, track progressive overload, and monitor session volume.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-lime to-emerald-500 text-dark-950 font-bold text-sm shadow-glow-lime hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Workout</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search exercise or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-brand-lime outline-none"
            />
          </div>

          {/* Sort By & View Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-brand-lime outline-none"
              >
                <option value="newest">Most Recent</option>
                <option value="heaviest">Heaviest Weight</option>
                <option value="longest">Longest Duration</option>
              </select>
            </div>

            <div className="flex items-center bg-dark-950 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'cards' ? 'bg-slate-800 text-brand-lime' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'table' ? 'bg-slate-800 text-brand-lime' : 'text-slate-400 hover:text-white'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-lime text-dark-950 shadow-glow-lime'
                  : 'bg-dark-950/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-xs text-slate-400 ml-auto hidden sm:inline">
            Showing {filteredWorkouts.length} records
          </span>
        </div>
      </div>

      {/* Workout Display */}
      {filteredWorkouts.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800">
          <Dumbbell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No workouts found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, filter categories, or log a brand new workout record!
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 rounded-xl bg-brand-lime/10 border border-brand-lime/30 text-brand-lime text-xs font-semibold hover:bg-brand-lime/20"
          >
            + Add Workout Now
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkouts.map((w) => (
            <div
              key={w._id}
              className="glass-card rounded-2xl p-5 border border-slate-800 glass-card-hover flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-brand-lime border border-slate-700/80">
                      {w.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2 group-hover:text-brand-lime transition-colors">
                      {w.exerciseName}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(w)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(w._id, w.exerciseName)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Key stats row */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-dark-950/70 border border-slate-800/80 text-center my-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Sets & Reps</span>
                    <span className="text-xs font-bold text-white">{w.sets} × {w.reps}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Weight</span>
                    <span className="text-xs font-bold text-white">
                      {w.weightLifted > 0 ? `${w.weightLifted} ${unitPreference}` : 'Bodywt'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Duration</span>
                    <span className="text-xs font-bold text-white">{w.duration}m</span>
                  </div>
                </div>

                {w.notes && (
                  <p className="text-xs text-slate-400 italic line-clamp-2 mt-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800/50">
                    "{w.notes}"
                  </p>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {w.date}
                </span>
                <span className="flex items-center gap-1 font-semibold text-brand-lime">
                  <Flame className="w-3.5 h-3.5" />
                  {w.caloriesBurned} kcal
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Exercise</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Sets × Reps</th>
                  <th className="p-4">Weight ({unitPreference})</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Burned</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredWorkouts.map((w) => (
                  <tr key={w._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 text-slate-400">{w.date}</td>
                    <td className="p-4 font-bold text-white">{w.exerciseName}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-brand-lime text-[10px] font-semibold">
                        {w.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-200">{w.sets} × {w.reps}</td>
                    <td className="p-4 text-slate-200">{w.weightLifted || 0}</td>
                    <td className="p-4 text-slate-200">{w.duration} mins</td>
                    <td className="p-4 font-semibold text-brand-lime">{w.caloriesBurned} kcal</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(w)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(w._id, w.exerciseName)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Workout Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-dark-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">
                {editingWorkout ? 'Edit Workout Record' : 'Log New Workout'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Exercise Name *</label>
                <input
                  type="text"
                  required
                  value={formData.exerciseName}
                  onChange={(e) => setFormData({ ...formData, exerciseName: e.target.value })}
                  placeholder="e.g. Barbell Squats"
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                  >
                    <option value="Strength">Strength</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Flexibility">Flexibility</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Sets</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.sets}
                    onChange={(e) => setFormData({ ...formData, sets: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reps</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.reps}
                    onChange={(e) => setFormData({ ...formData, reps: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Weight ({unitPreference})</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.weightLifted}
                    onChange={(e) => setFormData({ ...formData, weightLifted: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duration (mins)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Est. Calories</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.caloriesBurned}
                    onChange={(e) => setFormData({ ...formData, caloriesBurned: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Session Notes</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Form cues, RPE, rest interval..."
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-brand-lime outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-lime to-emerald-500 text-dark-950 font-bold text-sm shadow-glow-lime hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                {editingWorkout ? 'Update Workout' : 'Save Workout'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

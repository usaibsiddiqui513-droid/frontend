import React, { useState } from 'react';
import { X, Dumbbell, UtensilsCrossed, Flame, Clock, Award, Check } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import confetti from 'canvas-confetti';

export default function QuickLogModal({ isOpen, onClose }) {
  const { addWorkout, addNutrition, unitPreference } = useFitness();
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'nutrition'
  const [successMsg, setSuccessMsg] = useState('');

  // Workout form state
  const [workoutForm, setWorkoutForm] = useState({
    exerciseName: '',
    category: 'Strength',
    sets: 3,
    reps: 10,
    weightLifted: 50,
    duration: 30,
    notes: '',
  });

  // Nutrition form state
  const [nutritionForm, setNutritionForm] = useState({
    foodName: '',
    mealType: 'Lunch',
    quantity: '1 serving',
    calories: 450,
    protein: 35,
    carbs: 45,
    fats: 12,
  });

  if (!isOpen) return null;

  const triggerCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#22c55e', '#a855f7', '#06b6d4']
    });
  };

  const handleWorkoutSubmit = (e) => {
    e.preventDefault();
    if (!workoutForm.exerciseName.trim()) return;

    addWorkout(workoutForm);
    triggerCelebration();
    setSuccessMsg('Workout logged successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
      setWorkoutForm({
        exerciseName: '',
        category: 'Strength',
        sets: 3,
        reps: 10,
        weightLifted: 50,
        duration: 30,
        notes: '',
      });
    }, 900);
  };

  const handleNutritionSubmit = (e) => {
    e.preventDefault();
    if (!nutritionForm.foodName.trim()) return;

    addNutrition(nutritionForm);
    triggerCelebration();
    setSuccessMsg('Nutrition meal logged successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
      setNutritionForm({
        foodName: '',
        mealType: 'Lunch',
        quantity: '1 serving',
        calories: 450,
        protein: 35,
        carbs: 45,
        fats: 12,
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-dark-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow ambient background accents */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-brand-lime/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-brand-purple/15 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">Quick Log</h3>
            <span className="text-[11px] font-semibold text-brand-lime bg-brand-lime/10 px-2.5 py-0.5 rounded-full border border-brand-lime/20">
              Live Activity
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-dark-950 rounded-2xl border border-slate-800/80 my-5">
          <button
            type="button"
            onClick={() => setActiveTab('workout')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
              activeTab === 'workout'
                ? 'bg-gradient-to-r from-brand-lime to-emerald-500 text-dark-950 shadow-glow-lime'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Workout</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('nutrition')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
              activeTab === 'nutrition'
                ? 'bg-gradient-to-r from-brand-purple to-purple-600 text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Nutrition Meal</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-brand-lime/10 border border-brand-lime/30 text-brand-lime text-xs font-semibold flex items-center gap-2 animate-in zoom-in-95">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* WORKOUT FORM */}
        {activeTab === 'workout' && (
          <form onSubmit={handleWorkoutSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Exercise Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Incline Dumbbell Bench Press"
                value={workoutForm.exerciseName}
                onChange={(e) => setWorkoutForm({ ...workoutForm, exerciseName: e.target.value })}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:border-brand-lime focus:ring-1 focus:ring-brand-lime outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                <select
                  value={workoutForm.category}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, category: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                >
                  <option value="Strength">Strength</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Flexibility">Flexibility</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duration (mins)</label>
                <input
                  type="number"
                  min="1"
                  value={workoutForm.duration}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, duration: Number(e.target.value) })}
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
                  value={workoutForm.sets}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, sets: Number(e.target.value) })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reps</label>
                <input
                  type="number"
                  min="1"
                  value={workoutForm.reps}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, reps: Number(e.target.value) })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Weight ({unitPreference})</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={workoutForm.weightLifted}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, weightLifted: Number(e.target.value) })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Notes (Optional)</label>
              <input
                type="text"
                placeholder="RPE 8, felt great depth..."
                value={workoutForm.notes}
                onChange={(e) => setWorkoutForm({ ...workoutForm, notes: e.target.value })}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:border-brand-lime outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-brand-lime to-emerald-500 text-dark-950 font-bold text-sm shadow-glow-lime hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Dumbbell className="w-4 h-4 stroke-[2.5]" />
              <span>Save Workout Record</span>
            </button>
          </form>
        )}

        {/* NUTRITION FORM */}
        {activeTab === 'nutrition' && (
          <form onSubmit={handleNutritionSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Food / Meal Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Grilled Chicken & Sweet Potato"
                value={nutritionForm.foodName}
                onChange={(e) => setNutritionForm({ ...nutritionForm, foodName: e.target.value })}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Meal Type</label>
                <select
                  value={nutritionForm.mealType}
                  onChange={(e) => setNutritionForm({ ...nutritionForm, mealType: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-purple outline-none"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Quantity / Portion</label>
                <input
                  type="text"
                  value={nutritionForm.quantity}
                  onChange={(e) => setNutritionForm({ ...nutritionForm, quantity: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-purple outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Calories</label>
                <input
                  type="number"
                  min="0"
                  value={nutritionForm.calories}
                  onChange={(e) => setNutritionForm({ ...nutritionForm, calories: Number(e.target.value) })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:border-brand-purple outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Protein (g)</label>
                <input
                  type="number"
                  min="0"
                  value={nutritionForm.protein}
                  onChange={(e) => setNutritionForm({ ...nutritionForm, protein: Number(e.target.value) })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:border-brand-purple outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  min="0"
                  value={nutritionForm.carbs}
                  onChange={(e) => setNutritionForm({ ...nutritionForm, carbs: Number(e.target.value) })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:border-brand-purple outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Fats (g)</label>
                <input
                  type="number"
                  min="0"
                  value={nutritionForm.fats}
                  onChange={(e) => setNutritionForm({ ...nutritionForm, fats: Number(e.target.value) })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:border-brand-purple outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-purple-600 text-white font-bold text-sm shadow-glow-purple hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <UtensilsCrossed className="w-4 h-4 stroke-[2.5]" />
              <span>Log Meal Macros</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

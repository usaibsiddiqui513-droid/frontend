import React, { useState, useMemo } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Edit2,
  Flame,
  PieChart as PieIcon,
  Calendar,
  Apple,
  Coffee,
  Sun,
  Moon,
  Cookie,
  X,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function Nutrition() {
  const { nutrition, addNutrition, updateNutrition, deleteNutrition } = useFitness();
  const { user } = useAuth();

  const [selectedMealType, setSelectedMealType] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    foodName: '',
    mealType: 'Breakfast',
    quantity: '1 serving',
    calories: 400,
    protein: 30,
    carbs: 45,
    fats: 12,
    date: new Date().toISOString().split('T')[0]
  });

  const mealTypes = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const mealIcons = {
    Breakfast: Coffee,
    Lunch: Sun,
    Dinner: Moon,
    Snacks: Cookie
  };

  const filteredNutrition = useMemo(() => {
    if (selectedMealType === 'All') return nutrition;
    return nutrition.filter(n => n.mealType === selectedMealType);
  }, [nutrition, selectedMealType]);

  // Aggregate totals
  const totalCalories = useMemo(() => nutrition.reduce((sum, n) => sum + (Number(n.calories) || 0), 0), [nutrition]);
  const totalProtein = useMemo(() => nutrition.reduce((sum, n) => sum + (Number(n.protein) || 0), 0), [nutrition]);
  const totalCarbs = useMemo(() => nutrition.reduce((sum, n) => sum + (Number(n.carbs) || 0), 0), [nutrition]);
  const totalFats = useMemo(() => nutrition.reduce((sum, n) => sum + (Number(n.fats) || 0), 0), [nutrition]);

  const targetCalories = user?.dailyCalorieTarget || 2400;
  const targetProtein = user?.dailyProteinTarget || 160;
  const targetCarbs = user?.dailyCarbsTarget || 260;
  const targetFats = user?.dailyFatsTarget || 65;

  // Macro pie data
  const macroPieData = [
    { name: 'Protein (g)', value: totalProtein || 1, color: '#22c55e' },
    { name: 'Carbs (g)', value: totalCarbs || 1, color: '#8b5cf6' },
    { name: 'Fats (g)', value: totalFats || 1, color: '#06b6d4' }
  ];

  // Daily Meal distribution data for bar chart
  const mealDistributionData = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(type => {
    const items = nutrition.filter(n => n.mealType === type);
    const cals = items.reduce((sum, i) => sum + (Number(i.calories) || 0), 0);
    return { name: type, calories: cals };
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      foodName: '',
      mealType: 'Breakfast',
      quantity: '1 serving',
      calories: 450,
      protein: 35,
      carbs: 45,
      fats: 14,
      date: new Date().toISOString().split('T')[0]
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      foodName: item.foodName,
      mealType: item.mealType,
      quantity: item.quantity,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fats: item.fats,
      date: item.date || new Date().toISOString().split('T')[0]
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.foodName.trim()) return;

    if (editingItem) {
      updateNutrition(editingItem._id, formData);
    } else {
      addNutrition(formData);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    }
    setModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}" from food log?`)) {
      deleteNutrition(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple shadow-glow-purple">
              <UtensilsCrossed className="w-5 h-5" />
            </span>
            <span>Nutrition & Macro Tracker</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Track daily calories, analyze macronutrient split, and fuel peak performance.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-purple to-purple-600 text-white font-bold text-sm shadow-glow-purple hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Log Food Entry</span>
        </button>
      </div>

      {/* Daily Macro Progress Summary Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Daily Calories</span>
            <Flame className="w-4 h-4 text-brand-lime" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{totalCalories}</span>
            <span className="text-xs text-slate-400">Target: {targetCalories} kcal</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-brand-lime h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((totalCalories / targetCalories) * 100))}%` }}
            />
          </div>
          <span className="text-[11px] text-brand-lime font-semibold mt-1.5 block">
            {Math.round((totalCalories / targetCalories) * 100)}% consumed
          </span>
        </div>

        {/* Protein Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Protein</span>
            <span className="w-2.5 h-2.5 rounded-full bg-brand-lime" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{totalProtein}g</span>
            <span className="text-xs text-slate-400">Target: {targetProtein}g</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((totalProtein / targetProtein) * 100))}%` }}
            />
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1.5 block">
            {Math.round((totalProtein / targetProtein) * 100)}% of goal
          </span>
        </div>

        {/* Carbs Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Carbohydrates</span>
            <span className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{totalCarbs}g</span>
            <span className="text-xs text-slate-400">Target: {targetCarbs}g</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-brand-purple h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((totalCarbs / targetCarbs) * 100))}%` }}
            />
          </div>
          <span className="text-[11px] text-brand-purple font-semibold mt-1.5 block">
            {Math.round((totalCarbs / targetCarbs) * 100)}% of goal
          </span>
        </div>

        {/* Fats Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Dietary Fats</span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{totalFats}g</span>
            <span className="text-xs text-slate-400">Target: {targetFats}g</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((totalFats / targetFats) * 100))}%` }}
            />
          </div>
          <span className="text-[11px] text-cyan-400 font-semibold mt-1.5 block">
            {Math.round((totalFats / targetFats) * 100)}% of goal
          </span>
        </div>
      </div>

      {/* Visual Charts: Macro Breakdown Pie & Meal Distribution Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Macronutrient Distribution Pie */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-brand-lime" />
            <span>Macronutrient Ratio Split</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Grams proportion (Protein, Carbs, Fats)</p>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c121e',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Meal Type Calorie Breakdown Bar */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Flame className="w-4 h-4 text-brand-purple" />
            <span>Calorie Intake by Meal</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Energy distribution throughout the day</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mealDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c121e',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  formatter={(val) => [`${val} kcal`, 'Calories']}
                />
                <Bar dataKey="calories" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Meal Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {mealTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedMealType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedMealType === type
                ? 'bg-brand-purple text-white shadow-glow-purple'
                : 'bg-dark-950/80 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {type}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-auto hidden sm:inline">
          {filteredNutrition.length} food items logged
        </span>
      </div>

      {/* Food Entries List */}
      <div className="space-y-3">
        {filteredNutrition.map((item) => {
          const IconComponent = mealIcons[item.mealType] || Apple;
          return (
            <div
              key={item._id}
              className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card-hover group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple flex-shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-brand-purple">
                      {item.mealType}
                    </span>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white mt-1 group-hover:text-brand-purple transition-colors">
                    {item.foodName}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Portion: {item.quantity}</p>
                </div>
              </div>

              {/* Macro pills & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-5">
                <div className="flex items-center gap-2 sm:gap-3 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-dark-950 border border-slate-800 font-bold text-white">
                    {item.calories} <span className="font-normal text-slate-400 text-[10px]">kcal</span>
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-semibold">
                    {item.protein}g P
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-purple-500/10 text-purple-400 font-semibold">
                    {item.carbs}g C
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 font-semibold">
                    {item.fats}g F
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id, item.foodName)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Food Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-dark-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">
                {editingItem ? 'Edit Nutrition Log' : 'Log Food Entry'}
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
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Food / Meal Name *</label>
                <input
                  type="text"
                  required
                  value={formData.foodName}
                  onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
                  placeholder="e.g. Avocado Toast with Poached Eggs"
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-purple outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Meal Type</label>
                  <select
                    value={formData.mealType}
                    onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-purple outline-none"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Portion / Quantity</label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
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
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:border-brand-purple outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:border-brand-purple outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:border-brand-purple outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Fats (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.fats}
                    onChange={(e) => setFormData({ ...formData, fats: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:border-brand-purple outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-brand-purple outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-purple to-purple-600 text-white font-bold text-sm shadow-glow-purple hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                {editingItem ? 'Update Food Entry' : 'Save Food Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

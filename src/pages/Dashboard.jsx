import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Flame,
  Dumbbell,
  Scale,
  UtensilsCrossed,
  TrendingUp,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  CheckCircle2,
  Calendar,
  Zap,
  Activity,
  Award,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';
import QuickLogModal from '../components/QuickLogModal';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    workouts,
    nutrition,
    progress,
    goals,
    stats,
    unitPreference,
    addWorkout,
    addNutrition
  } = useFitness();
  const [quickLogModalOpen, setQuickLogModalOpen] = useState(false);

  // Weekly data for chart
  const weeklyData = [
    { day: 'Mon', caloriesBurned: 420, caloriesConsumed: 2250, workouts: 1 },
    { day: 'Tue', caloriesBurned: 530, caloriesConsumed: 2380, workouts: 2 },
    { day: 'Wed', caloriesBurned: 180, caloriesConsumed: 2100, workouts: 0 },
    { day: 'Thu', caloriesBurned: 450, caloriesConsumed: 2420, workouts: 1 },
    { day: 'Fri', caloriesBurned: 380, caloriesConsumed: 2350, workouts: 1 },
    { day: 'Sat', caloriesBurned: 610, caloriesConsumed: 2600, workouts: 2 },
    { day: 'Sun', caloriesBurned: 290, caloriesConsumed: 2150, workouts: 1 }
  ];

  // Weight progression data from progress records
  const weightProgressData = progress
    .slice()
    .reverse()
    .map(p => ({
      date: p.date.slice(5),
      weight: p.weight,
      bodyFat: p.bodyFat || 14.5
    }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner & Welcome */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-card border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-lime/15 via-brand-purple/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/10 border border-brand-lime/20 text-brand-lime text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>5-Day Training Streak Active</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="gradient-text-lime">{user?.name || 'Athlete'}</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1.5 max-w-xl">
              You've completed <span className="text-white font-semibold">{stats.totalWorkouts} workouts</span> so far.
              Keep the momentum going toward your <span className="text-brand-purple font-semibold">{user?.fitnessGoal || 'Goals'}</span>!
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setQuickLogModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-lime to-emerald-500 text-dark-950 font-bold text-sm shadow-glow-lime hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Log Activity</span>
            </button>

            <NavLink
              to="/reports"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 border border-slate-700/80 text-white font-semibold text-sm hover:border-slate-500 transition-colors"
            >
              <ArrowUpRight className="w-4 h-4 text-brand-lime" />
              <span>Export Report</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* 2. Top Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Workouts */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 glass-card-hover group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Workouts</span>
            <div className="w-10 h-10 rounded-xl bg-brand-lime/10 border border-brand-lime/20 flex items-center justify-center text-brand-lime group-hover:scale-110 transition-transform">
              <Dumbbell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{stats.totalWorkouts}</span>
            <span className="text-xs font-semibold text-brand-lime flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +3 this week
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Target: 5 sessions / week</p>
        </div>

        {/* Calories Burned */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 glass-card-hover group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Calories Burned</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">
              {stats.caloriesBurnedToday > 0 ? stats.caloriesBurnedToday : 530} <span className="text-sm font-normal text-slate-400">kcal</span>
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              Active Today
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Est. daily burn target: 500 kcal</p>
        </div>

        {/* Calories Consumed */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 glass-card-hover-purple group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Calories Consumed</span>
            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">
              {stats.caloriesConsumedToday > 0 ? stats.caloriesConsumedToday : 2350} <span className="text-sm font-normal text-slate-400">kcal</span>
            </span>
            <span className="text-xs font-semibold text-brand-purple">
              {Math.round((2350 / (user?.dailyCalorieTarget || 2400)) * 100)}% of goal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Daily Cap: {user?.dailyCalorieTarget || 2400} kcal</p>
        </div>

        {/* Current Weight */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 glass-card-hover group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Weight</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">
              {stats.currentWeight} <span className="text-sm font-normal text-slate-400">{unitPreference}</span>
            </span>
            <span className="text-xs font-semibold text-brand-lime flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" /> -2.6 {unitPreference}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Target: {user?.targetWeight || 74.0} {unitPreference}</p>
        </div>
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Trends */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-lime" />
                <span>Weekly Activity & Burn</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Calories burned vs consumed daily</p>
            </div>
            <span className="text-xs font-semibold text-brand-lime bg-brand-lime/10 px-3 py-1 rounded-full border border-brand-lime/20">
              This Week
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c121e',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="caloriesBurned" name="Calories Burned" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="caloriesConsumed" name="Calories Consumed" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Progression Chart */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-purple" />
                <span>Body Weight Progression</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Historical tracking over past 5 check-ins</p>
            </div>
            <NavLink
              to="/progress"
              className="text-xs font-semibold text-brand-purple hover:underline flex items-center gap-1"
            >
              <span>View Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c121e',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                  formatter={(val) => [`${val} ${unitPreference}`, 'Weight']}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#a855f7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#weightGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Fitness Goals Overview & Completion */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-lime" />
              <span>Active Fitness Goals</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time target pacing and deadlines</p>
          </div>
          <span className="text-xs text-slate-400">
            {goals.filter(g => g.completed).length} of {goals.length} targets completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {goals.map((g) => {
            const percent = Math.min(100, Math.round((g.current / g.target) * 100));
            return (
              <div
                key={g._id}
                className="p-4 rounded-2xl bg-dark-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-brand-lime uppercase tracking-wider">{g.category}</span>
                  <span className="text-xs font-bold text-white">{percent}%</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100 truncate">{g.title}</h4>
                <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-lime to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Current: <strong className="text-slate-200">{g.current} {g.unit}</strong></span>
                  <span>Target: {g.target} {g.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Recent Workouts & Recent Nutrition 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workouts */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-brand-lime" />
              <span>Recent Workout Activities</span>
            </h3>
            <NavLink
              to="/workouts"
              className="text-xs font-semibold text-brand-lime hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="space-y-3">
            {workouts.slice(0, 4).map((w) => (
              <div
                key={w._id}
                className="p-3.5 rounded-2xl bg-dark-950/60 border border-slate-800/70 flex items-center justify-between hover:border-brand-lime/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-lime/10 border border-brand-lime/20 flex items-center justify-center text-brand-lime">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{w.exerciseName}</h4>
                    <p className="text-xs text-slate-400">
                      {w.sets} sets × {w.reps} reps • {w.weightLifted > 0 ? `${w.weightLifted} ${unitPreference}` : 'Bodyweight'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-brand-lime block">{w.caloriesBurned} kcal</span>
                  <span className="text-[11px] text-slate-400">{w.duration} mins</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Nutrition Entries */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-brand-purple" />
              <span>Recent Nutrition Logs</span>
            </h3>
            <NavLink
              to="/nutrition"
              className="text-xs font-semibold text-brand-purple hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="space-y-3">
            {nutrition.slice(0, 4).map((n) => (
              <div
                key={n._id}
                className="p-3.5 rounded-2xl bg-dark-950/60 border border-slate-800/70 flex items-center justify-between hover:border-brand-purple/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white truncate max-w-[180px] sm:max-w-xs">{n.foodName}</h4>
                    <p className="text-xs text-slate-400">
                      {n.mealType} • {n.protein}g P • {n.carbs}g C • {n.fats}g F
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-white block">{n.calories} kcal</span>
                  <span className="text-[11px] text-slate-400">{n.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickLogModal
        isOpen={quickLogModalOpen}
        onClose={() => setQuickLogModalOpen(false)}
      />
    </div>
  );
}

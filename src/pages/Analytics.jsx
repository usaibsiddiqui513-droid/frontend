import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Dumbbell,
  Flame,
  Calendar,
  Layers,
  Award,
  Zap,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';

export default function Analytics() {
  const { workouts, nutrition, progress, unitPreference } = useFitness();
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('weekly'); // 'weekly' | 'monthly'

  // Weekly Workout Frequency data
  const workoutFrequencyData = [
    { period: 'Week 1', workouts: 4, volumeTons: 14.5, cardioMin: 65 },
    { period: 'Week 2', workouts: 5, volumeTons: 18.2, cardioMin: 90 },
    { period: 'Week 3', workouts: 3, volumeTons: 11.0, cardioMin: 45 },
    { period: 'Week 4', workouts: 5, volumeTons: 19.8, cardioMin: 110 },
    { period: 'Week 5', workouts: 6, volumeTons: 22.4, cardioMin: 125 },
  ];

  // Lifting performance comparison over time
  const liftingTrends = [
    { month: 'Jul', bench: 85, squat: 115, deadlift: 135 },
    { month: 'Aug', bench: 87.5, squat: 120, deadlift: 140 },
    { month: 'Sep', bench: 92.5, squat: 125, deadlift: 145 },
    { month: 'Oct', bench: 95, squat: 130, deadlift: 150 },
    { month: 'Nov', bench: 100, squat: 135, deadlift: 155 },
  ];

  // Calorie & Burn trends
  const calorieTrendData = [
    { day: 'Nov 14', intake: 2300, burned: 450, net: 1850 },
    { day: 'Nov 15', intake: 2450, burned: 510, net: 1940 },
    { day: 'Nov 16', intake: 2200, burned: 350, net: 1850 },
    { day: 'Nov 17', intake: 2550, burned: 620, net: 1930 },
    { day: 'Nov 18', intake: 2380, burned: 480, net: 1900 },
    { day: 'Nov 19', intake: 2420, burned: 540, net: 1880 },
    { day: 'Nov 20', intake: 2350, burned: 530, net: 1820 },
  ];

  // Macronutrient split
  const macroData = [
    { name: 'Protein', grams: 170, color: '#22c55e' },
    { name: 'Carbs', grams: 260, color: '#8b5cf6' },
    { name: 'Fats', grams: 65, color: '#06b6d4' },
  ];

  // Category distribution
  const categorySplit = [
    { name: 'Strength', count: workouts.filter(w => w.category === 'Strength').length || 4, color: '#22c55e' },
    { name: 'Cardio', count: workouts.filter(w => w.category === 'Cardio').length || 2, color: '#06b6d4' },
    { name: 'Flexibility', count: workouts.filter(w => w.category === 'Flexibility').length || 1, color: '#a855f7' },
    { name: 'Other', count: workouts.filter(w => w.category === 'Other').length || 0, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple shadow-glow-purple">
              <BarChart3 className="w-5 h-5" />
            </span>
            <span>Analytics & Performance Insights</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Data-driven evaluation of training volume, progressive overload, and energy balance.
          </p>
        </div>

        {/* Timeframe switch */}
        <div className="flex items-center bg-dark-950 border border-slate-800 p-1.5 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              timeframe === 'weekly'
                ? 'bg-gradient-to-r from-brand-lime to-emerald-500 text-dark-950 shadow-glow-lime'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly Trends
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              timeframe === 'monthly'
                ? 'bg-gradient-to-r from-brand-purple to-purple-600 text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Trends
          </button>
        </div>
      </div>

      {/* Top Analytic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Avg Workout Frequency</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">4.6 <span className="text-sm font-normal text-slate-400">days/wk</span></span>
            <span className="text-xs text-brand-lime font-bold">+12% MoM</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">High consistency score (94%)</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Est. Tonnage Moved</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">18.4 <span className="text-sm font-normal text-slate-400">tons/wk</span></span>
            <span className="text-xs text-brand-purple font-bold">Progressive Overload</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Calculated: sets × reps × load</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Average Net Energy</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">1,880 <span className="text-sm font-normal text-slate-400">kcal</span></span>
            <span className="text-xs text-cyan-400 font-bold">Controlled Deficit</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Intake minus active exercise burn</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total SBD Total</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">390 <span className="text-sm font-normal text-slate-400">{unitPreference}</span></span>
            <span className="text-xs text-amber-400 font-bold">+25 {unitPreference} this quarter</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Squat 135 + Bench 100 + Deadlift 155</p>
        </div>
      </div>

      {/* Main Charts: 1. Lifting Progress Over Time & 2. Workout Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Big 3 Lifting Strength Progress (Squat, Bench, Deadlift) */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-brand-lime" />
                <span>Strength Progression: Big 3 Lifts ({unitPreference})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Estimated 1RM trendline month over month</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={liftingTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c121e',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="deadlift" name={`Deadlift (${unitPreference})`} stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="squat" name={`Squat (${unitPreference})`} stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="bench" name={`Bench Press (${unitPreference})`} stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Workout Frequency & Cardio Minutes */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-purple" />
                <span>Workout Sessions & Cardio Volume</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Sessions logged vs total endurance minutes</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workoutFrequencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" stroke="#8b5cf6" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#22c55e" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c121e',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar yAxisId="left" dataKey="workouts" name="Workouts Logged" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="cardioMin" name="Cardio Minutes" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Row: Daily Calorie Balance Area Chart & Category Split Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Calorie Intake vs Burn Area Chart (2 Cols) */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 lg:col-span-2">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Daily Calorie Intake vs Net Energy</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Tracking energy surplus or deficit day-by-day</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calorieTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="intakeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="burnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c121e',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="intake" name="Calorie Intake (kcal)" stroke="#8b5cf6" strokeWidth={2} fill="url(#intakeGrad)" />
                <Area type="monotone" dataKey="net" name="Net Energy (kcal)" stroke="#22c55e" strokeWidth={2} fill="url(#burnGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workout Category Distribution (1 Col) */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Workout Disciplines</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Category breakdown of your sessions</p>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySplit}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {categorySplit.map((entry, index) => (
                    <Cell key={`cell-cat-${index}`} fill={entry.color} />
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
      </div>
    </div>
  );
}

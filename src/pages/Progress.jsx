import React, { useState } from 'react';
import {
  TrendingUp,
  Scale,
  Plus,
  Trash2,
  Calendar,
  Award,
  ArrowDown,
  ArrowUp,
  Zap,
  Activity,
  Ruler,
  Timer,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function Progress() {
  const { progress, addProgress, deleteProgress, unitPreference } = useFitness();
  const { user } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: 76.5,
    bodyFat: 14.0,
    chest: 104,
    waist: 80.5,
    arms: 39,
    thighs: 59,
    runningTime5k: 23.0,
    deadliftMax: 160,
    benchMax: 102.5,
    squatMax: 137.5,
    notes: 'Morning weigh-in after steady training block.'
  });

  // Calculate comparisons
  const latest = progress[0] || {};
  const earliest = progress[progress.length - 1] || latest;
  const weightChange = latest.weight && earliest.weight ? (latest.weight - earliest.weight).toFixed(1) : 0;
  const targetWeight = user?.targetWeight || 74.0;
  const remainingToGoal = latest.weight ? Math.abs(latest.weight - targetWeight).toFixed(1) : 0;

  // Chart data formatted chronologically
  const chartData = progress
    .slice()
    .reverse()
    .map(p => ({
      date: p.date.slice(5),
      weight: p.weight,
      bodyFat: p.bodyFat,
      waist: p.waist,
      chest: p.chest,
      deadlift: p.deadliftMax,
      running5k: p.runningTime5k
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.weight) return;

    addProgress(formData);
    confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
    setModalOpen(false);
  };

  const handleDelete = (id, date) => {
    if (window.confirm(`Delete measurement entry for ${date}?`)) {
      deleteProgress(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg">
              <TrendingUp className="w-5 h-5" />
            </span>
            <span>Fitness Progress & Body Metrics</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Quantify long-term body transformations, circumferences, and personal records.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Log Measurements</span>
        </button>
      </div>

      {/* Historical Milestones Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Weight */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Latest Weight</span>
            <Scale className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">
              {latest.weight || 77.2} <span className="text-sm font-normal text-slate-400">{unitPreference}</span>
            </span>
            <span className="text-xs text-slate-400">{latest.date || 'Today'}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Body fat: <strong className="text-cyan-400">{latest.bodyFat || 14.2}%</strong>
          </p>
        </div>

        {/* Total Weight Change */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Overall Change</span>
            <Activity className="w-4 h-4 text-brand-lime" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-brand-lime flex items-center">
              {Number(weightChange) < 0 ? (
                <>
                  <ArrowDown className="w-6 h-6 mr-1" />
                  {Math.abs(weightChange)}
                </>
              ) : (
                <>
                  <ArrowUp className="w-6 h-6 mr-1" />
                  {weightChange}
                </>
              )}
              <span className="text-sm font-normal text-slate-400 ml-1">{unitPreference}</span>
            </span>
            <span className="text-xs text-brand-lime font-semibold">Net Progress</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Since baseline ({earliest.date || 'Start'})</p>
        </div>

        {/* Distance to Target Goal */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Distance to Target</span>
            <Award className="w-4 h-4 text-brand-purple" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">
              {remainingToGoal} <span className="text-sm font-normal text-slate-400">{unitPreference}</span>
            </span>
            <span className="text-xs font-semibold text-brand-purple">Target: {targetWeight}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Projected within 4-6 weeks</p>
        </div>

        {/* 5K Time & Deadlift PR */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Peak PRs</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">
              {latest.deadliftMax || 155} <span className="text-xs font-normal text-slate-400">{unitPreference} DL</span>
            </span>
            <span className="text-sm font-bold text-amber-400">
              {latest.runningTime5k || 23.5}m 5k
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Bench: {latest.benchMax || 100} • Squat: {latest.squatMax || 135}</p>
        </div>
      </div>

      {/* Progress Line Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight & Body Fat Line Chart */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>Body Weight ({unitPreference}) vs Body Fat (%)</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Dual metric trendline across logged check-ins</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" stroke="#06b6d4" domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#a855f7" domain={[10, 20]} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c121e',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="weight" name={`Weight (${unitPreference})`} stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="bodyFat" name="Body Fat %" stroke="#a855f7" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strength & Circumferences Progress */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-brand-lime" />
            <span>Waist Circumference (cm) vs Deadlift (kg)</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Body recomposition: decreasing waist & increasing strength</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" stroke="#22c55e" domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c121e',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="waist" name="Waist (cm)" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="deadlift" name="Deadlift (kg)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Progress History Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4">Detailed Check-In Logs</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Weight ({unitPreference})</th>
                <th className="p-3.5">Body Fat</th>
                <th className="p-3.5">Waist</th>
                <th className="p-3.5">Chest</th>
                <th className="p-3.5">Arms</th>
                <th className="p-3.5">Deadlift 1RM</th>
                <th className="p-3.5">5k Time</th>
                <th className="p-3.5">Notes</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {progress.map((p) => (
                <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 font-bold text-white">{p.date}</td>
                  <td className="p-3.5 font-semibold text-cyan-400">{p.weight}</td>
                  <td className="p-3.5 text-slate-300">{p.bodyFat ? `${p.bodyFat}%` : '-'}</td>
                  <td className="p-3.5 text-slate-300">{p.waist ? `${p.waist} cm` : '-'}</td>
                  <td className="p-3.5 text-slate-300">{p.chest ? `${p.chest} cm` : '-'}</td>
                  <td className="p-3.5 text-slate-300">{p.arms ? `${p.arms} cm` : '-'}</td>
                  <td className="p-3.5 font-semibold text-brand-lime">{p.deadliftMax ? `${p.deadliftMax} kg` : '-'}</td>
                  <td className="p-3.5 text-slate-300">{p.runningTime5k ? `${p.runningTime5k} mins` : '-'}</td>
                  <td className="p-3.5 text-slate-400 italic max-w-xs truncate">{p.notes || '-'}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(p._id, p.date)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Measurements Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-dark-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">Log Body Measurements</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Weight ({unitPreference}) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Body Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.bodyFat}
                    onChange={(e) => setFormData({ ...formData, bodyFat: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.waist}
                    onChange={(e) => setFormData({ ...formData, waist: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Chest (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.chest}
                    onChange={(e) => setFormData({ ...formData, chest: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Arms (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.arms}
                    onChange={(e) => setFormData({ ...formData, arms: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Deadlift 1RM ({unitPreference})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.deadliftMax}
                    onChange={(e) => setFormData({ ...formData, deadliftMax: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">5k Time (mins)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.runningTime5k}
                    onChange={(e) => setFormData({ ...formData, runningTime5k: Number(e.target.value) })}
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Progress Notes</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Sleep quality, caloric deficit feeling, water retention..."
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Save Measurements
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

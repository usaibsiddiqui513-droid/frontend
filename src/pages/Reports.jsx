import React, { useState } from 'react';
import {
  FileDown,
  FileSpreadsheet,
  FileText,
  Calendar,
  CheckCircle2,
  Dumbbell,
  UtensilsCrossed,
  Scale,
  Activity,
  Download,
  Printer
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import confetti from 'canvas-confetti';

export default function Reports() {
  const { workouts, nutrition, progress, stats, unitPreference } = useFitness();
  const { user } = useAuth();

  const [dateRange, setDateRange] = useState('all'); // 'all' | '30days' | '90days'
  const [downloadSuccess, setDownloadSuccess] = useState('');

  const handleExportPDF = () => {
    exportToPDF({
      user,
      workouts,
      nutrition,
      progress,
      stats
    });
    confetti({ particleCount: 30, spread: 50 });
    setDownloadSuccess('PDF Fitness Report generated successfully!');
    setTimeout(() => setDownloadSuccess(''), 3000);
  };

  const handleExportWorkoutsCSV = () => {
    exportToCSV(workouts, `PulseFit_Workouts_${new Date().toISOString().split('T')[0]}.csv`);
    setDownloadSuccess('Workouts CSV exported!');
    setTimeout(() => setDownloadSuccess(''), 3000);
  };

  const handleExportNutritionCSV = () => {
    exportToCSV(nutrition, `PulseFit_Nutrition_${new Date().toISOString().split('T')[0]}.csv`);
    setDownloadSuccess('Nutrition CSV exported!');
    setTimeout(() => setDownloadSuccess(''), 3000);
  };

  const handleExportProgressCSV = () => {
    exportToCSV(progress, `PulseFit_Progress_${new Date().toISOString().split('T')[0]}.csv`);
    setDownloadSuccess('Progress CSV exported!');
    setTimeout(() => setDownloadSuccess(''), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center text-brand-lime shadow-glow-lime">
              <FileDown className="w-5 h-5" />
            </span>
            <span>Reports & Data Export</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Generate audit-grade PDF fitness summaries and raw CSV datasets for personal backups or coaches.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-2 bg-dark-950 border border-slate-800 p-1.5 rounded-2xl">
          <Calendar className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent text-xs text-white outline-none cursor-pointer pr-3"
          >
            <option value="all">All-Time History</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-2xl bg-brand-lime/10 border border-brand-lime/30 text-brand-lime text-xs font-semibold flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Primary Action Hero Card: PDF Generator */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-brand-lime/10 via-brand-purple/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/10 border border-brand-lime/20 text-brand-lime text-xs font-semibold mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>Full Executive Summary Document</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Instant PDF Athlete Performance Report
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Includes comprehensive client profile, total session volume, top PRs, macro distribution tables, and body recomposition trajectory with branding.
            </p>
          </div>

          <button
            onClick={handleExportPDF}
            className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-brand-lime to-emerald-500 text-dark-950 font-extrabold text-sm shadow-glow-lime hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <span>Generate & Download PDF</span>
          </button>
        </div>
      </div>

      {/* CSV Datasets Grid */}
      <div>
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-brand-purple" />
          <span>Raw Spreadsheet CSV Downloads</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Workouts CSV */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between glass-card-hover group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-lime/10 border border-brand-lime/20 flex items-center justify-center text-brand-lime mb-4 group-hover:scale-110 transition-transform">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Workouts Dataset</h4>
              <p className="text-xs text-slate-400 mt-1.5">
                Every exercise name, sets, reps, weight, calories, duration, and notes.
              </p>
              <span className="text-[11px] text-slate-500 mt-3 block">
                {workouts.length} total records available
              </span>
            </div>

            <button
              onClick={handleExportWorkoutsCSV}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-brand-lime text-slate-200 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-brand-lime" />
              <span>Export Workouts .CSV</span>
            </button>
          </div>

          {/* Nutrition CSV */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between glass-card-hover group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple mb-4 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Nutrition Dataset</h4>
              <p className="text-xs text-slate-400 mt-1.5">
                Detailed calorie logs with protein, carbs, fats breakdown and meal categories.
              </p>
              <span className="text-[11px] text-slate-500 mt-3 block">
                {nutrition.length} total records available
              </span>
            </div>

            <button
              onClick={handleExportNutritionCSV}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-brand-purple text-slate-200 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-brand-purple" />
              <span>Export Nutrition .CSV</span>
            </button>
          </div>

          {/* Progress CSV */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between glass-card-hover group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Progress & Biometrics</h4>
              <p className="text-xs text-slate-400 mt-1.5">
                Body weight readings, body fat percentage, measurements, and maximum PR records.
              </p>
              <span className="text-[11px] text-slate-500 mt-3 block">
                {progress.length} total check-in records
              </span>
            </div>

            <button
              onClick={handleExportProgressCSV}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Progress .CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Report Preview Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-2">Live Report Preview Matrix</h3>
        <p className="text-xs text-slate-400 mb-4">Sample of data compiled into your fitness export</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-dark-950 border border-slate-800 mb-4 text-center">
          <div>
            <span className="text-[11px] text-slate-400 uppercase">Workouts Logged</span>
            <span className="text-xl font-extrabold text-white block mt-1">{workouts.length}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase">Total Calories Burned</span>
            <span className="text-xl font-extrabold text-brand-lime block mt-1">
              {workouts.reduce((s, w) => s + (Number(w.caloriesBurned) || 0), 0)} kcal
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase">Logged Nutrition</span>
            <span className="text-xl font-extrabold text-brand-purple block mt-1">{nutrition.length} meals</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase">Recorded Weight</span>
            <span className="text-xl font-extrabold text-cyan-400 block mt-1">{stats.currentWeight} {unitPreference}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

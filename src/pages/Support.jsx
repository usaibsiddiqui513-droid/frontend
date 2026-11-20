import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Bug,
  Send,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  LifeBuoy,
  Mail
} from 'lucide-react';
import { INITIAL_FAQS } from '../utils/mockData';
import { supportAPI } from '../services/api';

export default function Support() {
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' | 'bug' | 'faq'
  const [searchFaq, setSearchFaq] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // Support Form state
  const [contactForm, setContactForm] = useState({
    name: 'Alex Rivera',
    email: 'alex.rivera@pulsefit.io',
    category: 'General Inquiry',
    subject: '',
    message: ''
  });

  // Bug Report Form state
  const [bugForm, setBugForm] = useState({
    title: '',
    device: 'Desktop Chrome / Windows 11',
    severity: 'Medium',
    steps: '',
    expected: ''
  });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.subject.trim() || !contactForm.message.trim()) return;

    try {
      await supportAPI.submitFeedback({ type: 'contact', ...contactForm });
    } catch (err) {}

    setSuccessMessage('Thank you! Your ticket has been submitted. Support will reply within 24 hours.');
    setContactForm({
      name: 'Alex Rivera',
      email: 'alex.rivera@pulsefit.io',
      category: 'General Inquiry',
      subject: '',
      message: ''
    });
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleBugSubmit = async (e) => {
    e.preventDefault();
    if (!bugForm.title.trim() || !bugForm.steps.trim()) return;

    try {
      await supportAPI.submitFeedback({ type: 'bug', ...bugForm });
    } catch (err) {}

    setSuccessMessage('Bug report filed! Our engineering team will investigate immediately.');
    setBugForm({
      title: '',
      device: 'Desktop Chrome / Windows 11',
      severity: 'Medium',
      steps: '',
      expected: ''
    });
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const filteredFaqs = INITIAL_FAQS.filter(
    f => f.q.toLowerCase().includes(searchFaq.toLowerCase()) || f.a.toLowerCase().includes(searchFaq.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple shadow-glow-purple">
            <LifeBuoy className="w-5 h-5" />
          </span>
          <span>Help Center & Support</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Explore frequently asked questions, get in touch with our team, or report issues.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-brand-lime/10 border border-brand-lime/30 text-brand-lime text-xs font-semibold flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
            activeTab === 'contact'
              ? 'bg-slate-800 text-brand-lime border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Contact Support</span>
        </button>

        <button
          onClick={() => setActiveTab('bug')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
            activeTab === 'bug'
              ? 'bg-slate-800 text-rose-400 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bug className="w-4 h-4" />
          <span>Report an Issue</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
            activeTab === 'faq'
              ? 'bg-slate-800 text-brand-purple border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
        </button>
      </div>

      {/* 1. Contact Support Form */}
      {activeTab === 'contact' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 max-w-2xl">
          <h3 className="text-lg font-bold text-white mb-2">Send Us a Direct Message</h3>
          <p className="text-xs text-slate-400 mb-6">
            Have questions about calorie equations, export formats, or subscription features?
          </p>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Inquiry Category</label>
              <select
                value={contactForm.category}
                onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Workout / Training Assistance">Workout / Training Assistance</option>
                <option value="Nutrition Calculations">Nutrition Calculations</option>
                <option value="Feature Request">Feature Request</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject *</label>
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="e.g. Question regarding custom macro ratios"
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Message / Details *</label>
              <textarea
                rows="4"
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Explain how we can help you in detail..."
                className="w-full bg-dark-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-brand-lime outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-brand-lime to-emerald-500 text-dark-950 font-bold text-sm shadow-glow-lime hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Ticket</span>
            </button>
          </form>
        </div>
      )}

      {/* 2. Bug Report Form */}
      {activeTab === 'bug' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 max-w-2xl">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Bug className="w-5 h-5 text-rose-400" />
            <span>Report a Technical Bug</span>
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Found an issue with charts or exports? Submit details so our dev team can patch it immediately.
          </p>

          <form onSubmit={handleBugSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bug Title *</label>
              <input
                type="text"
                required
                value={bugForm.title}
                onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })}
                placeholder="e.g. Chart tooltip not rendering on mobile viewport"
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-rose-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Severity Level</label>
                <select
                  value={bugForm.severity}
                  onChange={(e) => setBugForm({ ...bugForm, severity: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-rose-400 outline-none"
                >
                  <option value="Low">Low (Visual glitch)</option>
                  <option value="Medium">Medium (Feature behavior issue)</option>
                  <option value="Critical">Critical (Blocked workflow)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Operating System & Browser</label>
                <input
                  type="text"
                  value={bugForm.device}
                  onChange={(e) => setBugForm({ ...bugForm, device: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-rose-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Steps to Reproduce *</label>
              <textarea
                rows="3"
                required
                value={bugForm.steps}
                onChange={(e) => setBugForm({ ...bugForm, steps: e.target.value })}
                placeholder="1. Go to Nutrition page... 2. Click Add Meal... 3. Observed error..."
                className="w-full bg-dark-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-rose-400 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-sm shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Bug className="w-4 h-4" />
              <span>Submit Bug Report</span>
            </button>
          </form>
        </div>
      )}

      {/* 3. Searchable FAQ Accordion */}
      {activeTab === 'faq' && (
        <div className="space-y-4 max-w-3xl">
          {/* FAQ Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search answers (e.g. calculations, units, PDF export)..."
              value={searchFaq}
              onChange={(e) => setSearchFaq(e.target.value)}
              className="w-full bg-dark-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:border-brand-purple outline-none"
            />
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-brand-purple transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-brand-purple flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 border-t border-slate-800/60 leading-relaxed bg-dark-950/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

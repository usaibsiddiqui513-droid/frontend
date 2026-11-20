import React, { useState } from 'react';
import {
  Users2,
  MessageSquare,
  Heart,
  Plus,
  Send,
  UserPlus,
  UserCheck,
  Tag,
  Clock,
  Sparkles,
  Share2,
  X
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function Community() {
  const {
    communityUsers,
    forumPosts,
    toggleFollowUser,
    addForumPost,
    likeForumPost,
    addForumResponse
  } = useFitness();
  const { user } = useAuth();

  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    tagsString: 'Fitness, Training, Motivation'
  });

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) return;

    const tags = postForm.tagsString
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addForumPost({
      title: postForm.title,
      content: postForm.content,
      tags: tags.length ? tags : ['General']
    });

    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    setCreatePostOpen(false);
    setPostForm({ title: '', content: '', tagsString: 'Fitness, Training, Motivation' });
  };

  const handleSendReply = (postId) => {
    if (!replyText.trim()) return;
    addForumResponse(postId, replyText);
    setReplyText('');
    setActiveReplyId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center text-brand-lime shadow-glow-lime">
              <Users2 className="w-5 h-5" />
            </span>
            <span>Fitness Community & Athlete Feed</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Connect with certified coaches, share personal milestones, and exchange recovery protocols.
          </p>
        </div>

        <button
          onClick={() => setCreatePostOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-lime to-emerald-500 text-dark-950 font-bold text-sm shadow-glow-lime hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Discussion Post</span>
        </button>
      </div>

      {/* 1. Athlete Discovery Shelf */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-lime" />
            <span>Discover Athletes & Coaches</span>
          </h3>
          <span className="text-xs text-slate-400">Featured Members</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {communityUsers.map((athlete) => (
            <div
              key={athlete._id}
              className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between glass-card-hover group"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={athlete.avatar}
                    alt={athlete.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-700 group-hover:ring-brand-lime/50 transition-all"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate">{athlete.name}</h4>
                    <span className="text-[11px] text-brand-purple font-semibold truncate block">
                      {athlete.role}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 italic mb-4">
                  "{athlete.bio}"
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 py-2 border-y border-slate-800/80 mb-4">
                  <span><strong>{athlete.workoutsCount}</strong> Workouts</span>
                  <span><strong>{athlete.followersCount}</strong> Followers</span>
                </div>
              </div>

              <button
                onClick={() => toggleFollowUser(athlete._id)}
                className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  athlete.isFollowing
                    ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                    : 'bg-brand-lime/15 text-brand-lime border border-brand-lime/30 hover:bg-brand-lime hover:text-dark-950 shadow-sm'
                }`}
              >
                {athlete.isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Community Forum Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-purple" />
            <span>Community Discussions</span>
          </h3>
          <span className="text-xs text-slate-400">{forumPosts.length} discussions</span>
        </div>

        <div className="space-y-5">
          {forumPosts.map((post) => (
            <div
              key={post._id}
              className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4"
            >
              {/* Post Author Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                    alt="Author"
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-brand-purple/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{post.author?.name}</h4>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.createdAt}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {post.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">{post.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Like & Reply Interaction Bar */}
              <div className="flex items-center gap-4 pt-3 border-t border-slate-800/80 text-xs">
                <button
                  onClick={() => likeForumPost(post._id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors font-semibold ${
                    post.userLiked
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-rose-400' : ''}`} />
                  <span>{post.likes} Likes</span>
                </button>

                <button
                  onClick={() => setActiveReplyId(activeReplyId === post._id ? null : post._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors font-semibold"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.responses?.length || 0} Responses</span>
                </button>
              </div>

              {/* Responses List */}
              {post.responses && post.responses.length > 0 && (
                <div className="space-y-2.5 pt-2 pl-4 sm:pl-8 border-l-2 border-slate-800">
                  {post.responses.map((resp) => (
                    <div key={resp._id} className="p-3 rounded-2xl bg-dark-950/70 border border-slate-800/70">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={resp.author?.avatar}
                            alt="Avatar"
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-slate-200">{resp.author?.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{resp.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-300">{resp.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline Reply Form */}
              {activeReplyId === post._id && (
                <div className="flex items-center gap-2 pt-2 animate-in fade-in">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a supportive reply or answer..."
                    className="flex-1 bg-dark-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:border-brand-purple outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply(post._id)}
                  />
                  <button
                    onClick={() => handleSendReply(post._id)}
                    className="p-2.5 rounded-xl bg-brand-purple text-white hover:bg-purple-600 transition-colors shadow-glow-purple"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create Discussion Post Modal */}
      {createPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-dark-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">Create Community Post</h3>
              <button
                onClick={() => setCreatePostOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Discussion Title *</label>
                <input
                  type="text"
                  required
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  placeholder="e.g. Best warm-up protocol before heavy deadlifts?"
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-lime outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Content & Details *</label>
                <textarea
                  rows="4"
                  required
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                  placeholder="Share your experience, workout splits, questions, or recovery routines..."
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-brand-lime outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={postForm.tagsString}
                  onChange={(e) => setPostForm({ ...postForm, tagsString: e.target.value })}
                  placeholder="Powerlifting, Hypertrophy, Recovery"
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:border-brand-lime outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-lime to-emerald-500 text-dark-950 font-bold text-sm shadow-glow-lime hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Publish Discussion
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

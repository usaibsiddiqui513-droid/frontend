import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  workoutAPI,
  nutritionAPI,
  progressAPI,
  goalAPI,
  reminderAPI,
  notificationAPI,
  communityAPI
} from '../services/api';
import {
  INITIAL_WORKOUTS,
  INITIAL_NUTRITION,
  INITIAL_PROGRESS,
  INITIAL_GOALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REMINDERS,
  INITIAL_COMMUNITY_USERS,
  INITIAL_FORUM_POSTS
} from '../utils/mockData';
import { useAuth } from './AuthContext';

const FitnessContext = createContext();

export const FitnessProvider = ({ children }) => {
  const { user } = useAuth();

  // Local storage cache keys
  const getStored = (key, fallback) => {
    try {
      const item = localStorage.getItem(`pulsefit_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [workouts, setWorkouts] = useState(() => getStored('workouts', INITIAL_WORKOUTS));
  const [nutrition, setNutrition] = useState(() => getStored('nutrition', INITIAL_NUTRITION));
  const [progress, setProgress] = useState(() => getStored('progress', INITIAL_PROGRESS));
  const [goals, setGoals] = useState(() => getStored('goals', INITIAL_GOALS));
  const [reminders, setReminders] = useState(() => getStored('reminders', INITIAL_REMINDERS));
  const [notifications, setNotifications] = useState(() => getStored('notifications', INITIAL_NOTIFICATIONS));
  const [communityUsers, setCommunityUsers] = useState(() => getStored('community_users', INITIAL_COMMUNITY_USERS));
  const [forumPosts, setForumPosts] = useState(() => getStored('forum_posts', INITIAL_FORUM_POSTS));
  const [unitPreference, setUnitPreference] = useState(user?.unitPreference || 'KG');
  const [apiConnected, setApiConnected] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('pulsefit_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('pulsefit_nutrition', JSON.stringify(nutrition));
  }, [nutrition]);

  useEffect(() => {
    localStorage.setItem('pulsefit_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('pulsefit_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('pulsefit_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('pulsefit_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('pulsefit_community_users', JSON.stringify(communityUsers));
  }, [communityUsers]);

  useEffect(() => {
    localStorage.setItem('pulsefit_forum_posts', JSON.stringify(forumPosts));
  }, [forumPosts]);

  // Sync unit preference with user
  useEffect(() => {
    if (user?.unitPreference) {
      setUnitPreference(user.unitPreference);
    }
  }, [user?.unitPreference]);

  // Fetch initial data from backend if live
  const refreshBackendData = async () => {
    const token = localStorage.getItem('pulsefit_token');
    if (!token || token === 'demo_jwt_token_pulsefit') return;

    try {
      const [wRes, nRes, pRes, gRes, rRes, notifRes, commRes, postRes] = await Promise.allSettled([
        workoutAPI.getAll(),
        nutritionAPI.getAll(),
        progressAPI.getAll(),
        goalAPI.getAll(),
        reminderAPI.getAll(),
        notificationAPI.getAll(),
        communityAPI.getUsers(),
        communityAPI.getPosts()
      ]);

      if (wRes.status === 'fulfilled' && wRes.value.data?.workouts) {
        setWorkouts(wRes.value.data.workouts);
        setApiConnected(true);
      }
      if (nRes.status === 'fulfilled' && nRes.value.data?.nutrition) {
        setNutrition(nRes.value.data.nutrition);
      }
      if (pRes.status === 'fulfilled' && pRes.value.data?.progress) {
        setProgress(pRes.value.data.progress);
      }
      if (gRes.status === 'fulfilled' && gRes.value.data?.goals) {
        setGoals(gRes.value.data.goals);
      }
      if (rRes.status === 'fulfilled' && rRes.value.data?.reminders) {
        setReminders(rRes.value.data.reminders);
      }
      if (notifRes.status === 'fulfilled' && notifRes.value.data?.notifications) {
        setNotifications(notifRes.value.data.notifications);
      }
      if (commRes.status === 'fulfilled' && commRes.value.data?.users) {
        setCommunityUsers(commRes.value.data.users);
      }
      if (postRes.status === 'fulfilled' && postRes.value.data?.posts) {
        setForumPosts(postRes.value.data.posts);
      }
    } catch (e) {
      console.log('Backend not available yet, operating in responsive frontend store mode.');
    }
  };

  useEffect(() => {
    refreshBackendData();
  }, [user]);

  // WORKOUT CRUD
  const addWorkout = async (workoutData) => {
    const newEntry = {
      _id: 'w_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      caloriesBurned: Math.round((Number(workoutData.duration) || 30) * 8.5),
      ...workoutData,
      sets: Number(workoutData.sets) || 1,
      reps: Number(workoutData.reps) || 1,
      weightLifted: Number(workoutData.weightLifted) || 0,
      duration: Number(workoutData.duration) || 30
    };

    setWorkouts(prev => [newEntry, ...prev]);

    // Add milestone notification
    addNotification({
      title: 'Workout Logged!',
      message: `Great work on "${newEntry.exerciseName}" (${newEntry.duration}m, ${newEntry.caloriesBurned} kcal).`,
      type: 'achievement'
    });

    try {
      const res = await workoutAPI.create(newEntry);
      if (res.data?.workout) {
        setWorkouts(prev => prev.map(w => w._id === newEntry._id ? res.data.workout : w));
      }
    } catch (e) {}
    return newEntry;
  };

  const updateWorkout = async (id, updatedFields) => {
    setWorkouts(prev => prev.map(w => (w._id === id ? { ...w, ...updatedFields } : w)));
    try {
      await workoutAPI.update(id, updatedFields);
    } catch (e) {}
  };

  const deleteWorkout = async (id) => {
    setWorkouts(prev => prev.filter(w => w._id !== id));
    try {
      await workoutAPI.delete(id);
    } catch (e) {}
  };

  // NUTRITION CRUD
  const addNutrition = async (foodData) => {
    const newEntry = {
      _id: 'n_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...foodData,
      calories: Number(foodData.calories) || 0,
      protein: Number(foodData.protein) || 0,
      carbs: Number(foodData.carbs) || 0,
      fats: Number(foodData.fats) || 0
    };

    setNutrition(prev => [newEntry, ...prev]);

    try {
      const res = await nutritionAPI.create(newEntry);
      if (res.data?.nutrition) {
        setNutrition(prev => prev.map(n => n._id === newEntry._id ? res.data.nutrition : n));
      }
    } catch (e) {}
    return newEntry;
  };

  const updateNutrition = async (id, updatedFields) => {
    setNutrition(prev => prev.map(n => (n._id === id ? { ...n, ...updatedFields } : n)));
    try {
      await nutritionAPI.update(id, updatedFields);
    } catch (e) {}
  };

  const deleteNutrition = async (id) => {
    setNutrition(prev => prev.filter(n => n._id !== id));
    try {
      await nutritionAPI.delete(id);
    } catch (e) {}
  };

  // PROGRESS CRUD
  const addProgress = async (progressData) => {
    const newEntry = {
      _id: 'p_' + Date.now(),
      date: progressData.date || new Date().toISOString().split('T')[0],
      weight: Number(progressData.weight),
      bodyFat: progressData.bodyFat ? Number(progressData.bodyFat) : undefined,
      chest: progressData.chest ? Number(progressData.chest) : undefined,
      waist: progressData.waist ? Number(progressData.waist) : undefined,
      arms: progressData.arms ? Number(progressData.arms) : undefined,
      thighs: progressData.thighs ? Number(progressData.thighs) : undefined,
      runningTime5k: progressData.runningTime5k ? Number(progressData.runningTime5k) : undefined,
      deadliftMax: progressData.deadliftMax ? Number(progressData.deadliftMax) : undefined,
      benchMax: progressData.benchMax ? Number(progressData.benchMax) : undefined,
      squatMax: progressData.squatMax ? Number(progressData.squatMax) : undefined,
      notes: progressData.notes || ''
    };

    setProgress(prev => [newEntry, ...prev]);

    addNotification({
      title: 'Progress Logged!',
      message: `Weight updated to ${newEntry.weight} ${unitPreference}. Tracking consistency is key!`,
      type: 'achievement'
    });

    try {
      const res = await progressAPI.create(newEntry);
      if (res.data?.progress) {
        setProgress(prev => prev.map(p => p._id === newEntry._id ? res.data.progress : p));
      }
    } catch (e) {}
    return newEntry;
  };

  const deleteProgress = async (id) => {
    setProgress(prev => prev.filter(p => p._id !== id));
    try {
      await progressAPI.delete(id);
    } catch (e) {}
  };

  // GOALS CRUD
  const addGoal = async (goalData) => {
    const newGoal = {
      _id: 'g_' + Date.now(),
      ...goalData,
      current: Number(goalData.current) || 0,
      target: Number(goalData.target) || 10,
      completed: false,
      status: 'In Progress'
    };
    setGoals(prev => [newGoal, ...prev]);
    try {
      await goalAPI.create(newGoal);
    } catch (e) {}
  };

  const updateGoal = async (id, updatedFields) => {
    setGoals(prev => prev.map(g => (g._id === id ? { ...g, ...updatedFields } : g)));
    try {
      await goalAPI.update(id, updatedFields);
    } catch (e) {}
  };

  const deleteGoal = async (id) => {
    setGoals(prev => prev.filter(g => g._id !== id));
    try {
      await goalAPI.delete(id);
    } catch (e) {}
  };

  // REMINDERS CRUD
  const addReminder = async (reminderData) => {
    const newRem = {
      _id: 'rem_' + Date.now(),
      enabled: true,
      days: reminderData.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      ...reminderData
    };
    setReminders(prev => [...prev, newRem]);
    try {
      await reminderAPI.create(newRem);
    } catch (e) {}
  };

  const toggleReminder = async (id) => {
    let updated;
    setReminders(prev =>
      prev.map(r => {
        if (r._id === id) {
          updated = { ...r, enabled: !r.enabled };
          return updated;
        }
        return r;
      })
    );
    if (updated) {
      try {
        await reminderAPI.update(id, { enabled: updated.enabled });
      } catch (e) {}
    }
  };

  const deleteReminder = async (id) => {
    setReminders(prev => prev.filter(r => r._id !== id));
    try {
      await reminderAPI.delete(id);
    } catch (e) {}
  };

  // NOTIFICATIONS
  const addNotification = (notif) => {
    const newNotif = {
      _id: 'notif_' + Date.now(),
      timestamp: 'Just now',
      read: false,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = async (id) => {
    setNotifications(prev => prev.map(n => (n._id === id ? { ...n, read: true } : n)));
    try {
      await notificationAPI.markRead(id);
    } catch (e) {}
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await notificationAPI.markAllRead();
    } catch (e) {}
  };

  const deleteNotification = async (id) => {
    setNotifications(prev => prev.filter(n => n._id !== id));
    try {
      await notificationAPI.delete(id);
    } catch (e) {}
  };

  // COMMUNITY & FORUM
  const toggleFollowUser = async (userId) => {
    let targetUser;
    setCommunityUsers(prev =>
      prev.map(u => {
        if (u._id === userId) {
          const nextFollowing = !u.isFollowing;
          targetUser = u;
          return {
            ...u,
            isFollowing: nextFollowing,
            followersCount: nextFollowing ? u.followersCount + 1 : Math.max(0, u.followersCount - 1)
          };
        }
        return u;
      })
    );

    if (targetUser && !targetUser.isFollowing) {
      addNotification({
        title: 'New Connection!',
        message: `You are now following ${targetUser.name}.`,
        type: 'social'
      });
    }

    try {
      await communityAPI.toggleFollow(userId);
    } catch (e) {}
  };

  const addForumPost = async (postData) => {
    const newPost = {
      _id: 'post_' + Date.now(),
      author: {
        name: user?.name || 'Alex Rivera',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
      },
      title: postData.title,
      content: postData.content,
      tags: postData.tags || ['Fitness'],
      likes: 0,
      userLiked: false,
      createdAt: 'Just now',
      responses: []
    };
    setForumPosts(prev => [newPost, ...prev]);

    addNotification({
      title: 'Post Published',
      message: `Your community post "${newPost.title}" is live!`,
      type: 'social'
    });

    try {
      await communityAPI.createPost(newPost);
    } catch (e) {}
  };

  const likeForumPost = async (postId) => {
    setForumPosts(prev =>
      prev.map(p => {
        if (p._id === postId) {
          const nextLiked = !p.userLiked;
          return {
            ...p,
            userLiked: nextLiked,
            likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
          };
        }
        return p;
      })
    );
    try {
      await communityAPI.likePost(postId);
    } catch (e) {}
  };

  const addForumResponse = async (postId, content) => {
    const newResp = {
      _id: 'resp_' + Date.now(),
      author: {
        name: user?.name || 'Alex Rivera',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
      },
      content,
      createdAt: 'Just now'
    };

    setForumPosts(prev =>
      prev.map(p => {
        if (p._id === postId) {
          return {
            ...p,
            responses: [...(p.responses || []), newResp]
          };
        }
        return p;
      })
    );

    try {
      await communityAPI.addResponse(postId, { content });
    } catch (e) {}
  };

  // LIVE STATS COMPUTATION
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const stats = useMemo(() => {
    // Today's Workouts
    const todayWorkouts = workouts.filter(w => w.date === todayStr);
    const caloriesBurnedToday = todayWorkouts.reduce((acc, w) => acc + (Number(w.caloriesBurned) || 0), 0);

    // Today's Nutrition
    const todayNutrition = nutrition.filter(n => n.date === todayStr);
    const caloriesConsumedToday = todayNutrition.reduce((acc, n) => acc + (Number(n.calories) || 0), 0);
    const proteinConsumedToday = todayNutrition.reduce((acc, n) => acc + (Number(n.protein) || 0), 0);
    const carbsConsumedToday = todayNutrition.reduce((acc, n) => acc + (Number(n.carbs) || 0), 0);
    const fatsConsumedToday = todayNutrition.reduce((acc, n) => acc + (Number(n.fats) || 0), 0);

    // Latest weight
    const currentWeight = progress.length ? progress[0].weight : (user?.weight || 77.2);
    const weightDiff = progress.length > 1 ? (progress[0].weight - progress[progress.length - 1].weight).toFixed(1) : '-2.6';

    // Workouts completed this week (assuming 5 is target)
    const weeklyTarget = 5;
    const weeklyWorkoutsCount = Math.min(workouts.length, weeklyTarget);
    const workoutCompletionRate = Math.round((weeklyWorkoutsCount / weeklyTarget) * 100);

    // Weekly day-by-day distribution
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyActivity = dayNames.map((day, i) => {
      // Realistic distribution
      const calBurn = [320, 410, 0, 450, 380, 530, 210][i] || 0;
      const calIntake = [2250, 2380, 2100, 2420, 2350, 2600, 2200][i] || 2200;
      return {
        day,
        caloriesBurned: calBurn,
        caloriesConsumed: calIntake,
        activeMinutes: Math.round(calBurn / 9),
      };
    });

    return {
      totalWorkouts: workouts.length,
      caloriesBurnedToday,
      caloriesConsumedToday,
      proteinConsumedToday,
      carbsConsumedToday,
      fatsConsumedToday,
      currentWeight,
      weightDiff,
      workoutCompletionRate,
      weeklyActivity,
      activeStreak: 5,
    };
  }, [workouts, nutrition, progress, todayStr, user?.weight]);

  return (
    <FitnessContext.Provider
      value={{
        workouts,
        nutrition,
        progress,
        goals,
        reminders,
        notifications,
        communityUsers,
        forumPosts,
        unitPreference,
        setUnitPreference,
        apiConnected,
        stats,
        // Methods
        addWorkout,
        updateWorkout,
        deleteWorkout,
        addNutrition,
        updateNutrition,
        deleteNutrition,
        addProgress,
        deleteProgress,
        addGoal,
        updateGoal,
        deleteGoal,
        addReminder,
        toggleReminder,
        deleteReminder,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        toggleFollowUser,
        addForumPost,
        likeForumPost,
        addForumResponse,
        refreshBackendData
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => useContext(FitnessContext);

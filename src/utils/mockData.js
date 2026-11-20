// PulseFit Realistic Initial & Seed Data

export const INITIAL_USER = {
  _id: 'usr_demo_101',
  name: 'Alex Rivera',
  email: 'alex.rivera@pulsefit.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  bio: 'Fitness enthusiast & marathon trainee. Aiming for 12% body fat and sub-20 min 5k.',
  unitPreference: 'KG', // 'KG' or 'LBS'
  weight: 77.5,
  targetWeight: 74.0,
  height: 180,
  activityLevel: 'Very Active',
  fitnessGoal: 'Muscle Gain & Endurance',
  dailyCalorieTarget: 2400,
  dailyProteinTarget: 160,
  dailyCarbsTarget: 260,
  dailyFatsTarget: 65,
  joinedAt: '2026-01-15'
};

export const INITIAL_WORKOUTS = [
  {
    _id: 'w_01',
    exerciseName: 'Barbell Bench Press',
    category: 'Strength',
    sets: 4,
    reps: 8,
    weightLifted: 92.5,
    duration: 45,
    caloriesBurned: 320,
    date: '2026-11-20',
    notes: 'Hit a smooth PR on 3rd set. Form felt very stable.',
    intensity: 'High'
  },
  {
    _id: 'w_02',
    exerciseName: 'Incline Dumbbell Press',
    category: 'Strength',
    sets: 3,
    reps: 10,
    weightLifted: 32,
    duration: 30,
    caloriesBurned: 210,
    date: '2026-11-20',
    notes: 'Focused on 3-second eccentric contraction.',
    intensity: 'Medium'
  },
  {
    _id: 'w_03',
    exerciseName: '5K Tempo Road Run',
    category: 'Cardio',
    sets: 1,
    reps: 1,
    weightLifted: 0,
    duration: 24,
    caloriesBurned: 380,
    date: '2026-11-19',
    notes: 'Average pace 4:48 min/km. Heart rate kept in Zone 4.',
    intensity: 'High'
  },
  {
    _id: 'w_04',
    exerciseName: 'Barbell Deadlifts',
    category: 'Strength',
    sets: 5,
    reps: 5,
    weightLifted: 145,
    duration: 50,
    caloriesBurned: 450,
    date: '2026-11-18',
    notes: 'Used lifting belt on top 2 sets. Felt strong.',
    intensity: 'High'
  },
  {
    _id: 'w_05',
    exerciseName: 'HIIT Kettlebell Circuit',
    category: 'Cardio',
    sets: 4,
    reps: 15,
    weightLifted: 24,
    duration: 35,
    caloriesBurned: 410,
    date: '2026-11-17',
    notes: '24kg swings alternated with burpees & box jumps.',
    intensity: 'High'
  },
  {
    _id: 'w_06',
    exerciseName: 'Vinyasa Flow & Deep Mobility',
    category: 'Flexibility',
    sets: 1,
    reps: 1,
    weightLifted: 0,
    duration: 40,
    caloriesBurned: 150,
    date: '2026-11-16',
    notes: 'Hamstring & thoracic spine opening routine.',
    intensity: 'Low'
  },
  {
    _id: 'w_07',
    exerciseName: 'Barbell Back Squats',
    category: 'Strength',
    sets: 4,
    reps: 6,
    weightLifted: 125,
    duration: 45,
    caloriesBurned: 390,
    date: '2026-11-15',
    notes: 'Deep depth below parallel. Knees tracked great.',
    intensity: 'High'
  }
];

export const INITIAL_NUTRITION = [
  {
    _id: 'n_01',
    foodName: 'Steel-Cut Oats with Whey & Blueberries',
    mealType: 'Breakfast',
    quantity: '1 large bowl (350g)',
    calories: 490,
    protein: 36,
    carbs: 68,
    fats: 9,
    date: '2026-11-20'
  },
  {
    _id: 'n_02',
    foodName: 'Grilled Chicken Breast with Quinoa & Asparagus',
    mealType: 'Lunch',
    quantity: '400g serving',
    calories: 620,
    protein: 55,
    carbs: 58,
    fats: 14,
    date: '2026-11-20'
  },
  {
    _id: 'n_03',
    foodName: 'Cold Brew & Rice Cakes with Peanut Butter',
    mealType: 'Snacks',
    quantity: '2 cakes + 25g PB',
    calories: 260,
    protein: 10,
    carbs: 32,
    fats: 11,
    date: '2026-11-20'
  },
  {
    _id: 'n_04',
    foodName: 'Wild Atlantic Salmon, Sweet Potato Mash & Broccoli',
    mealType: 'Dinner',
    quantity: '450g plate',
    calories: 740,
    protein: 48,
    carbs: 65,
    fats: 26,
    date: '2026-11-20'
  },
  {
    _id: 'n_05',
    foodName: 'Greek Yogurt 0% with Honey & Crushed Walnuts',
    mealType: 'Snacks',
    quantity: '220g cup',
    calories: 240,
    protein: 24,
    carbs: 18,
    fats: 8,
    date: '2026-11-20'
  },
  {
    _id: 'n_06',
    foodName: 'Egg White Omelet with Spinach, Turkey Bacon & Avocado',
    mealType: 'Breakfast',
    quantity: '3 eggs + toast',
    calories: 520,
    protein: 42,
    carbs: 38,
    fats: 18,
    date: '2026-11-19'
  },
  {
    _id: 'n_07',
    foodName: 'Grass-Fed Sirloin Steak with Roasted Sweet Potatoes',
    mealType: 'Dinner',
    quantity: '400g',
    calories: 780,
    protein: 58,
    carbs: 52,
    fats: 28,
    date: '2026-11-19'
  }
];

export const INITIAL_PROGRESS = [
  {
    _id: 'p_01',
    date: '2026-11-20',
    weight: 77.2,
    bodyFat: 14.2,
    chest: 104,
    waist: 81,
    arms: 38.5,
    thighs: 59,
    runningTime5k: 23.5,
    deadliftMax: 155,
    benchMax: 100,
    squatMax: 135,
    notes: 'Morning weigh-in fasted. Waist down 0.5cm from last week.'
  },
  {
    _id: 'p_02',
    date: '2026-11-13',
    weight: 77.8,
    bodyFat: 14.6,
    chest: 103.5,
    waist: 81.8,
    arms: 38.2,
    thighs: 58.8,
    runningTime5k: 24.1,
    deadliftMax: 150,
    benchMax: 97.5,
    squatMax: 132.5,
    notes: 'Consistent hydration and sleep improved energy.'
  },
  {
    _id: 'p_03',
    date: '2026-11-06',
    weight: 78.4,
    bodyFat: 15.1,
    chest: 103,
    waist: 82.5,
    arms: 38.0,
    thighs: 58.5,
    runningTime5k: 24.8,
    deadliftMax: 145,
    benchMax: 95,
    squatMax: 130,
    notes: 'Strength steadily returning after minor rest week.'
  },
  {
    _id: 'p_04',
    date: '2026-10-30',
    weight: 79.1,
    bodyFat: 15.6,
    chest: 102.5,
    waist: 83.2,
    arms: 37.8,
    thighs: 58.2,
    runningTime5k: 25.4,
    deadliftMax: 142.5,
    benchMax: 92.5,
    squatMax: 127.5,
    notes: 'Kicked off high-protein hypertrophy block.'
  },
  {
    _id: 'p_05',
    date: '2026-10-23',
    weight: 79.8,
    bodyFat: 16.2,
    chest: 102,
    waist: 84.0,
    arms: 37.5,
    thighs: 58.0,
    runningTime5k: 26.2,
    deadliftMax: 140,
    benchMax: 90,
    squatMax: 125,
    notes: 'Baseline measurement before new routine.'
  }
];

export const INITIAL_GOALS = [
  {
    _id: 'g_01',
    title: 'Reach 74.0 kg Target Weight',
    category: 'Weight',
    current: 77.2,
    target: 74.0,
    unit: 'kg',
    deadline: '2026-12-31',
    status: 'In Progress',
    completed: false
  },
  {
    _id: 'g_02',
    title: 'Complete 5 Workouts / Week',
    category: 'Workouts',
    current: 4,
    target: 5,
    unit: 'sessions',
    deadline: '2026-11-23',
    status: 'In Progress',
    completed: false
  },
  {
    _id: 'g_03',
    title: 'Sub-22 Minute 5K Run',
    category: 'Cardio',
    current: 23.5,
    target: 22.0,
    unit: 'min',
    deadline: '2026-12-15',
    status: 'In Progress',
    completed: false
  },
  {
    _id: 'g_04',
    title: '160kg Deadlift PR',
    category: 'Strength',
    current: 155,
    target: 160,
    unit: 'kg',
    deadline: '2026-12-20',
    status: 'In Progress',
    completed: false
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    _id: 'notif_01',
    title: 'New PR Logged!',
    message: 'Congratulations Alex! You hit 92.5 kg on Barbell Bench Press today.',
    type: 'achievement',
    read: false,
    timestamp: '2 hours ago'
  },
  {
    _id: 'notif_02',
    title: 'Elena Vance started following you',
    message: 'Check out Elena\'s profile and training logs.',
    type: 'social',
    read: false,
    timestamp: '5 hours ago'
  },
  {
    _id: 'notif_03',
    title: 'Daily Nutrition Target Met',
    message: 'You reached 173g Protein (Target: 160g) yesterday.',
    type: 'nutrition',
    read: true,
    timestamp: 'Yesterday'
  },
  {
    _id: 'notif_04',
    title: 'Reminder: Evening Hydration',
    message: 'Log your dinner and drink at least 500ml water.',
    type: 'reminder',
    read: true,
    timestamp: 'Yesterday'
  }
];

export const INITIAL_REMINDERS = [
  {
    _id: 'rem_01',
    title: 'Morning Upper Body Workout',
    time: '07:30',
    days: ['Mon', 'Wed', 'Fri'],
    type: 'workout',
    enabled: true
  },
  {
    _id: 'rem_02',
    title: 'Post-Workout Protein & Meal',
    time: '12:45',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    type: 'nutrition',
    enabled: true
  },
  {
    _id: 'rem_03',
    title: 'Weekly Weigh-in & Progress Log',
    time: '08:00',
    days: ['Sun'],
    type: 'progress',
    enabled: true
  }
];

export const INITIAL_COMMUNITY_USERS = [
  {
    _id: 'u_02',
    name: 'Elena Vance',
    role: 'CrossFit Athlete & Coach',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    workoutsCount: 142,
    followersCount: 890,
    isFollowing: true,
    bio: 'Pushing boundaries daily. Certified CrossFit Level 2 Trainer.'
  },
  {
    _id: 'u_03',
    name: 'Marcus Brody',
    role: 'Powerlifter & Nutritionist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    workoutsCount: 215,
    followersCount: 1450,
    isFollowing: false,
    bio: 'Heavy squats and clean macronutrients. 600kg total lifter.'
  },
  {
    _id: 'u_04',
    name: 'Sophia Chen',
    role: 'Marathoner & Yoga Instructor',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    workoutsCount: 98,
    followersCount: 620,
    isFollowing: false,
    bio: 'Boston Marathon qualifier. Finding harmony between endurance & breath.'
  },
  {
    _id: 'u_05',
    name: 'Darius Thorne',
    role: 'Calisthenics Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    workoutsCount: 180,
    followersCount: 1120,
    isFollowing: true,
    bio: 'Mastering bodyweight strength: human flag, muscle-ups, handstands.'
  }
];

export const INITIAL_FORUM_POSTS = [
  {
    _id: 'post_01',
    author: {
      name: 'Elena Vance',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80'
    },
    title: 'Top 3 recovery tips after grueling leg days',
    content: 'Cold contrast showers, 10 min easy spin bike recovery, and targeting 40g casein protein before bed have revolutionized my central nervous system recovery. What are your non-negotiables?',
    tags: ['Recovery', 'Strength', 'Nutrition'],
    likes: 38,
    userLiked: true,
    createdAt: '4 hours ago',
    responses: [
      {
        _id: 'resp_01',
        author: {
          name: 'Marcus Brody',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
        },
        content: 'Totally agree on the casein! Also adding 5g of glutamine with electrolytes has stopped hamstring cramping for me completely.',
        createdAt: '3 hours ago'
      },
      {
        _id: 'resp_02',
        author: {
          name: 'Alex Rivera',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
        },
        content: 'I swear by 20 minutes of restorative yoga flow the evening after squats. Stretches the hip flexors nicely.',
        createdAt: '1 hour ago'
      }
    ]
  },
  {
    _id: 'post_02',
    author: {
      name: 'Marcus Brody',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
    },
    title: 'Low Bar vs High Bar Squats: Mechanics & Quad Activation',
    content: 'If you have long femurs like me, low bar is a game-changer for hip leverage and back health. Just logged 140kg x 5 smoothly. Anyone else switched recently?',
    tags: ['Powerlifting', 'FormCheck', 'Squat'],
    likes: 54,
    userLiked: false,
    createdAt: '1 day ago',
    responses: [
      {
        _id: 'resp_03',
        author: {
          name: 'Darius Thorne',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
        },
        content: 'I switched 6 months ago, knee pain disappeared within 3 weeks. You just need to ensure wrist mobility.',
        createdAt: '22 hours ago'
      }
    ]
  }
];

export const INITIAL_FAQS = [
  {
    q: 'How does PulseFit calculate daily calories and macros?',
    a: 'We use the clinically validated Mifflin-St Jeor equation factoring in your weight, height, age, activity level, and specific primary goal (fat loss, maintenance, or muscle hyper-trophy).'
  },
  {
    q: 'Can I export my workout logs and progress charts to PDF or CSV?',
    a: 'Yes! Navigate to the Reports & Export page where you can generate professional instant PDF summaries with detailed tables or export raw CSV data for spreadsheet analysis.'
  },
  {
    q: 'How do I toggle between Metric (KG) and Imperial (LBS)?',
    a: 'Go to Settings > Unit Preferences. When you toggle to LBS, all weights, logs, and progress charts automatically reflect your preferred units.'
  },
  {
    q: 'Is my personal fitness and health data kept private?',
    a: 'Absolutely. PulseFit enforces strict user-level data isolation. In Settings > Privacy, you can also customize whether your profile and community posts are public or private.'
  },
  {
    q: 'How do notifications and workout reminders work?',
    a: 'You can configure daily or weekly reminders in Notifications & Reminders. The system notifies you when goals are hit, workouts are completed, or community friends reply.'
  }
];

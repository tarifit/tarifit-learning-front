export const SKILLS = {
  GREETINGS: {
    id: 'greetings',
    name: 'Greetings & Basics',
    icon: '👋',
    color: 'from-blue-500 to-blue-600',
    borderColor: 'border-blue-400',
    description: 'Learn basic greetings and essential words',
    unlockRequirement: null, // Always unlocked
    totalExercises: 8,
    exercises: [
      {
        id: 'greetings_1',
        type: 'picture-matching',
        title: 'Hello - Picture Match',
        word: 'Azul',
        meaning: 'Hello',
        imageUrl: '/images/hello.png',
        options: ['Azul', 'Adiyus', 'Tanmirt', 'Ɛafek'],
        correct: 'Azul'
      },
      {
        id: 'greetings_2',
        type: 'translate-text',
        title: 'Translate: Goodbye',
        question: 'Goodbye',
        placeholder: 'Type in Tarifit...',
        correct: 'Adiyus'
      },
      {
        id: 'greetings_3',
        type: 'multiple-choice',
        title: 'What is "Please"?',
        question: 'Please',
        options: ['Ɛafek', 'Tanmirt', 'Wah', 'La'],
        correct: 'Ɛafek'
      },
      {
        id: 'greetings_4',
        type: 'sentence-building',
        title: 'Build: Azul fell-ak',
        scrambledWords: ['Azul', 'fell-ak'],
        correctOrder: ['Azul', 'fell-ak'],
        meaning: 'Hello to you',
        context: 'A polite greeting'
      },
      {
        id: 'greetings_5',
        type: 'translation',
        title: 'Thank you',
        question: 'Thank you',
        correct: 'Tanmirt'
      },
      {
        id: 'greetings_6',
        type: 'multiple-choice',
        title: 'Yes or No?',
        question: 'What is "Yes" in Tarifit?',
        options: ['Wah', 'La', 'Tanmirt', 'Ɛafek'],
        correct: 'Wah'
      },
      {
        id: 'greetings_7',
        type: 'sentence-building',
        title: 'What is your name?',
        scrambledWords: ['Isminu?'],
        correctOrder: ['Isminu?'],
        meaning: 'What is your name?',
        context: 'Asking someone their name'
      },
      {
        id: 'greetings_8',
        type: 'translation',
        title: 'My name is...',
        question: 'My name is...',
        correct: 'Isem-inu...'
      }
    ]
  },
  
  NUMBERS: {
    id: 'numbers',
    name: 'Numbers & Colors',
    icon: '🔢',
    color: 'from-purple-500 to-purple-600',
    borderColor: 'border-purple-400',
    description: 'Master numbers and colors',
    unlockRequirement: { skillId: 'greetings', completedExercises: 6 },
    totalExercises: 10,
    exercises: [
      {
        id: 'numbers_1',
        type: 'picture-matching',
        title: 'Number One',
        word: 'Ijj',
        meaning: 'One',
        imageUrl: '/images/one.png',
        options: ['Ijj', 'Tnayen', 'Tlata', 'Rebɛa'],
        correct: 'Ijj'
      },
      {
        id: 'numbers_2',
        type: 'multiple-choice',
        title: 'What is Two?',
        question: 'Two',
        options: ['Ijj', 'Tnayen', 'Tlata', 'Rebɛa'],
        correct: 'Tnayen'
      },
      {
        id: 'numbers_3',
        type: 'translation',
        title: 'Three',
        question: 'Three',
        correct: 'Tlata'
      },
      {
        id: 'numbers_4',
        type: 'sentence-building',
        title: 'Three apples',
        scrambledWords: ['Tlata', 'n', 'maɛṭica'],
        correctOrder: ['Tlata', 'n', 'maɛṭica'],
        meaning: 'Three apples',
        context: 'Counting objects'
      },
      {
        id: 'numbers_5',
        type: 'picture-matching',
        title: 'Red Color',
        word: 'Azggagh',
        meaning: 'Red',
        imageUrl: '/images/red.png',
        options: ['Azggagh', 'Ziyzu', 'Azyza', 'Amellal'],
        correct: 'Azggagh'
      },
      {
        id: 'numbers_6',
        type: 'multiple-choice',
        title: 'Blue Color',
        question: 'Blue',
        options: ['Azggagh', 'Ziyzu', 'Azyza', 'Amellal'],
        correct: 'Ziyzu'
      },
      {
        id: 'numbers_7',
        type: 'translation',
        title: 'Green',
        question: 'Green',
        correct: 'Azyza'
      },
      {
        id: 'numbers_8',
        type: 'sentence-building',
        title: 'Five days',
        scrambledWords: ['Xemsa', 'n', 'wussan'],
        correctOrder: ['Xemsa', 'n', 'wussan'],
        meaning: 'Five days',
        context: 'Time expression'
      },
      {
        id: 'numbers_9',
        type: 'multiple-choice',
        title: 'Ten',
        question: 'Ten',
        options: ['Xemsa', 'Ɛecra', 'Rebɛa', 'Tlata'],
        correct: 'Ɛecra'
      },
      {
        id: 'numbers_10',
        type: 'sentence-building',
        title: 'Blue and white',
        scrambledWords: ['Ziyzu', 'd', 'acemlal'],
        correctOrder: ['Ziyzu', 'd', 'acemlal'],
        meaning: 'Blue and white',
        context: 'Describing colors together'
      }
    ]
  },

  FAMILY: {
    id: 'family',
    name: 'Family & People',
    icon: '👨‍👩‍👧‍👦',
    color: 'from-green-500 to-green-600',
    borderColor: 'border-green-400',
    description: 'Learn family relationships and people',
    unlockRequirement: { skillId: 'numbers', completedExercises: 7 },
    totalExercises: 9,
    exercises: [
      {
        id: 'family_1',
        type: 'picture-matching',
        title: 'Father',
        word: 'Baba',
        meaning: 'Father',
        imageUrl: '/images/father.png',
        options: ['Baba', 'Yemma', 'Arraw', 'Jeddi'],
        correct: 'Baba'
      },
      {
        id: 'family_2',
        type: 'picture-matching',
        title: 'Mother',
        word: 'Yemma',
        meaning: 'Mother',
        imageUrl: '/images/mother.png',
        options: ['Baba', 'Yemma', 'Tarbat', 'Jidda'],
        correct: 'Yemma'
      },
      {
        id: 'family_3',
        type: 'multiple-choice',
        title: 'Son',
        question: 'Son',
        options: ['Arraw', 'Tarbat', 'Awma', 'Weltma'],
        correct: 'Arraw'
      },
      {
        id: 'family_4',
        type: 'translation',
        title: 'Daughter',
        question: 'Daughter',
        correct: 'Tarbat'
      },
      {
        id: 'family_5',
        type: 'sentence-building',
        title: 'Our father',
        scrambledWords: ['Baba-neɣ'],
        correctOrder: ['Baba-neɣ'],
        meaning: 'Our father',
        context: 'Possessive form'
      },
      {
        id: 'family_6',
        type: 'multiple-choice',
        title: 'Brother',
        question: 'Brother',
        options: ['Awma', 'Weltma', 'Jeddi', 'Jidda'],
        correct: 'Awma'
      },
      {
        id: 'family_7',
        type: 'translation',
        title: 'Sister',
        question: 'Sister',
        correct: 'Weltma'
      },
      {
        id: 'family_8',
        type: 'sentence-building',
        title: 'Your brother',
        scrambledWords: ['Awma-k'],
        correctOrder: ['Awma-k'],
        meaning: 'Your brother',
        context: 'Possessive form'
      },
      {
        id: 'family_9',
        type: 'sentence-building',
        title: 'Fatima\'s son',
        scrambledWords: ['Arraw', 'n', 'Fatima'],
        correctOrder: ['Arraw', 'n', 'Fatima'],
        meaning: 'Fatima\'s son',
        context: 'Genitive construction'
      }
    ]
  },

  FOOD: {
    id: 'food',
    name: 'Food & Drinks',
    icon: '🍞',
    color: 'from-orange-500 to-orange-600',
    borderColor: 'border-orange-400',
    description: 'Learn about food and beverages',
    unlockRequirement: { skillId: 'family', completedExercises: 7 },
    totalExercises: 12,
    exercises: [
      {
        id: 'food_1',
        type: 'picture-matching',
        title: 'Bread',
        word: 'Aɣrum',
        meaning: 'Bread',
        imageUrl: '/images/bread.png',
        options: ['Aɣrum', 'Acffay', 'Aman', 'Atay'],
        correct: 'Aɣrum'
      },
      {
        id: 'food_2',
        type: 'translation',
        title: 'Milk',
        question: 'Milk',
        correct: 'Acffay'
      },
      {
        id: 'food_3',
        type: 'multiple-choice',
        title: 'Water',
        question: 'Water',
        options: ['Aman', 'Atay', 'Acffay', 'Aysum'],
        correct: 'Aman'
      },
      {
        id: 'food_4',
        type: 'picture-matching',
        title: 'Tea',
        word: 'Atay',
        meaning: 'Tea',
        imageUrl: '/images/tea.png',
        options: ['Atay', 'Aman', 'Acffay', 'Tamment'],
        correct: 'Atay'
      },
      {
        id: 'food_5',
        type: 'sentence-building',
        title: 'Tea and mint',
        scrambledWords: ['Atay', 'd', 'tminta'],
        correctOrder: ['Atay', 'd', 'tminta'],
        meaning: 'Tea and mint',
        context: 'Common combination'
      },
      {
        id: 'food_6',
        type: 'translation',
        title: 'Meat',
        question: 'Meat',
        correct: 'Aysum'
      },
      {
        id: 'food_7',
        type: 'multiple-choice',
        title: 'Fish',
        question: 'Fish',
        options: ['Iselman', 'Aysum', 'Tateffaḥt', 'Azemmur'],
        correct: 'Iselman'
      },
      {
        id: 'food_8',
        type: 'sentence-building',
        title: 'Bread with honey',
        scrambledWords: ['Aɣrum', 'ak', 'tamment'],
        correctOrder: ['Aɣrum', 'ak', 'tamment'],
        meaning: 'Bread with honey',
        context: 'Common meal'
      },
      {
        id: 'food_9',
        type: 'translation',
        title: 'I want water',
        question: 'I want water',
        correct: 'Xseɣ aman'
      },
      {
        id: 'food_10',
        type: 'picture-matching',
        title: 'Apple',
        word: 'Tateffaḥt',
        meaning: 'Apple',
        imageUrl: '/images/apple.png',
        options: ['Tateffaḥt', 'Azemmur', 'Tamellalt', 'Tamment'],
        correct: 'Tateffaḥt'
      },
      {
        id: 'food_11',
        type: 'sentence-building',
        title: 'She ate couscous',
        scrambledWords: ['Tecca', 'seysu'],
        correctOrder: ['Tecca', 'seysu'],
        meaning: 'She ate couscous',
        context: 'Past tense eating'
      },
      {
        id: 'food_12',
        type: 'multiple-choice',
        title: 'Tagine',
        question: 'Tagine',
        options: ['Tajin', 'Seysu', 'Aɣrum', 'Atay'],
        correct: 'Tajin'
      }
    ]
  },

  ACTIVITIES: {
    id: 'activities',
    name: 'Daily Activities',
    icon: '🏃‍♂️',
    color: 'from-teal-500 to-teal-600',
    borderColor: 'border-teal-400',
    description: 'Learn daily activities and time expressions',
    unlockRequirement: { skillId: 'food', completedExercises: 9 },
    totalExercises: 10,
    exercises: [
      {
        id: 'activities_1',
        type: 'picture-matching',
        title: 'Eat',
        word: 'Ecc',
        meaning: 'Eat',
        imageUrl: '/images/eating.png',
        options: ['Ecc', 'Sew', 'Ṭṭeṣ', 'Ugur'],
        correct: 'Ecc'
      },
      {
        id: 'activities_2',
        type: 'translation',
        title: 'Drink',
        question: 'Drink',
        correct: 'Sew'
      },
      {
        id: 'activities_3',
        type: 'sentence-building',
        title: 'I ate bread',
        scrambledWords: ['Ecciɣ', 'aɣrum'],
        correctOrder: ['Ecciɣ', 'aɣrum'],
        meaning: 'I ate bread',
        context: 'Past tense action'
      },
      {
        id: 'activities_4',
        type: 'multiple-choice',
        title: 'Sleep',
        question: 'Sleep',
        options: ['Ṭṭeṣ', 'Qqim', 'Ugur', 'Xdem'],
        correct: 'Ṭṭeṣ'
      },
      {
        id: 'activities_5',
        type: 'sentence-building',
        title: 'I drank tea',
        scrambledWords: ['Swiɣ', 'atay'],
        correctOrder: ['Swiɣ', 'atay'],
        meaning: 'I drank tea',
        context: 'Past tense drinking'
      },
      {
        id: 'activities_6',
        type: 'translation',
        title: 'Walk',
        question: 'Walk',
        correct: 'Ugur'
      },
      {
        id: 'activities_7',
        type: 'multiple-choice',
        title: 'Work',
        question: 'Work',
        options: ['Xdem', 'Ɣar', 'Ari', 'Ssawal'],
        correct: 'Xdem'
      },
      {
        id: 'activities_8',
        type: 'sentence-building',
        title: 'I sleep in the evening',
        scrambledWords: ['Ttṭṣeɣ', 'deg', 'uɛecci'],
        correctOrder: ['Ttṭṣeɣ', 'deg', 'uɛecci'],
        meaning: 'I sleep in the evening',
        context: 'Time expression'
      },
      {
        id: 'activities_9',
        type: 'translation',
        title: 'Morning',
        question: 'Morning',
        correct: 'Uffu'
      },
      {
        id: 'activities_10',
        type: 'sentence-building',
        title: 'I go to the market',
        scrambledWords: ['Ggʷareɣ', 'ɣer', 'souq'],
        correctOrder: ['Ggʷareɣ', 'ɣer', 'souq'],
        meaning: 'I go to the market',
        context: 'Direction and movement'
      }
    ]
  }
};

export const XP_REWARDS = {
  'picture-matching': 10,
  'translation': 15,
  'sentence-building': 20,
  'multiple-choice': 10,
  'perfect-bonus': 5,
  'first-try-bonus': 3,
  'daily-streak-bonus': 10
};

export const LEVEL_REQUIREMENTS = {
  1: 0,
  2: 100,
  3: 250,
  4: 450,
  5: 700
};

export const getSkillById = (skillId) => {
  return Object.values(SKILLS).find(skill => skill.id === skillId);
};

export const getExerciseById = (exerciseId) => {
  for (const skill of Object.values(SKILLS)) {
    const exercise = skill.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      return { ...exercise, skillId: skill.id };
    }
  }
  return null;
};

export const isSkillUnlocked = (skillId, userProgress) => {
  const skill = getSkillById(skillId);
  if (!skill || !skill.unlockRequirement) return true;
  
  const reqSkillProgress = userProgress.skills[skill.unlockRequirement.skillId];
  if (!reqSkillProgress) return false;
  
  return reqSkillProgress.completedExercises >= skill.unlockRequirement.completedExercises;
};

export const calculateLevel = (totalXP) => {
  let level = 1;
  for (const [lvl, reqXP] of Object.entries(LEVEL_REQUIREMENTS)) {
    if (totalXP >= reqXP) {
      level = parseInt(lvl);
    }
  }
  return level;
};

export const getXPForNextLevel = (currentLevel) => {
  return LEVEL_REQUIREMENTS[currentLevel + 1] || LEVEL_REQUIREMENTS[5];
};
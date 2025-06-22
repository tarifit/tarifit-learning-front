import { XP_REWARDS, LEVEL_REQUIREMENTS, calculateLevel, getSkillById } from '../data/skillTreeData';

const STORAGE_KEY = 'tarifit_learning_progress';

export const getDefaultProgress = () => ({
  totalXP: 0,
  level: 1,
  currentStreak: 0,
  lastStudyDate: null,
  achievements: [],
  skills: {
    greetings: { completedExercises: 0, exercises: {} },
    numbers: { completedExercises: 0, exercises: {} },
    family: { completedExercises: 0, exercises: {} },
    food: { completedExercises: 0, exercises: {} },
    activities: { completedExercises: 0, exercises: {} }
  }
});

export const loadProgress = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const progress = JSON.parse(stored);
      return { ...getDefaultProgress(), ...progress };
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  return getDefaultProgress();
};

export const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (error) {
    console.error('Error saving progress:', error);
    return false;
  }
};

export const resetProgress = () => {
  const defaultProgress = getDefaultProgress();
  saveProgress(defaultProgress);
  return defaultProgress;
};

export const calculateExerciseXP = (exerciseType, isCorrect, isFirstTry, isPerfectScore) => {
  if (!isCorrect) return 0;
  
  let xp = XP_REWARDS[exerciseType] || 10;
  
  if (isPerfectScore) xp += XP_REWARDS['perfect-bonus'];
  if (isFirstTry) xp += XP_REWARDS['first-try-bonus'];
  
  return xp;
};

export const updateDailyStreak = (progress) => {
  const today = new Date().toDateString();
  const lastStudy = progress.lastStudyDate;
  
  if (lastStudy === today) {
    return progress;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  
  let newStreak = 1;
  if (lastStudy === yesterdayStr) {
    newStreak = progress.currentStreak + 1; 
  }
  
  return {
    ...progress,
    currentStreak: newStreak,
    lastStudyDate: today,
    totalXP: progress.totalXP + (newStreak > 1 ? XP_REWARDS['daily-streak-bonus'] : 0)
  };
};

export const completeExercise = (exerciseId, skillId, isCorrect, isFirstTry = true, isPerfectScore = false) => {
  const progress = loadProgress();
  const updatedProgress = updateDailyStreak(progress);
  
  const skill = getSkillById(skillId);
  if (!skill) return updatedProgress;
  
  const exercise = skill.exercises.find(ex => ex.id === exerciseId);
  if (!exercise) return updatedProgress;
  
  const exerciseProgress = updatedProgress.skills[skillId].exercises[exerciseId] || {
    completed: false,
    attempts: 0,
    bestScore: 0
  };
  
  exerciseProgress.attempts += 1;
  
  if (isCorrect) {
    const earnedXP = calculateExerciseXP(exercise.type, isCorrect, isFirstTry, isPerfectScore);
    
    if (!exerciseProgress.completed) {
      exerciseProgress.completed = true;
      updatedProgress.skills[skillId].completedExercises += 1;
    }
    
    exerciseProgress.bestScore = Math.max(exerciseProgress.bestScore, isPerfectScore ? 100 : 80);
    updatedProgress.totalXP += earnedXP;
    updatedProgress.level = calculateLevel(updatedProgress.totalXP);
    
    updatedProgress.skills[skillId].exercises[exerciseId] = exerciseProgress;
    
    const newAchievements = checkAchievements(updatedProgress, skillId);
    updatedProgress.achievements = [...new Set([...updatedProgress.achievements, ...newAchievements])];
  }
  
  saveProgress(updatedProgress);
  return updatedProgress;
};

export const checkAchievements = (progress, completedSkillId) => {
  const achievements = [];
  
  if (progress.totalXP >= 100 && !progress.achievements.includes('first_level_up')) {
    achievements.push('first_level_up');
  }
  
  if (progress.currentStreak >= 7 && !progress.achievements.includes('week_streak')) {
    achievements.push('week_streak');
  }
  
  const skillProgress = progress.skills[completedSkillId];
  if (skillProgress && skillProgress.completedExercises === getSkillById(completedSkillId)?.totalExercises) {
    const achievementId = `complete_${completedSkillId}`;
    if (!progress.achievements.includes(achievementId)) {
      achievements.push(achievementId);
    }
  }
  
  const totalCompleted = Object.values(progress.skills)
    .reduce((sum, skill) => sum + skill.completedExercises, 0);
  
  if (totalCompleted >= 25 && !progress.achievements.includes('quarter_complete')) {
    achievements.push('quarter_complete');
  }
  
  if (progress.level >= 5 && !progress.achievements.includes('max_level')) {
    achievements.push('max_level');
  }
  
  return achievements;
};

export const getSkillProgress = (skillId, progress) => {
  const skill = getSkillById(skillId);
  const skillProgress = progress.skills[skillId];
  
  if (!skill || !skillProgress) return { completed: 0, total: 0, percentage: 0 };
  
  return {
    completed: skillProgress.completedExercises,
    total: skill.totalExercises,
    percentage: Math.round((skillProgress.completedExercises / skill.totalExercises) * 100)
  };
};

export const getOverallProgress = (progress) => {
  const totalExercises = Object.values(progress.skills)
    .reduce((sum, skill) => {
      const skillData = getSkillById(Object.keys(progress.skills).find(id => progress.skills[id] === skill));
      return sum + (skillData?.totalExercises || 0);
    }, 0);
  
  const completedExercises = Object.values(progress.skills)
    .reduce((sum, skill) => sum + skill.completedExercises, 0);
  
  return {
    completed: completedExercises,
    total: totalExercises,
    percentage: totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0
  };
};

export const getNextLevelProgress = (progress) => {
  const currentLevel = progress.level;
  const currentXP = progress.totalXP;
  const currentLevelXP = LEVEL_REQUIREMENTS[currentLevel] || 0;
  const nextLevelXP = LEVEL_REQUIREMENTS[currentLevel + 1] || LEVEL_REQUIREMENTS[5];
  
  const progressInLevel = currentXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  
  return {
    currentLevel,
    currentXP,
    nextLevelXP,
    progressInLevel,
    xpNeededForLevel,
    percentage: Math.round((progressInLevel / xpNeededForLevel) * 100)
  };
};

export const ACHIEVEMENT_DEFINITIONS = {
  first_level_up: {
    id: 'first_level_up',
    title: 'Level Up!',
    description: 'Reached level 2',
    icon: '🎉',
    xp: 50
  },
  week_streak: {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Studied for 7 days in a row',
    icon: '🔥',
    xp: 100
  },
  complete_greetings: {
    id: 'complete_greetings',
    title: 'Greeting Master',
    description: 'Completed all Greetings & Basics exercises',
    icon: '👋',
    xp: 100
  },
  complete_numbers: {
    id: 'complete_numbers',
    title: 'Number Ninja',
    description: 'Completed all Numbers & Colors exercises',
    icon: '🔢',
    xp: 100
  },
  complete_family: {
    id: 'complete_family',
    title: 'Family Friend',
    description: 'Completed all Family & People exercises',
    icon: '👨‍👩‍👧‍👦',
    xp: 100
  },
  complete_food: {
    id: 'complete_food',
    title: 'Food Fanatic',
    description: 'Completed all Food & Drinks exercises',
    icon: '🍞',
    xp: 100
  },
  complete_activities: {
    id: 'complete_activities',
    title: 'Activity Ace',
    description: 'Completed all Daily Activities exercises',
    icon: '🏃‍♂️',
    xp: 100
  },
  quarter_complete: {
    id: 'quarter_complete',
    title: 'Quarter Master',
    description: 'Completed 25 exercises',
    icon: '⭐',
    xp: 150
  },
  max_level: {
    id: 'max_level',
    title: 'Tarifit Expert',
    description: 'Reached maximum level',
    icon: '👑',
    xp: 200
  }
};
import React from 'react';
import { ArrowLeft, Play, CheckCircle, Lock, Star } from 'lucide-react';
import { getSkillProgress } from '../utils/progressManager';

const SkillDetail = ({ skill, progress, onBack, onStartExercise, onProgressUpdate }) => {
  const skillProgress = getSkillProgress(skill.id, progress);
  
  const getExerciseStatus = (exerciseId) => {
    const exerciseProgress = progress.skills[skill.id]?.exercises[exerciseId];
    return exerciseProgress?.completed || false;
  };
  
  const getExerciseAttempts = (exerciseId) => {
    const exerciseProgress = progress.skills[skill.id]?.exercises[exerciseId];
    return exerciseProgress?.attempts || 0;
  };
  
  const getExerciseScore = (exerciseId) => {
    const exerciseProgress = progress.skills[skill.id]?.exercises[exerciseId];
    return exerciseProgress?.bestScore || 0;
  };

  const handleStartExercise = (exercise) => {
    onStartExercise(exercise, skill.id, onProgressUpdate);
  };

  const getExerciseTypeIcon = (type) => {
    switch (type) {
      case 'picture-matching': return '🖼️';
      case 'translation': return '🔤';
      case 'sentence-building': return '🧩';
      case 'multiple-choice': return '❓';
      default: return '📝';
    }
  };

  const getExerciseTypeColor = (type) => {
    switch (type) {
      case 'picture-matching': return 'from-pink-500 to-pink-600 border-pink-400';
      case 'translation': return 'from-purple-500 to-purple-600 border-purple-400';
      case 'sentence-building': return 'from-emerald-500 to-emerald-600 border-emerald-400';
      case 'multiple-choice': return 'from-orange-500 to-orange-600 border-orange-400';
      default: return 'from-blue-500 to-blue-600 border-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>Back to Skill Tree</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-gray-400 text-sm">Progress</div>
              <div className="text-white text-lg font-bold">{skillProgress.percentage}%</div>
            </div>
          </div>
        </div>

        {/* Skill Header */}
        <div className={`bg-gradient-to-br ${skill.color} rounded-3xl p-8 mb-8 border-4 ${skill.borderColor} shadow-xl relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
          </div>
          
          <div className="relative z-10 flex items-center space-x-6">
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-5xl border border-white/20">
              {skill.icon}
            </div>
            
            <div className="flex-1">
              <h1 className="text-white text-4xl font-bold mb-2">{skill.name}</h1>
              <p className="text-white/80 text-lg mb-4">{skill.description}</p>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/90 font-medium">
                    {skillProgress.completed} of {skillProgress.total} exercises completed
                  </span>
                  <span className="text-white/90 font-bold">
                    {skillProgress.percentage}%
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full transition-all duration-500 relative"
                    style={{ width: `${skillProgress.percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="space-y-6">
          <h2 className="text-white text-2xl font-bold">Exercises</h2>
          
          <div className="grid gap-4">
            {skill.exercises.map((exercise, index) => {
              const isCompleted = getExerciseStatus(exercise.id);
              const attempts = getExerciseAttempts(exercise.id);
              const score = getExerciseScore(exercise.id);
              const isAvailable = index === 0 || getExerciseStatus(skill.exercises[index - 1].id);
              
              return (
                <div
                  key={exercise.id}
                  className={`relative group transition-all duration-300 ${
                    isAvailable ? 'transform hover:scale-[1.02]' : ''
                  }`}
                >
                  <div className={`bg-gradient-to-r ${
                    isCompleted 
                      ? 'from-green-500 to-green-600 border-green-400 shadow-xl shadow-green-500/20'
                      : isAvailable 
                        ? `${getExerciseTypeColor(exercise.type)} shadow-xl`
                        : 'from-gray-600 to-gray-700 border-gray-500 shadow-lg'
                  } rounded-2xl p-6 border-2 relative overflow-hidden`}>
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
                    </div>
                    
                    {/* Lock Overlay */}
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <Lock className="text-gray-300 mx-auto mb-2" size={32} />
                          <div className="text-gray-300 text-sm">Complete previous exercise</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Exercise Icon */}
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl ${
                          isAvailable ? 'bg-white/20' : 'bg-gray-500/20'
                        } border border-white/20`}>
                          {getExerciseTypeIcon(exercise.type)}
                        </div>
                        
                        {/* Exercise Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`text-xl font-bold ${
                              isAvailable ? 'text-white' : 'text-gray-300'
                            }`}>
                              {exercise.title}
                            </h3>
                            {isCompleted && (
                              <CheckCircle className="text-yellow-400" size={20} />
                            )}
                          </div>
                          
                          <div className={`text-sm ${
                            isAvailable ? 'text-white/80' : 'text-gray-400'
                          } mb-2`}>
                            {exercise.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            {exercise.meaning && ` • ${exercise.meaning}`}
                          </div>
                          
                          {/* Exercise Stats */}
                          {isAvailable && (
                            <div className="flex items-center space-x-4 text-sm">
                              {attempts > 0 && (
                                <div className="text-white/70">
                                  Attempts: {attempts}
                                </div>
                              )}
                              {score > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Star className="text-yellow-400" size={16} />
                                  <span className="text-yellow-400">{score}%</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      {isAvailable && (
                        <button
                          onClick={() => handleStartExercise(exercise)}
                          className={`group/btn flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                            isCompleted
                              ? 'bg-white/20 hover:bg-white/30 text-white'
                              : 'bg-white/90 hover:bg-white text-gray-900 hover:shadow-lg'
                          }`}
                        >
                          <Play size={18} />
                          <span>{isCompleted ? 'Practice' : 'Start'}</span>
                        </button>
                      )}
                    </div>
                    
                    {/* Exercise Number */}
                    <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCompleted 
                        ? 'bg-yellow-400 text-yellow-900'
                        : isAvailable 
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Completion Reward */}
        {skillProgress.percentage === 100 && (
          <div className="mt-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 border-2 border-yellow-400 shadow-xl">
            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-white text-2xl font-bold mb-2">Skill Mastered!</h3>
              <p className="text-yellow-100 text-lg mb-4">
                Congratulations! You've completed all exercises in {skill.name}
              </p>
              <div className="flex justify-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-white font-bold text-xl">+100 XP</div>
                  <div className="text-yellow-200">Completion Bonus</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-xl">🌟</div>
                  <div className="text-yellow-200">Achievement Unlocked</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillDetail;
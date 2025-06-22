import React from 'react';
import { Lock, CheckCircle } from 'lucide-react';

const SkillNode = ({ skill, progress, isUnlocked, onClick }) => {
  const isCompleted = progress.percentage === 100;
  
  return (
    <div 
      className={`group relative transition-all duration-300 transform hover:scale-105 ${
        isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
      }`}
      onClick={onClick}
    >
      {/* Main Node Container */}
      <div className={`relative bg-gradient-to-br ${
        isUnlocked 
          ? isCompleted 
            ? 'from-green-500 to-green-600 shadow-xl shadow-green-500/25'
            : `${skill.color} shadow-xl shadow-blue-500/25`
          : 'from-gray-600 to-gray-700 shadow-lg'
      } rounded-3xl p-8 border-4 ${
        isUnlocked 
          ? isCompleted 
            ? 'border-green-400'
            : skill.borderColor
          : 'border-gray-500'
      } overflow-hidden`}>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
        </div>
        
        {/* Lock Overlay for Locked Skills */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-3xl flex items-center justify-center">
            <div className="text-center">
              <Lock className="text-gray-300 mx-auto mb-2" size={40} />
              <div className="text-gray-300 text-sm font-medium">Locked</div>
            </div>
          </div>
        )}
        
        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 rounded-full p-2">
            <CheckCircle size={24} />
          </div>
        )}
        
        <div className="relative z-10 flex items-center space-x-6">
          {/* Skill Icon */}
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl ${
            isUnlocked 
              ? 'bg-white/20 backdrop-blur-sm'
              : 'bg-gray-500/20'
          } border border-white/20`}>
            {skill.icon}
          </div>
          
          {/* Skill Info */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-2xl font-bold mb-2 ${
              isUnlocked ? 'text-white' : 'text-gray-300'
            }`}>
              {skill.name}
            </h3>
            <p className={`text-sm mb-4 ${
              isUnlocked ? 'text-white/80' : 'text-gray-400'
            }`}>
              {skill.description}
            </p>
            
            {/* Progress Bar */}
            {isUnlocked && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/90 text-sm font-medium">
                    {progress.completed} / {progress.total} exercises
                  </span>
                  <span className="text-white/90 text-sm font-bold">
                    {progress.percentage}%
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full transition-all duration-500 relative"
                    style={{ width: `${progress.percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Unlock Requirement */}
            {!isUnlocked && skill.unlockRequirement && (
              <div className="text-gray-400 text-sm">
                Complete {skill.unlockRequirement.completedExercises} exercises in previous skill
              </div>
            )}
          </div>
          
          {/* Difficulty Stars */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex space-x-1">
              {[1, 2, 3].map((star) => (
                <div
                  key={star}
                  className={`w-3 h-3 rounded-full ${
                    isUnlocked 
                      ? star <= Math.ceil(skill.totalExercises / 4) 
                        ? 'bg-yellow-400' 
                        : 'bg-white/30'
                      : 'bg-gray-500'
                  }`}
                />
              ))}
            </div>
            <div className={`text-xs ${isUnlocked ? 'text-white/70' : 'text-gray-500'}`}>
              Level
            </div>
          </div>
        </div>
        
        {/* Hover Effect */}
        {isUnlocked && (
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 rounded-3xl"></div>
        )}
        
        {/* Click to Enter Indicator */}
        {isUnlocked && (
          <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-medium">
              Click to enter →
            </div>
          </div>
        )}
      </div>
      
      {/* Floating Animation for Unlocked Skills */}
      {isUnlocked && (
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
      )}
    </div>
  );
};

export default SkillNode;
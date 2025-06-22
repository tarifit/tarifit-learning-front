import React, { useState, useEffect } from 'react';
import { Trophy, Star, Flame, BookOpen, ArrowRight } from 'lucide-react';
import { SKILLS, isSkillUnlocked } from '../data/skillTreeData';
import { loadProgress, getSkillProgress, getNextLevelProgress, getOverallProgress } from '../utils/progressManager';
import SkillNode from './SkillNode';
import SkillDetail from './SkillDetail';
import ProgressDashboard from './ProgressDashboard';

const SkillTree = ({ onStartExercise }) => {
  const [progress, setProgress] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const userProgress = loadProgress();
    setProgress(userProgress);
  }, []);

  const refreshProgress = () => {
    const userProgress = loadProgress();
    setProgress(userProgress);
  };

  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const levelProgress = getNextLevelProgress(progress);
  const overallProgress = getOverallProgress(progress);

  const skillOrder = ['greetings', 'numbers', 'family', 'food', 'activities'];

  if (selectedSkill) {
    return (
      <SkillDetail
        skill={SKILLS[selectedSkill.toUpperCase()]}
        progress={progress}
        onBack={() => setSelectedSkill(null)}
        onStartExercise={onStartExercise}
        onProgressUpdate={refreshProgress}
      />
    );
  }

  if (showDashboard) {
    return (
      <ProgressDashboard
        progress={progress}
        onBack={() => setShowDashboard(false)}
        onResetProgress={refreshProgress}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header Section */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">×</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Arbre d'apprentissage Tarifit</h1>
                <p className="text-sm text-gray-400">Maîtrisez le Tarifit à travers des leçons interactives</p>
              </div>
            </div>
            
            {/* Right side */}
            <button
              onClick={() => setShowDashboard(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center space-x-2"
            >
              <Trophy size={16} />
              <span>Progression</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Dashboard Card */}
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Left side - Level badge */}
            <div className="flex items-center space-x-4 md:space-x-6">
              <div className="text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-base md:text-lg">{levelProgress.currentLevel}</span>
                </div>
                <div className="text-sm text-gray-400">Level {levelProgress.currentLevel}</div>
                <div className="text-xs text-gray-500">{levelProgress.currentXP} XP</div>
              </div>
            </div>

            {/* Right side - Stats */}
            <div className="flex space-x-6 md:space-x-8">
              <div className="text-center">
                <div className="flex items-center space-x-1 text-orange-400">
                  <Flame size={18} />
                  <span className="text-lg md:text-xl font-bold">{progress.currentStreak}</span>
                </div>
                <div className="text-sm text-gray-400">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-1 text-green-400">
                  <BookOpen size={18} />
                  <span className="text-lg md:text-xl font-bold">{overallProgress.completed}</span>
                </div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">XP Progress</span>
              <span className="text-sm text-gray-400">{levelProgress.progressInLevel} / {levelProgress.xpNeededForLevel} XP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${levelProgress.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Skill Cards */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {skillOrder.map((skillId, index) => {
              const skill = SKILLS[skillId.toUpperCase()];
              const skillProgress = getSkillProgress(skillId, progress);
              const isUnlocked = isSkillUnlocked(skillId, progress);
              const completionPercentage = Math.round((skillProgress.completedExercises / skillProgress.totalExercises) * 100);

              return (
                <div key={skillId} className="relative">
                  {/* Connecting line */}
                  {index < skillOrder.length - 1 && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-1 h-8 bg-gray-600 z-0"></div>
                  )}
                  
                  {/* Skill Card */}
                  <div 
                    className={`relative z-10 mb-8 rounded-2xl p-4 md:p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                      isUnlocked
                        ? index === 0
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg border-2 border-blue-400 hover:shadow-xl'
                          : index === 1
                          ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg hover:shadow-xl'
                          : index === 2
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg hover:shadow-xl'
                          : index === 3
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg hover:shadow-xl'
                          : 'bg-gradient-to-r from-pink-500 to-pink-600 shadow-lg hover:shadow-xl'
                        : 'bg-gray-700 border border-gray-600'
                    }`}
                    onClick={() => isUnlocked && setSelectedSkill(skillId)}
                  >
                    <div className="flex items-center justify-between">
                      {/* Left - Icon */}
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center ${
                        isUnlocked ? 'bg-white bg-opacity-20' : 'bg-gray-600'
                      }`}>
                        <span className={`${isUnlocked ? '' : 'opacity-50'} text-xl md:text-2xl`}>{skill.icon}</span>
                      </div>

                      {/* Center - Content */}
                      <div className="flex-1 mx-3 md:mx-6">
                        <div className="text-left">
                          <h3 className={`text-lg md:text-xl font-bold mb-1 ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                            {skill.name}
                          </h3>
                          <p className={`text-xs md:text-sm mb-2 md:mb-3 ${isUnlocked ? 'text-white text-opacity-80' : 'text-gray-500'}`}>
                            {skill.description}
                          </p>
                          
                          {isUnlocked ? (
                            <div>
                              <div className="text-xs md:text-sm text-white text-opacity-90 mb-2">
                                {skillProgress.completedExercises} / {skillProgress.totalExercises} exercises • {completionPercentage}%
                              </div>
                              <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                                <div 
                                  className="bg-white h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${completionPercentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                              <span className="text-xs md:text-sm text-gray-400">Locked</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right - Level dots */}
                      <div className="flex flex-col space-y-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                              isUnlocked ? 'bg-yellow-400' : 'bg-gray-500'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Lock overlay for locked skills */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-gray-800 bg-opacity-50 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <div className="text-sm text-gray-400">
                            Complete previous skill
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTree;
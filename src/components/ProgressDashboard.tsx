import React, { useState } from 'react';
import { ArrowLeft, Trophy, Star, Flame, Target, Award, RotateCcw, AlertTriangle } from 'lucide-react';
import { SKILLS } from '../data/skillTreeData';
import { getSkillProgress, getNextLevelProgress, getOverallProgress, resetProgress, ACHIEVEMENT_DEFINITIONS } from '../utils/progressManager';

const ProgressDashboard = ({ progress, onBack, onResetProgress }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const levelProgress = getNextLevelProgress(progress);
  const overallProgress = getOverallProgress(progress);

  const handleResetProgress = () => {
    resetProgress();
    onResetProgress();
    setShowResetConfirm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getAchievementInfo = (achievementId) => {
    return ACHIEVEMENT_DEFINITIONS[achievementId] || {
      title: 'Unknown Achievement',
      description: 'Achievement description not found',
      icon: '🏆',
      xp: 0
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>Back to Skill Tree</span>
          </button>
          
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl transition-all duration-200 border border-red-500/30"
          >
            <RotateCcw size={16} />
            <span>Reset Progress</span>
          </button>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl p-6 max-w-md mx-4 border border-gray-600">
              <div className="text-center">
                <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
                <h3 className="text-white text-xl font-bold mb-2">Reset All Progress?</h3>
                <p className="text-gray-400 mb-6">
                  This will permanently delete all your progress, including XP, completed exercises, and achievements. This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetProgress}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition-all duration-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Title */}
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl font-bold mb-2">Your Progress Dashboard</h1>
          <p className="text-gray-400 text-lg">Track your Tarifit learning journey</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Level Card */}
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 border border-yellow-400/50 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <Star className="text-white" size={32} />
              <div>
                <div className="text-white text-2xl font-bold">Level {levelProgress.currentLevel}</div>
                <div className="text-yellow-100 text-sm">Current Level</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-yellow-100 text-sm">
                <span>{levelProgress.progressInLevel} XP</span>
                <span>{levelProgress.xpNeededForLevel} XP</span>
              </div>
              <div className="w-full bg-yellow-700/30 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress.percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* XP Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 border border-blue-400/50 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="text-white" size={32} />
              <div>
                <div className="text-white text-2xl font-bold">{progress.totalXP}</div>
                <div className="text-blue-100 text-sm">Total XP</div>
              </div>
            </div>
            <div className="text-blue-100 text-sm">
              Next level: {levelProgress.nextLevelXP - levelProgress.currentXP} XP to go
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 border border-orange-400/50 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <Flame className="text-white" size={32} />
              <div>
                <div className="text-white text-2xl font-bold">{progress.currentStreak}</div>
                <div className="text-orange-100 text-sm">Day Streak</div>
              </div>
            </div>
            <div className="text-orange-100 text-sm">
              Last study: {formatDate(progress.lastStudyDate)}
            </div>
          </div>

          {/* Overall Progress Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 border border-green-400/50 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="text-white" size={32} />
              <div>
                <div className="text-white text-2xl font-bold">{overallProgress.percentage}%</div>
                <div className="text-green-100 text-sm">Overall Progress</div>
              </div>
            </div>
            <div className="text-green-100 text-sm">
              {overallProgress.completed} of {overallProgress.total} exercises
            </div>
          </div>
        </div>

        {/* Skills Progress */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 mb-8 border border-gray-600/50 shadow-xl">
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center space-x-2">
            <Award className="text-purple-400" size={28} />
            <span>Skills Progress</span>
          </h2>
          
          <div className="space-y-4">
            {Object.keys(SKILLS).map((skillKey) => {
              const skill = SKILLS[skillKey];
              const skillProgress = getSkillProgress(skill.id, progress);
              
              return (
                <div key={skill.id} className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-xl">
                  <div className="text-3xl">{skill.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white font-semibold">{skill.name}</h3>
                      <span className="text-gray-400 text-sm">
                        {skillProgress.completed}/{skillProgress.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className={`bg-gradient-to-r ${skill.color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${skillProgress.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-white font-bold text-lg">
                    {skillProgress.percentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600/50 shadow-xl">
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center space-x-2">
            <Trophy className="text-yellow-400" size={28} />
            <span>Achievements ({progress.achievements.length})</span>
          </h2>
          
          {progress.achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progress.achievements.map((achievementId) => {
                const achievement = getAchievementInfo(achievementId);
                return (
                  <div key={achievementId} className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-4 border border-yellow-400/30">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <h3 className="text-white font-semibold">{achievement.title}</h3>
                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                        <div className="text-yellow-400 text-xs font-medium">+{achievement.xp} XP</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="text-gray-500 mx-auto mb-4" size={64} />
              <h3 className="text-gray-400 text-xl font-semibold mb-2">No Achievements Yet</h3>
              <p className="text-gray-500">Complete exercises to unlock achievements!</p>
            </div>
          )}
        </div>

        {/* Study Tips */}
        <div className="mt-8 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-400/30">
          <h3 className="text-white text-xl font-bold mb-4">💡 Study Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="text-purple-200">
              <strong>Daily Practice:</strong> Study a little bit every day to maintain your streak and earn bonus XP.
            </div>
            <div className="text-purple-200">
              <strong>Perfect Scores:</strong> Get 100% on exercises for bonus XP and better retention.
            </div>
            <div className="text-purple-200">
              <strong>First Try Bonus:</strong> Try to get exercises right on your first attempt for extra points.
            </div>
            <div className="text-purple-200">
              <strong>Review:</strong> Revisit completed exercises to reinforce your learning.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
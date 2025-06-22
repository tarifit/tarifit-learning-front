import React, { useState, useEffect } from 'react';
import { X, Trophy } from 'lucide-react';
import { ACHIEVEMENT_DEFINITIONS } from '../utils/progressManager';

const AchievementNotification = ({ achievementId, onClose, visible }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 5000); // Auto-close after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  if (!achievementId || !visible) return null;

  const achievement = ACHIEVEMENT_DEFINITIONS[achievementId];
  if (!achievement) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      {/* Confetti Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="celebration-confetti" />
        ))}
      </div>
      
      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 shadow-2xl border-2 border-yellow-400 max-w-sm animate-bounce-in">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse-glow">
              <Trophy className="text-yellow-900" size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Achievement Unlocked!</h3>
              <p className="text-yellow-100 text-sm">+{achievement.xp} XP</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-yellow-200 hover:text-white transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-4xl animate-float">{achievement.icon}</div>
          <div>
            <h4 className="text-white font-semibold text-xl">{achievement.title}</h4>
            <p className="text-yellow-100 text-sm">{achievement.description}</p>
          </div>
        </div>
        
        {/* Celebration sparkles */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full animate-sparkle" style={{ animationDelay: '0s' }} />
        <div className="absolute top-4 right-8 w-1 h-1 bg-white rounded-full animate-sparkle" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-white rounded-full animate-sparkle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-2 right-4 w-1 h-1 bg-white rounded-full animate-sparkle" style={{ animationDelay: '1.5s' }} />
      </div>
    </div>
  );
};

export default AchievementNotification;
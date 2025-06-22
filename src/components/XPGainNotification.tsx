import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

const XPGainNotification = ({ xpGained, onComplete, visible }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (visible && xpGained > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onComplete();
        }, 1000); // Wait for animation to complete
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [visible, xpGained, onComplete]);

  if (!visible || xpGained <= 0) return null;

  return (
    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none ${
      isVisible ? 'animate-xp-gain' : 'opacity-0'
    }`}>
      <div className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl border-2 border-green-400">
        <Plus size={24} className="text-green-200" />
        <span className="text-2xl font-bold">{xpGained} XP</span>
      </div>
      
      {/* Sparkle effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default XPGainNotification;
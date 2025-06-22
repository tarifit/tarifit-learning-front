import React, { useState, useEffect } from 'react';
import SkillTree from './components/SkillTree';
import SkillTreeExercise from './components/SkillTreeExercise';
import LoginModal from './components/LoginModal';
import './App.css';
import TarifitModal from './components/TarifitModal';
import ErrorBoundary from './ErrorBoundary';
import AuthService from './services/AuthService';
import UserService from './services/UserService';

function App() {
  // Suppress Web3/MetaMask errors
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('provider is disconnected') ||
          event.error?.message?.includes('MetaMask') ||
          event.error?.message?.includes('web3')) {
        event.preventDefault();
        console.warn('Web3 error suppressed:', event.error.message);
      }
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('provider is disconnected')) {
        event.preventDefault();
        console.warn('Web3 promise rejection suppressed:', event.reason.message);
      }
    });
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'skillTree', or 'oldSystem'
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentSkillId, setCurrentSkillId] = useState(null);
  const [exerciseCallback, setExerciseCallback] = useState(null);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = AuthService.isAuthenticated();
        if (isAuthenticated) {
          const currentUser = await AuthService.getCurrentUser();
          if (currentUser) {
            const userProfile = await UserService.getUserProfile();
            setUser({ ...currentUser, profile: userProfile });
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        AuthService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleStartExercise = (exercise, skillId, onProgressUpdate) => {
    setCurrentExercise(exercise);
    setCurrentSkillId(skillId);
    setExerciseCallback(() => onProgressUpdate);
  };

  const handleExerciseComplete = (wasCorrect) => {
    if (exerciseCallback) {
      exerciseCallback();
    }
  };

  const handleCloseExercise = () => {
    setCurrentExercise(null);
    setCurrentSkillId(null);
    setExerciseCallback(null);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setCurrentView('welcome');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  // Welcome Screen - shows the main button that leads to Skill Tree
  if (currentView === 'welcome') {
    return (
      <div className="App">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 relative">
          {/* User Authentication Section */}
          <div className="absolute top-4 right-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.profile?.name || user.name || user.email}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </button>
            )}
          </div>

          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <span className="text-white font-bold text-3xl">ⵣ</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Apprentissage du Tarifit - v2.0</h1>
              <p className="text-gray-600 text-lg">Maîtrisez le Tarifit à travers des leçons interactives</p>
            </div>
            
            <div className="space-y-4">
              {/* New Skill Tree Button */}
              <button
                onClick={() => setCurrentView('skillTree')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                🌟 Nouveau Système d'Apprentissage
              </button>
              
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-4">
                  Parcours complet avec 5 compétences, système XP et succès
                </p>
              </div>
              
              {/* Old System Button */}
              <button
                onClick={() => setCurrentView('oldSystem')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                📚 Exercices Classiques (Pronoms)
              </button>
              
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  20 exercices de pronoms traditionnels
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  // Old System View
  if (currentView === 'oldSystem') {
    return (
      <div className="App">
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setCurrentView('welcome')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200"
          >
            ← Retour à l'accueil
          </button>
        </div>
        <TarifitModal />
      </div>
    );
  }

  // Skill Tree View
  return (
    <ErrorBoundary>
      <div className="App">
      {/* Navigation Header */}
      <div className="fixed top-4 left-4 z-40">
        <button
          onClick={() => setCurrentView('welcome')}
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-sm"
        >
          ← Accueil
        </button>
      </div>
      
      {/* Main Skill Tree View */}
      <SkillTree onStartExercise={handleStartExercise} />
      
      {/* Exercise Modal */}
      {currentExercise && (
        <SkillTreeExercise
          exercise={currentExercise}
          skillId={currentSkillId}
          onClose={handleCloseExercise}
          onComplete={handleExerciseComplete}
        />
      )}
      
      {/* Switch to Old System Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setCurrentView('oldSystem')}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-sm"
        >
          Exercices classiques
        </button>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
    </ErrorBoundary>
  );
}

export default App;
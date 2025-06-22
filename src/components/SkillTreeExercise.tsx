import React, { useState } from 'react';
import { X, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { completeExercise } from '../utils/progressManager';

const SkillTreeExercise = ({ exercise, skillId, onClose, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [userInput, setUserInput] = useState('');
  const [builtSentence, setBuiltSentence] = useState([]);
  const [availableWords, setAvailableWords] = useState(exercise.scrambledWords || []);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const playAudio = (text) => {
    if (!audioEnabled) return;
    
    // Simulate audio playback for now
    console.log(`Playing audio: ${text}`);
    
    // In a real implementation, you would:
    // const utterance = new SpeechSynthesisUtterance(text);
    // utterance.lang = 'ber';
    // speechSynthesis.speak(utterance);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSentenceWordClick = (word) => {
    setBuiltSentence(prev => [...prev, word]);
    setAvailableWords(prev => prev.filter(w => w !== word));
  };

  const handleBuiltWordClick = (wordIndex) => {
    const wordToRemove = builtSentence[wordIndex];
    setBuiltSentence(prev => prev.filter((_, index) => index !== wordIndex));
    setAvailableWords(prev => [...prev, wordToRemove]);
  };

  const resetSentenceBuilding = () => {
    setBuiltSentence([]);
    setAvailableWords(exercise.scrambledWords || []);
  };

  const canContinue = () => {
    switch (exercise.type) {
      case 'multiple-choice':
      case 'picture-matching':
        return !!selectedAnswer;
      case 'translation':
        return userInput.trim().length > 0;
      case 'sentence-building':
        return builtSentence.length === (exercise.scrambledWords?.length || 0);
      default:
        return false;
    }
  };

  const handleContinue = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    let correct = false;
    
    switch (exercise.type) {
      case 'multiple-choice':
      case 'picture-matching':
        correct = selectedAnswer === exercise.correct;
        break;
      case 'translation':
        correct = userInput.toLowerCase().trim() === exercise.correct.toLowerCase();
        break;
      case 'sentence-building':
        correct = JSON.stringify(builtSentence) === JSON.stringify(exercise.correctOrder);
        break;
      default:
        correct = false;
    }
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      const isFirstTry = newAttempts === 1;
      const isPerfectScore = isFirstTry; // For simplicity, perfect score = first try
      
      // Update progress
      completeExercise(exercise.id, skillId, true, isFirstTry, isPerfectScore);
    }
  };

  const handleNext = () => {
    onComplete(isCorrect);
    onClose();
  };

  const renderExercise = () => {
    switch (exercise.type) {
      case 'picture-matching':
        return (
          <div className="text-center">
            {exercise.imageUrl && (
              <div className="mb-8">
                <img 
                  src={exercise.imageUrl} 
                  alt={exercise.meaning}
                  className="w-64 h-64 mx-auto rounded-2xl object-cover shadow-lg"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9IiNGM0Y0RjYiLz48cmVjdCB4PSI2NCIgeT0iOTYiIHdpZHRoPSIxMjgiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjRDE5M0Y2Ii8+PHRleHQgeD0iMTI4IiB5PSIxMzYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2U8L3RleHQ+PC9zdmc+';
                  }}
                />
                <p className="text-gray-400 text-sm mt-4">{exercise.meaning}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {exercise.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-5 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                    selectedAnswer === option
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white border-2 border-pink-400 shadow-lg'
                      : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-2 border-gray-600/50 hover:from-gray-600 hover:to-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'multiple-choice':
        return (
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-600/30 mb-8">
              <div className="text-white text-2xl font-bold">{exercise.question}</div>
              {exercise.meaning && (
                <div className="text-gray-400 text-sm mt-2">{exercise.meaning}</div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {exercise.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-5 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                    selectedAnswer === option
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-2 border-orange-400 shadow-lg'
                      : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-2 border-gray-600/50 hover:from-gray-600 hover:to-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'translation':
        return (
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-600/30 mb-8">
              <div className="text-white text-2xl font-bold mb-2">{exercise.question}</div>
              <div className="text-gray-400 text-sm">Translate to Tarifit</div>
            </div>
            
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your answer..."
              className="w-full p-5 rounded-2xl text-xl text-center bg-gradient-to-r from-gray-700 to-gray-800 text-white border-2 border-gray-600/50 focus:border-purple-400 focus:outline-none"
            />
          </div>
        );
        
      case 'sentence-building':
        return (
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-4 shadow-xl border border-gray-600/30 mb-6">
              <div className="text-gray-400 text-sm mb-2">{exercise.context}</div>
              <div className="text-blue-400 text-sm">{exercise.meaning}</div>
            </div>
            
            {/* Built sentence display */}
            <div className="mb-6">
              <div className="text-gray-400 text-sm mb-2">Built Sentence</div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 min-h-[80px] flex items-center justify-center">
                {builtSentence.length === 0 ? (
                  <div className="text-gray-500 text-lg italic">Click words to build sentence...</div>
                ) : (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {builtSentence.map((word, index) => (
                      <button
                        key={`built-${word}-${index}`}
                        onClick={() => handleBuiltWordClick(index)}
                        className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white px-4 py-2 rounded-xl font-medium hover:from-emerald-500 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {builtSentence.length > 0 && (
                <button
                  onClick={resetSentenceBuilding}
                  className="text-gray-400 text-sm hover:text-white transition-colors underline mt-2"
                >
                  Reset
                </button>
              )}
            </div>
            
            {/* Available words */}
            <div>
              <div className="text-gray-400 text-sm mb-2">Available Words</div>
              <div className="flex flex-wrap gap-3 justify-center">
                {availableWords.map((word, index) => (
                  <button
                    key={`available-${word}-${index}`}
                    onClick={() => handleSentenceWordClick(word)}
                    className="px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-gray-600 to-gray-700 text-white border-2 border-gray-500 hover:border-emerald-400"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return <div className="text-white text-center">Exercise type not implemented yet</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-gray-900 rounded-3xl w-full max-w-2xl mx-auto relative shadow-2xl border border-gray-700/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-800 to-gray-850">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-700/50 transition-all duration-200"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="text-white text-xl font-bold">{exercise.title}</div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2 rounded-xl transition-all ${audioEnabled ? 'text-blue-400' : 'text-gray-500'}`}
            >
              {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-700/50 transition-all duration-200"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {renderExercise()}

          {/* Feedback section */}
          {showFeedback && (
            <div className="mt-8">
              <div className={`flex items-center space-x-3 mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  {isCorrect ? '✓' : '✗'}
                </div>
                <span className="text-xl font-bold">
                  {isCorrect ? 'Excellent!' : 'Not quite right'}
                </span>
              </div>
              
              {!isCorrect && (
                <div className="text-red-400 mb-4">
                  <div className="font-semibold mb-2">Correct answer:</div>
                  <div className="text-red-300">
                    {exercise.type === 'sentence-building' ? 
                      exercise.correctOrder?.join(' ') : 
                      exercise.correct
                    }
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-8">
            {!showFeedback ? (
              <button
                onClick={handleContinue}
                disabled={!canContinue()}
                className={`w-full py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform ${
                  canContinue()
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl hover:scale-[1.02]'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                CHECK ANSWER
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-5 rounded-2xl text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                CONTINUE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTreeExercise;
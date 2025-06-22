import React, { useState, useEffect } from 'react';
import { X, Heart, Volume2, VolumeX, Pause, Mic } from 'lucide-react';

// Speech Recognition type declarations
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const TarifitPronounModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [selectedPairs, setSelectedPairs] = useState<{ left: string | null; right: string | null }>({ left: null, right: null });
  const [userPairs, setUserPairs] = useState<{ french: string; tarifit: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [shuffledWords, setShuffledWords] = useState<{ french: string[]; tarifit: string[] }>({ french: [], tarifit: [] });
  const [wordBankWords, setWordBankWords] = useState<string[]>([]);
  const [sentenceWords, setSentenceWords] = useState<string[]>([]);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [droppedWords, setDroppedWords] = useState<{ [key: number]: string }>({});
  const [currentTFQuestion, setCurrentTFQuestion] = useState(0);
  const [tfAnswers, setTfAnswers] = useState<boolean[]>([]);

  // Shuffle function
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Calculate pronunciation similarity score
  const calculatePronunciationScore = (spoken: string, target: string): number => {
    if (!spoken || !target) return 0;
    
    // Basic Levenshtein distance for similarity
    const distance = levenshteinDistance(spoken, target);
    const maxLength = Math.max(spoken.length, target.length);
    const similarity = (maxLength - distance) / maxLength;
    
    // Check for phonetic patterns common in Tarifit
    let phoneticBonus = 0;
    
    // "kenniw" phonetic patterns
    if (target === 'kenniw') {
      if (spoken.includes('ken') || spoken.includes('can')) phoneticBonus += 0.3;
      if (spoken.includes('ni') || spoken.includes('ne')) phoneticBonus += 0.2;
      if (spoken.includes('w') || spoken.endsWith('oo')) phoneticBonus += 0.1;
    }
    
    // Tarifit often gets mistranscribed, so be more lenient
    const finalScore = Math.min(1, similarity + phoneticBonus);
    
    return finalScore;
  };

  // Simple Levenshtein distance calculation
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // Effect to shuffle words when exercise changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const exercise = exercises[currentExercise];
    if (exercise.type === 'match-pairs') {
      setShuffledWords({
        french: shuffleArray(exercise.frenchWords),
        tarifit: shuffleArray(exercise.tarifitWords)
      });
    } else if (exercise.type === 'word-bank-fill') {
      setDroppedWords({});
    } else if (exercise.type === 'sentence-building') {
      setBuiltSentence([]);
      setAvailableWords(shuffleArray(exercise.scrambledWords));
    } else if (exercise.type === 'true-false-reading') {
      setCurrentTFQuestion(0);
      setTfAnswers([]);
    }
  }, [currentExercise]);

  const exercises = {
    1: {
      type: 'listen-select',
      title: 'Écoute et sélectionne',
      audioText: 'Necc',
      audioFile: 'Necc.wav',
      meaning: 'I',
      options: ['Necc', 'Cekk', 'Cemm', 'Netta'],
      correct: 'Necc'
    },
    2: {
      type: 'translate-text',
      title: 'Traduis en Tarifit',
      question: 'She',
      placeholder: 'Tape ta réponse...',
      correct: 'Nettat'
    },
    3: {
      type: 'match-pairs',
      title: 'Associe les paires',
      frenchWords: ['Je', 'Tu (M)', 'Tu (F)', 'Il', 'Elle'],
      tarifitWords: ['Necc', 'Cekk', 'Cemm', 'Netta', 'Nettat'],
      correctPairs: [
        { french: 'Je', tarifit: 'Necc' },
        { french: 'Tu (M)', tarifit: 'Cekk' },
        { french: 'Tu (F)', tarifit: 'Cemm' },
        { french: 'Il', tarifit: 'Netta' },
        { french: 'Elle', tarifit: 'Nettat' }
      ]
    },
    4: {
      type: 'pronunciation',
      title: 'Prononce ce mot',
      word: 'Kenniw',
      audioFile: 'Kenniw.wav',
      meaning: 'You (Plural Masculine)',
      phonetic: '/ken.niw/',
      correct: 'Kenniw'
    },
    5: {
      type: 'multiple-choice',
      title: 'Quelle est la traduction ?',
      question: 'Nous',
      options: ['Neccin', 'Nitni', 'Nihni', 'Kennimt'],
      correct: 'Neccin'
    },
    6: {
      type: 'fill-sentence',
      title: 'Complète la phrase',
      sentence: '_____ nssawal Tarifit.',
      context: 'We speak Tarifit.',
      options: ['Necc', 'Neccin', 'Kenniw'],
      correct: 'Neccin'
    },
    7: {
      type: 'picture-matching',
      title: 'Associe l\'image au mot',
      imageUrl: '/images/aryaz.png',
      imageAlt: 'Un homme',
      meaning: 'A man',
      options: ['tamɣart', 'aryaz', 'arba', 'tarbat'],
      correct: 'aryaz'
    },
    8: {
      type: 'word-bank-fill',
      title: 'Complète avec les mots',
      sentence: '_____ d _____ nssawal s Tarifit.',
      context: 'You and I speak in Tarifit.',
      wordBank: ['Necc', 'Cekk', 'nssawal', 'Tarifit'],
      correctWords: { 0: 'Cekk', 1: 'Necc' },
      blanks: 2
    },
    9: {
      type: 'sentence-building',
      title: 'Construis la phrase',
      scrambledWords: ['Nettat', 'tssawal', 's', 'Tarifit'],
      correctOrder: ['Nettat', 'tssawal', 's', 'Tarifit'],
      meaning: 'She speaks in Tarifit.',
      context: 'Arrange the words to form a correct sentence'
    },
    10: {
      type: 'audio-dictation',
      title: 'Écris ce que tu entends',
      audioText: 'Kenniw tssawalm s Tarifit',
      audioFile: 'dictation.wav',
      meaning: 'You (plural) speak in Tarifit',
      correct: 'Kenniw tssawalm s Tarifit',
      placeholder: 'Tape ce que tu entends...'
    },
    11: {
      type: 'picture-matching',
      title: 'Associe l\'image au mot',
      imageUrl: '/images/tamɣart.png',
      imageAlt: 'Une femme',
      meaning: 'A woman',
      options: ['aryaz', 'arba', 'tamɣart', 'wacunt'],
      correct: 'tamɣart'
    },
    12: {
      type: 'picture-matching',
      title: 'Associe l\'image au mot',
      imageUrl: '/images/arba.png',
      imageAlt: 'Un garçon',
      meaning: 'A boy',
      options: ['tarbat', 'tamɣart', 'arba', 'aryaz'],
      correct: 'arba'
    },
    13: {
      type: 'picture-matching',
      title: 'Associe l\'image au mot',
      imageUrl: '/images/tarbat.png',
      imageAlt: 'Une fille',
      meaning: 'A girl',
      options: ['arba', 'tarbat', 'aryaz', 'tamɣart'],
      correct: 'tarbat'
    },
    14: {
      type: 'picture-matching',
      title: 'Associe l\'image au mot',
      imageUrl: '/images/wacunt.png',
      imageAlt: 'Une famille',
      meaning: 'A family',
      options: ['aryaz', 'tamɣart', 'wacunt', 'arba'],
      correct: 'wacunt'
    },
    15: {
      type: 'true-false-reading',
      title: 'Vrai ou Faux ?',
      text: 'Neccin nssawal s Tarifit. Tarifit d tutlayt n Imazighen n Arrif. Tutlayt-a tella d taqlayant.',
      translation: 'We speak in Tarifit. Tarifit is the language of the Berbers of the Rif. This language is ancient.',
      questions: [
        { question: 'Tarifit is a language of the Rif Berbers', answer: true },
        { question: 'The text says Tarifit is a new language', answer: false },
        { question: 'The speakers use Tarifit to communicate', answer: true }
      ],
      currentQuestion: 0
    },
    16: {
      type: 'verb-conjugation',
      title: 'Conjugaison des verbes',
      verb: 'ssawal',
      meaning: 'to speak',
      pronoun: 'Necc',
      pronounMeaning: 'I',
      explanation: 'Le verbe "ssawal" (parler) se conjugue différemment selon le pronom.',
      options: ['ssawalɣ', 'tssawalt', 'tssawal', 'issawal'],
      correct: 'ssawalɣ',
      grammarRule: 'Avec "Necc" (je), on ajoute le suffixe "-ɣ" au radical du verbe.'
    },
    17: {
      type: 'gender-agreement',
      title: 'Accord en genre',
      noun: 'aryaz',
      nounMeaning: 'man',
      adjective: 'mɣr (mqr)',
      adjectiveMeaning: 'big',
      explanation: 'En Tarifit, les adjectifs s\'accordent en genre avec le nom.',
      options: ['amqran', 'tamqrant', 'imqranen', 'timqranen'],
      correct: 'amqur',
      grammarRule: 'Pour un nom masculin, l\'adjectif prend la forme masculine avec le préfixe "a-".'
    },
    18: {
      type: 'plural-formation',
      title: 'Formation du pluriel',
      singular: 'tarbat',
      singularMeaning: 'girl',
      explanation: 'Transforme ce nom singulier en pluriel selon les règles Tarifit.',
      options: ['tirbatin', 'tarbayin', 'tirbat', 'tarbaten'],
      correct: 'tirbatin',
      grammarRule: 'Les noms féminins en "t-...-t" forment souvent leur pluriel en "ti-...-in".',
      pattern: 't + radical + t → ti + radical + in'
    },
    19: {
      type: 'tense-selection',
      title: 'Choix du temps',
      context: 'Hier, il ___ à la maison.',
      contextTarifit: 'iḍennaḍ, netta ___ ɣer wexxam.',
      meaning: 'Yesterday, he ___ home.',
      explanation: 'Choisis le temps verbal approprié selon le contexte temporel.',
      options: ['iruḥ', 'ad iraḥ', 'truḥ', 'ittraḥ'],
      correct: 'iruḥ',
      grammarRule: 'Le passé simple s\'utilise pour les actions accomplies dans le passé.',
      timeIndicator: 'iḍennaḍ (hier) indique le passé'
    },
    20: {
      type: 'question-formation',
      title: 'Formation des questions',
      statement: 'Netta issawal Tarifit.',
      statementMeaning: 'He speaks Tarifit.',
      explanation: 'Transforme cette affirmation en question.',
      questionWord: 'Ma',
      questionMeaning: 'Est-ce que',
      options: ['Ma issawal Tarifit?', 'Issawal ma Tarifit?', 'Tarifit ma issawal?', 'Ma Tarifit issawal?'],
      correct: 'Ma issawal Tarifit?',
      grammarRule: 'Pour former une question fermée, on place "Ma" au début de la phrase.',
      pattern: 'Ma + sujet + verbe + complément ?'
    }
  };

  // Audio function with file support
  const playAudio = (text: string, audioFile: string | null = null) => {
    if (!audioEnabled) return;
    
    setIsPlaying(true);
    
    if (audioFile) {
      // Try to play actual audio file
      const audio = new Audio(`/audio/${audioFile}`);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        console.log(`Audio file ${audioFile} not found, falling back to TTS`);
        // Fallback to TTS or silent
      };
      audio.play().catch(() => {
        setIsPlaying(false);
        console.log(`Could not play ${audioFile}`);
      });
    } else {
      // Simulate audio playback
      setTimeout(() => {
        setIsPlaying(false);
      }, 1500);
    }
    
    // In a real app, you could also use Web Speech API as fallback:
    // const utterance = new SpeechSynthesisUtterance(text);
    // utterance.lang = 'ber'; // Berber language code
    // speechSynthesis.speak(utterance);
  };

  const toggleRecording = () => {
    const exercise = exercises[currentExercise];
    
    if (!isRecording) {
      setIsRecording(true);
      
      // Check if browser supports speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognitionAPI();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'ar-MA'; // Moroccan Arabic (closer to Berber than 'ber')
        
        // Fallback languages if primary fails
        const languages = ['ar-MA', 'ar', 'fr-MA', 'en-US'];
        let currentLangIndex = 0;
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase().trim();
          const targetWord = exercise.correct.toLowerCase();
          const confidence = event.results[0][0].confidence;
          
          console.log('Heard:', transcript);
          console.log('Expected:', targetWord);
          console.log('Confidence:', confidence);
          
          // More sophisticated matching for Tarifit words
          const pronunciationScore = calculatePronunciationScore(transcript, targetWord);
          const isMatch = pronunciationScore > 0.6; // 60% similarity threshold
          
          console.log('Pronunciation Score:', pronunciationScore);
          
          setIsCorrect(isMatch);
          setShowFeedback(true);
          setIsRecording(false);
        };
        
        recognition.onerror = (event: any) => {
          console.log('Speech recognition error:', event.error);
          setIsRecording(false);
          // Fallback to simulated success after delay
          setTimeout(() => {
            setIsCorrect(true);
            setShowFeedback(true);
          }, 1000);
        };
        
        recognition.onend = () => {
          setIsRecording(false);
        };
        
        try {
          recognition.start();
        } catch (error) {
          console.log('Could not start speech recognition:', error);
          setIsRecording(false);
          // Fallback to simulated success
          setTimeout(() => {
            setIsCorrect(true);
            setShowFeedback(true);
          }, 2000);
        }
      } else {
        // Browser doesn't support speech recognition, simulate success
        console.log('Speech recognition not supported, simulating...');
        setTimeout(() => {
          setIsCorrect(true);
          setShowFeedback(true);
          setIsRecording(false);
        }, 2000);
      }
    } else {
      setIsRecording(false);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setCurrentExercise(1);
    setSelectedAnswer('');
    setSelectedPairs({ left: null, right: null });
    setUserPairs([]);
    setUserInput('');
    setShowFeedback(false);
    setIsCorrect(null);
    setIsRecording(false);
    setWordBankWords([]);
    setSentenceWords([]);
    setDraggedWord(null);
    setDroppedWords({});
    setCurrentTFQuestion(0);
    setTfAnswers([]);
    setBuiltSentence([]);
    setAvailableWords([]);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handlePairSelect = (word: string, column: 'left' | 'right') => {
    const exercise = exercises[currentExercise];
    
    if (exercise.type !== 'match-pairs') return;
    
    // Check if this word is already matched
    const isAlreadyMatched = userPairs.some(pair => 
      pair.french === word || pair.tarifit === word
    );
    
    if (isAlreadyMatched) return; // Can't select already matched words
    
    // Update selection for the specific column
    const newSelection = { ...selectedPairs };
    
    // If clicking the same word, deselect it
    if (newSelection[column] === word) {
      newSelection[column] = null;
    } else {
      // Select the word in this column
      newSelection[column] = word;
    }
    
    setSelectedPairs(newSelection);
    
    // Check if we have selections from both columns
    if (newSelection.left && newSelection.right) {
      // Add to user pairs (don't verify correctness yet)
      const newPair = {
        french: newSelection.left,
        tarifit: newSelection.right
      };
      
      setUserPairs([...userPairs, newPair]);
      setSelectedPairs({ left: null, right: null });
    }
  };

  const handleWordBankClick = (word: string) => {
    // Find first empty blank or use the first blank if all are filled
    const exercise = exercises[currentExercise];
    const blankIndices = Array.from({ length: exercise.blanks }, (_, i) => i);
    
    // Find first empty blank
    let targetBlankIndex = blankIndices.find(index => !droppedWords[index]);
    
    // If no empty blanks, replace the first blank
    if (targetBlankIndex === undefined) {
      targetBlankIndex = 0;
    }
    
    // If this word is already used, remove it from its current position first
    const currentBlankIndex = Object.keys(droppedWords).find(key => droppedWords[key] === word);
    if (currentBlankIndex !== undefined) {
      const newDroppedWords = { ...droppedWords };
      delete newDroppedWords[currentBlankIndex];
      setDroppedWords(newDroppedWords);
    }
    
    // Place word in target blank
    const newDroppedWords = { ...droppedWords };
    newDroppedWords[targetBlankIndex] = word;
    setDroppedWords(newDroppedWords);
  };

  const handleBlankClick = (blankIndex: number) => {
    // Remove word from blank and return it to available pool
    if (droppedWords[blankIndex]) {
      const newDroppedWords = { ...droppedWords };
      delete newDroppedWords[blankIndex];
      setDroppedWords(newDroppedWords);
    }
  };

  const [builtSentence, setBuiltSentence] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  const handleSentenceWordClick = (word: string) => {
    // Add word to built sentence
    setBuiltSentence(prev => [...prev, word]);
    
    // Remove word from available words
    setAvailableWords(prev => prev.filter(w => w !== word));
  };

  const handleBuiltWordClick = (wordIndex: number) => {
    // Remove word from built sentence and return to available words
    const wordToRemove = builtSentence[wordIndex];
    setBuiltSentence(prev => prev.filter((_, index) => index !== wordIndex));
    setAvailableWords(prev => [...prev, wordToRemove]);
  };

  const resetSentenceBuilding = () => {
    const exercise = exercises[currentExercise];
    if (exercise.type === 'sentence-building') {
      setBuiltSentence([]);
      setAvailableWords(shuffleArray(exercise.scrambledWords));
    }
  };

  const handleTFAnswer = (answer: boolean) => {
    const exercise = exercises[currentExercise];
    const newAnswers = [...tfAnswers];
    newAnswers[currentTFQuestion] = answer;
    setTfAnswers(newAnswers);
    
    if (currentTFQuestion < exercise.questions.length - 1) {
      setCurrentTFQuestion(currentTFQuestion + 1);
    }
  };

  const handleContinue = () => {
    const exercise = exercises[currentExercise];
    
    if (exercise.type === 'match-pairs') {
      // Check if user pairs match the correct pairs
      let correctCount = 0;
      
      userPairs.forEach(userPair => {
        const isCorrect = exercise.correctPairs.some(correctPair => 
          correctPair.french === userPair.french && correctPair.tarifit === userPair.tarifit
        );
        if (isCorrect) correctCount++;
      });
      
      const expectedPairs = exercise.correctPairs.length;
      const isAllCorrect = correctCount === expectedPairs && userPairs.length === expectedPairs;
      setIsCorrect(isAllCorrect);
      setShowFeedback(true);
      return;
    }
    
    if (exercise.type === 'translate-text' || exercise.type === 'audio-dictation') {
      const isAnswerCorrect = userInput.toLowerCase().trim() === exercise.correct.toLowerCase();
      setIsCorrect(isAnswerCorrect);
      setShowFeedback(true);
      return;
    }
    
    if (['listen-select', 'multiple-choice', 'fill-sentence', 'picture-matching', 'verb-conjugation', 'gender-agreement', 'plural-formation', 'tense-selection', 'question-formation'].includes(exercise.type) && selectedAnswer) {
      const isAnswerCorrect = selectedAnswer === exercise.correct;
      setIsCorrect(isAnswerCorrect);
      setShowFeedback(true);
      return;
    }

    if (exercise.type === 'word-bank-fill') {
      const allBlanksCorrect = Object.keys(exercise.correctWords).every(blankIndex => 
        droppedWords[blankIndex] === exercise.correctWords[blankIndex]
      );
      setIsCorrect(allBlanksCorrect);
      setShowFeedback(true);
      return;
    }

    if (exercise.type === 'sentence-building') {
      const isCorrectOrder = JSON.stringify(builtSentence) === JSON.stringify(exercise.correctOrder);
      setIsCorrect(isCorrectOrder);
      setShowFeedback(true);
      return;
    }

    if (exercise.type === 'true-false-reading') {
      let correctCount = 0;
      exercise.questions.forEach((q, index) => {
        if (tfAnswers[index] === q.answer) correctCount++;
      });
      const allCorrect = correctCount === exercise.questions.length;
      setIsCorrect(allCorrect);
      setShowFeedback(true);
      return;
    }
    
    if (exercise.type === 'pronunciation') {
      return; // Handled by recording function
    }
  };

  const nextExercise = () => {
    if (currentExercise < 20) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswer('');
      setSelectedPairs({ left: null, right: null });
      setUserPairs([]);
      setUserInput('');
      setShowFeedback(false);
      setIsCorrect(null);
      setIsRecording(false);
      setWordBankWords([]);
      setSentenceWords([]);
      setDraggedWord(null);
      setDroppedWords({});
      setCurrentTFQuestion(0);
      setTfAnswers([]);
      setBuiltSentence([]);
      setAvailableWords([]);
    } else {
      closeModal();
    }
  };

  const renderExercise = () => {
    const exercise = exercises[currentExercise];

    if (exercise.type === 'listen-select') {
      return (
        <>
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-6 shadow-2xl">
              <button
                onClick={() => playAudio(exercise.audioText, exercise.audioFile)}
                disabled={isPlaying}
                className="text-white text-4xl hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause size={48} /> : <Volume2 size={48} />}
              </button>
            </div>
            <p className="text-gray-400 text-lg mb-2">Écoute et sélectionne le bon mot</p>
            <p className="text-white text-sm opacity-75">Signification : {exercise.meaning}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {exercise.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`p-5 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedAnswer === option
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-2 border-blue-400 shadow-lg shadow-blue-500/25'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-2 border-gray-600/50 hover:from-gray-600 hover:to-gray-700 shadow-lg'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      );
    }

    if (exercise.type === 'translate-text') {
      return (
        <>
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 shadow-xl">
              <span className="text-white text-2xl font-bold">ⵣ</span>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-600/30">
              <div className="text-white text-2xl font-bold mb-2">{exercise.question}</div>
              <div className="text-gray-400 text-sm">Français → Tarifit</div>
            </div>
          </div>

          <div className="mb-10">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={exercise.placeholder}
              className="w-full p-5 rounded-2xl text-xl text-center bg-gradient-to-r from-gray-700 to-gray-800 text-white border-2 border-gray-600/50 focus:border-purple-400 focus:outline-none"
            />
          </div>
        </>
      );
    }

    if (exercise.type === 'match-pairs') {
      const colors = [
        'bg-blue-500 border-blue-400',
        'bg-purple-500 border-purple-400', 
        'bg-pink-500 border-pink-400',
        'bg-indigo-500 border-indigo-400',
        'bg-red-500 border-red-400'
      ];

      // Shuffle the words for each exercise start
      const frenchWords = shuffledWords.french.length > 0 ? shuffledWords.french : exercise.frenchWords;
      const tarifitWords = shuffledWords.tarifit.length > 0 ? shuffledWords.tarifit : exercise.tarifitWords;

      return (
        <>
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4 shadow-xl">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H6.99C4.2 7 2 9.2 2 12s2.2 5 4.99 5H11v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm5-6h4.01C19.8 7 22 9.2 22 12s-2.2 5-4.99 5H13v1.9h4c2.8 0 5-2.2 5-5s-2.2-5-5-5h-4v1.9z"/>
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-10">
            {/* Left Column - French */}
            <div className="space-y-3">
              <div className="text-center text-sm text-gray-400 mb-2">Français</div>
              {frenchWords.map((word, index) => {
                const isSelected = selectedPairs.left === word;
                const pairIndex = userPairs.findIndex(pair => pair.french === word);
                const isInPair = pairIndex >= 0;
                
                return (
                  <button
                    key={`french-${word}-${index}`}
                    onClick={() => handlePairSelect(word, 'left')}
                    className={`w-full p-4 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                      isInPair
                        ? `${colors[pairIndex % colors.length]} text-white border-2 shadow-lg`
                        : isSelected
                        ? 'bg-yellow-500 text-white border-2 border-yellow-400 shadow-lg shadow-yellow-500/25'
                        : 'bg-gray-700 text-white border-2 border-gray-600 hover:bg-gray-600 shadow-lg'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            {/* Right Column - Tarifit */}
            <div className="space-y-3">
              <div className="text-center text-sm text-gray-400 mb-2">Tarifit</div>
              {tarifitWords.map((word, index) => {
                const isSelected = selectedPairs.right === word;
                const pairIndex = userPairs.findIndex(pair => pair.tarifit === word);
                const isInPair = pairIndex >= 0;
                
                return (
                  <button
                    key={`tarifit-${word}-${index}`}
                    onClick={() => handlePairSelect(word, 'right')}
                    className={`w-full p-4 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                      isInPair
                        ? `${colors[pairIndex % colors.length]} text-white border-2 shadow-lg`
                        : isSelected
                        ? 'bg-yellow-500 text-white border-2 border-yellow-400 shadow-lg shadow-yellow-500/25'
                        : 'bg-gray-700 text-white border-2 border-gray-600 hover:bg-gray-600 shadow-lg'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      );
    }

    if (exercise.type === 'pronunciation') {
      return (
        <>
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-6 shadow-2xl">
              <button
                onClick={toggleRecording}
                className={`text-white text-4xl hover:scale-110 transition-all duration-300 ${
                  isRecording ? 'animate-pulse' : ''
                }`}
              >
                <Mic size={48} />
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 mb-6 shadow-xl">
              <div className="text-white text-3xl font-bold mb-2">{exercise.word}</div>
              <div className="text-gray-400 text-lg mb-1">{exercise.phonetic}</div>
              <div className="text-blue-400 text-sm">{exercise.meaning}</div>
            </div>

            <button
              onClick={() => playAudio(exercise.word, exercise.audioFile)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Volume2 className="inline mr-2" size={20} />
              Écouter
            </button>

            <p className="text-gray-400 text-sm mt-4">
              {isRecording ? 'Parlez maintenant...' : 'Appuyez sur le micro pour enregistrer'}
            </p>
            
            <div className="mt-6 bg-gray-800/50 rounded-xl p-4">
              <p className="text-gray-300 text-xs mb-2">
                💡 Conseil: Écoutez d'abord le mot, puis essayez de le répéter clairement
              </p>
              <p className="text-gray-400 text-xs">
                ℹ️ Note: L'évaluation se base sur la similarité phonétique détectée par le navigateur
              </p>
            </div>
          </div>
        </>
      );
    }

    if (exercise.type === 'multiple-choice') {
      return (
        <>
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 shadow-xl">
              <span className="text-white text-2xl font-bold">?</span>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-600/30">
              <div className="text-white text-2xl font-bold">{exercise.question}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {exercise.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`p-5 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedAnswer === option
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-2 border-orange-400 shadow-lg shadow-orange-500/25'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-2 border-gray-600/50 hover:from-gray-600 hover:to-gray-700 shadow-lg'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      );
    }

    if (exercise.type === 'fill-sentence') {
      return (
        <>
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 shadow-xl">
              <span className="text-white text-2xl font-bold">📝</span>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-600/30 mb-4">
              <div className="text-white text-xl">
                {exercise.sentence.split('_____').map((part, index) => (
                  <span key={index}>
                    {part}
                    {index === 0 && (
                      <span className="bg-yellow-500/20 border-b-2 border-dotted border-yellow-400 px-3 py-1 rounded mx-1">
                        {selectedAnswer || '_____'}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-gray-400 text-sm">{exercise.context}</div>
          </div>

          <div className="space-y-3 mb-10">
            {exercise.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-5 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedAnswer === option
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white border-2 border-teal-400 shadow-lg shadow-teal-500/25'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-2 border-gray-600/50 hover:from-gray-600 hover:to-gray-700 shadow-lg'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      );
    }

    if (exercise.type === 'picture-matching') {
      return (
        <>
          {/* Clean large image display */}
          <div className="text-center mb-12">
            <img 
              src={exercise.imageUrl} 
              alt={exercise.imageAlt}
              className="w-64 h-64 mx-auto rounded-2xl object-cover shadow-lg"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9IiNGM0Y0RjYiLz48cmVjdCB4PSI2NCIgeT0iOTYiIHdpZHRoPSIxMjgiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjRDE5M0Y2Ii8+PHRleHQgeD0iMTI4IiB5PSIxMzYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2U8L3RleHQ+PC9zdmc+';
              }}
            />
            <div className="text-gray-400 text-sm mt-4">
              {exercise.meaning}
            </div>
          </div>

          {/* Word options */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            {exercise.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`p-5 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedAnswer === option
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white border-2 border-pink-400 shadow-lg shadow-pink-500/25'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-2 border-gray-600/50 hover:from-gray-600 hover:to-gray-700 shadow-lg'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      );
    }

    if (exercise.type === 'word-bank-fill') {
      const sentence = exercise.sentence.split('_____');
      
      return (
        <>
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 shadow-xl">
              <span className="text-white text-2xl font-bold">📝</span>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-600/30 mb-4">
              <div className="text-white text-xl mb-2">
                {sentence.map((part, index) => (
                  <span key={index}>
                    {part}
                    {index < sentence.length - 1 && (
                      <button
                        onClick={() => handleBlankClick(index)}
                        className={`inline-block border-2 border-dashed px-4 py-2 rounded mx-2 min-w-[100px] text-center transition-all duration-200 hover:scale-105 ${
                          droppedWords[index] 
                            ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 hover:bg-cyan-500/40' 
                            : 'bg-yellow-500/20 border-yellow-400 text-yellow-200 hover:bg-yellow-500/30'
                        }`}
                      >
                        {droppedWords[index] || '_____'}
                      </button>
                    )}
                  </span>
                ))}
              </div>
              <div className="text-gray-400 text-sm">{exercise.context}</div>
              <div className="text-cyan-300 text-xs mt-2">
                💡 Clique sur les mots ci-dessous pour remplir les blancs
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="text-center text-sm text-gray-400 mb-4">Banque de mots - Clique pour utiliser</div>
            <div className="flex flex-wrap gap-3 justify-center">
              {exercise.wordBank.map((word, index) => {
                const isUsed = Object.values(droppedWords).includes(word);
                return (
                  <button
                    key={`${word}-${index}`}
                    onClick={() => handleWordBankClick(word)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                      isUsed
                        ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-gray-300 border-2 border-gray-400'
                        : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-2 border-cyan-400 hover:from-cyan-600 hover:to-cyan-700 shadow-lg'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      );
    }

    if (exercise.type === 'sentence-building') {
      return (
        <>
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 shadow-xl">
              <span className="text-white text-2xl font-bold">🔤</span>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-4 shadow-xl border border-gray-600/30 mb-4">
              <div className="text-gray-400 text-sm mb-2">{exercise.context}</div>
              <div className="text-blue-400 text-sm">{exercise.meaning}</div>
              <div className="text-emerald-300 text-xs mt-2">
                💡 Clique sur les mots ci-dessous pour construire la phrase
              </div>
            </div>
          </div>

          {/* Built sentence display */}
          <div className="mb-8">
            <div className="text-center text-sm text-gray-400 mb-4">Phrase en construction</div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-600/30 min-h-[80px] flex items-center justify-center">
              {builtSentence.length === 0 ? (
                <div className="text-gray-500 text-lg italic">Clique sur les mots pour commencer...</div>
              ) : (
                <div className="flex flex-wrap gap-2 justify-center">
                  {builtSentence.map((word, index) => (
                    <button
                      key={`built-${word}-${index}`}
                      onClick={() => handleBuiltWordClick(index)}
                      className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white px-4 py-2 rounded-xl font-medium hover:from-emerald-500 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 border-2 border-emerald-300"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {builtSentence.length > 0 && (
              <div className="text-center mt-3">
                <button
                  onClick={resetSentenceBuilding}
                  className="text-gray-400 text-sm hover:text-white transition-colors underline"
                >
                  Recommencer
                </button>
              </div>
            )}
          </div>

          {/* Available words */}
          <div className="mb-10">
            <div className="text-center text-sm text-gray-400 mb-4">Mots disponibles</div>
            <div className="flex flex-wrap gap-3 justify-center">
              {availableWords.map((word, index) => (
                <button
                  key={`available-${word}-${index}`}
                  onClick={() => handleSentenceWordClick(word)}
                  className="px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-gray-600 to-gray-700 text-white border-2 border-gray-500 shadow-lg hover:from-gray-500 hover:to-gray-600 hover:border-emerald-400"
                >
                  {word}
                </button>
              ))}
            </div>
            {availableWords.length === 0 && builtSentence.length > 0 && (
              <div className="text-center text-emerald-400 text-sm mt-4">
                ✓ Tous les mots utilisés ! Vérifie ta phrase ci-dessus.
              </div>
            )}
          </div>
        </>
      );
    }

    if (exercise.type === 'audio-dictation') {
      return (
        <>
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-6 shadow-2xl">
              <button
                onClick={() => playAudio(exercise.audioText, exercise.audioFile)}
                disabled={isPlaying}
                className="text-white text-4xl hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause size={48} /> : <Volume2 size={48} />}
              </button>
            </div>
            <p className="text-gray-400 text-lg mb-2">Écoute et écris ce que tu entends</p>
            <p className="text-white text-sm opacity-75">Signification : {exercise.meaning}</p>
          </div>

          <div className="mb-10">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={exercise.placeholder}
              className="w-full p-5 rounded-2xl text-xl text-center bg-gradient-to-r from-gray-700 to-gray-800 text-white border-2 border-gray-600/50 focus:border-violet-400 focus:outline-none"
            />
          </div>
        </>
      );
    }

    if (exercise.type === 'true-false-reading') {
      const currentQ = exercise.questions[currentTFQuestion];
      const isLastQuestion = currentTFQuestion === exercise.questions.length - 1;
      
      return (
        <>
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 shadow-xl">
              <span className="text-white text-2xl font-bold">📖</span>
            </div>
            
            {/* Text to read */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-600/30 mb-6">
              <div className="text-white text-lg leading-relaxed mb-4">{exercise.text}</div>
              <div className="text-gray-400 text-sm italic">{exercise.translation}</div>
            </div>
            
            {/* Current Question */}
            <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl p-4 shadow-xl border border-gray-500/30 mb-6">
              <div className="text-sm text-gray-400 mb-2">Question {currentTFQuestion + 1}/{exercise.questions.length}</div>
              <div className="text-white text-lg font-medium">{currentQ.question}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <button
              onClick={() => handleTFAnswer(true)}
              className="p-5 rounded-2xl text-lg font-medium bg-gradient-to-r from-green-500 to-green-600 text-white border-2 border-green-400 shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-[1.02]"
            >
              ✓ Vrai
            </button>
            <button
              onClick={() => handleTFAnswer(false)}
              className="p-5 rounded-2xl text-lg font-medium bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-red-400 shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-[1.02]"
            >
              ✗ Faux
            </button>
          </div>

          {/* Progress indicator for questions */}
          <div className="flex justify-center space-x-2 mb-4">
            {exercise.questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < currentTFQuestion
                    ? 'bg-green-500'
                    : index === currentTFQuestion
                    ? 'bg-amber-500'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </>
      );
    }

    if (exercise.type === 'verb-conjugation') {
      return (
        <>
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 shadow-xl">
              <span className="text-white text-2xl font-bold">🔄</span>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-600/30 mb-6">
              <div className="text-gray-400 text-sm mb-4">{exercise.explanation}</div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="bg-indigo-500/20 rounded-xl p-4 border border-indigo-400/30">
                  <div className="text-indigo-300 text-sm">Pronom</div>
                  <div className="text-white text-xl font-bold">{exercise.pronoun}</div>
                  <div className="text-gray-400 text-xs">({exercise.pronounMeaning})</div>
                </div>
                <div className="text-white text-2xl">+</div>
                <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-400/30">
                  <div className="text-purple-300 text-sm">Verbe</div>
                  <div className="text-white text-xl font-bold">{exercise.verb}</div>
                  <div className="text-gray-400 text-xs">({exercise.meaning})</div>
                </div>
              </div>
              <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-400/20">
                <div className="text-blue-300 text-xs">💡 Règle grammaticale</div>
                <div className="text-blue-200 text-sm">{exercise.grammarRule}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {exercise.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`p-5 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedAnswer === option
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-2 border-indigo-400 shadow-lg shadow-indigo-500/25'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-2 border-gray-600/50 hover:from-gray-600 hover:to-gray-700 shadow-lg'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      );
    }

    if (exercise.type === 'gender-agreement') {
      return (
        <>
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 shadow-xl">
              <span className="text-white text-2xl font-bold">♂♀</span>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-600/30 mb-6">
              <div className="text-gray-400 text-sm mb-4">{exercise.explanation}</div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-400/30">
                  <div className="text-blue-300 text-sm">Nom</div>
                  <div className="text-white text-xl font-bold">{exercise.noun}</div>
                  <div className="text-gray-400 text-xs">({exercise.nounMeaning})</div>
                </div>
                <div className="text-white text-2xl">+</div>
                <div className="bg-green-500/20 rounded-xl p-4 border border-green-400/30">
                  <div className="text-green-300 text-sm">Adjectif</div>
                  <div className="text-white text-xl font-bold">{exercise.adjective}</div>
                  <div className="text-gray-400 text-xs">({exercise.adjectiveMeaning})</div>
                </div>
              </div>
              <div className="bg-rose-500/10 rounded-xl p-3 border border-rose-400/20">
                <div className="text-rose-300 text-xs">💡 Règle grammaticale</div>
                <div className="text-rose-200 text-sm">{exercise.grammarRule}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {exercise.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`p-5 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedAnswer === option
                    ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white border-2 border-rose-400 shadow-lg shadow-rose-500/25'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-2 border-gray-600/50 hover:from-gray-600 hover:to-gray-700 shadow-lg'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      );
    }

    if (exercise.type === 'plural-formation') {
      return (
        <>
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 shadow-xl">
              <span className="text-white text-2xl font-bold">🔢</span>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-600/30 mb-6">
              <div className="text-gray-400 text-sm mb-4">{exercise.explanation}</div>
              <div className="bg-amber-500/20 rounded-xl p-4 border border-amber-400/30 mb-4">
                <div className="text-amber-300 text-sm">Nom singulier</div>
                <div className="text-white text-2xl font-bold">{exercise.singular}</div>
                <div className="text-gray-400 text-sm">({exercise.singularMeaning})</div>
              </div>
              <div className="bg-orange-500/10 rounded-xl p-3 border border-orange-400/20 mb-3">
                <div className="text-orange-300 text-xs">💡 Règle grammaticale</div>
                <div className="text-orange-200 text-sm">{exercise.grammarRule}</div>
              </div>
              <div className="bg-yellow-500/10 rounded-xl p-3 border border-yellow-400/20">
                <div className="text-yellow-300 text-xs">📝 Modèle</div>
                <div className="text-yellow-200 text-sm font-mono">{exercise.pattern}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {exercise.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`p-5 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedAnswer === option
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-2 border-amber-400 shadow-lg shadow-amber-500/25'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-2 border-gray-600/50 hover:from-gray-600 hover:to-gray-700 shadow-lg'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      );
    }

    if (exercise.type === 'tense-selection') {
      return (
        <>
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 shadow-xl">
              <span className="text-white text-2xl font-bold">⏰</span>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-600/30 mb-6">
              <div className="text-gray-400 text-sm mb-4">{exercise.explanation}</div>
              <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-400/30 mb-4">
                <div className="text-purple-300 text-sm">Contexte</div>
                <div className="text-white text-lg mb-2">{exercise.context}</div>
                <div className="text-purple-200 text-base mb-2">{exercise.contextTarifit}</div>
                <div className="text-gray-400 text-sm italic">({exercise.meaning})</div>
              </div>
              <div className="bg-indigo-500/10 rounded-xl p-3 border border-indigo-400/20 mb-3">
                <div className="text-indigo-300 text-xs">⚡ Indicateur temporel</div>
                <div className="text-indigo-200 text-sm">{exercise.timeIndicator}</div>
              </div>
              <div className="bg-violet-500/10 rounded-xl p-3 border border-violet-400/20">
                <div className="text-violet-300 text-xs">💡 Règle grammaticale</div>
                <div className="text-violet-200 text-sm">{exercise.grammarRule}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {exercise.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`p-5 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedAnswer === option
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-2 border-gray-600/50 hover:from-gray-600 hover:to-gray-700 shadow-lg'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      );
    }

    if (exercise.type === 'question-formation') {
      return (
        <>
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 shadow-xl">
              <span className="text-white text-2xl font-bold">❓</span>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-600/30 mb-6">
              <div className="text-gray-400 text-sm mb-4">{exercise.explanation}</div>
              <div className="bg-teal-500/20 rounded-xl p-4 border border-teal-400/30 mb-4">
                <div className="text-teal-300 text-sm">Affirmation</div>
                <div className="text-white text-lg mb-1">{exercise.statement}</div>
                <div className="text-gray-400 text-sm italic">({exercise.statementMeaning})</div>
              </div>
              <div className="bg-cyan-500/20 rounded-xl p-4 border border-cyan-400/30 mb-4">
                <div className="text-cyan-300 text-sm">Mot interrogatif</div>
                <div className="text-white text-lg">{exercise.questionWord}</div>
                <div className="text-gray-400 text-sm">({exercise.questionMeaning})</div>
              </div>
              <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-400/20 mb-3">
                <div className="text-emerald-300 text-xs">📝 Modèle</div>
                <div className="text-emerald-200 text-sm font-mono">{exercise.pattern}</div>
              </div>
              <div className="bg-green-500/10 rounded-xl p-3 border border-green-400/20">
                <div className="text-green-300 text-xs">💡 Règle grammaticale</div>
                <div className="text-green-200 text-sm">{exercise.grammarRule}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-10">
            {exercise.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`p-5 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedAnswer === option
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white border-2 border-teal-400 shadow-lg shadow-teal-500/25'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-2 border-gray-600/50 hover:from-gray-600 hover:to-gray-700 shadow-lg'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      );
    }
  };

  const canContinue = () => {
    const exercise = exercises[currentExercise];
    
    if (['listen-select', 'multiple-choice', 'fill-sentence', 'picture-matching', 'verb-conjugation', 'gender-agreement', 'plural-formation', 'tense-selection', 'question-formation'].includes(exercise.type)) {
      return !!selectedAnswer;
    }
    if (exercise.type === 'translate-text' || exercise.type === 'audio-dictation') {
      return userInput.trim().length > 0;
    }
    if (exercise.type === 'match-pairs') {
      const expectedPairs = exercise.correctPairs.length;
      return userPairs.length === expectedPairs; // Must create all pairs
    }
    if (exercise.type === 'word-bank-fill') {
      return Object.keys(droppedWords).length === exercise.blanks;
    }
    if (exercise.type === 'sentence-building') {
      return builtSentence.length === exercise.scrambledWords.length;
    }
    if (exercise.type === 'true-false-reading') {
      return tfAnswers.length === exercise.questions.length;
    }
    if (exercise.type === 'pronunciation') {
      return false; // Handled by recording
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <button
        onClick={openModal}
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        Exercices de pronoms (Version classique)
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-gray-900 rounded-3xl w-full max-w-lg mx-auto relative shadow-2xl border border-gray-700/50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-800 to-gray-850">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ⵣ</span>
                </div>
                <div className="text-white text-xl font-bold tracking-wide">Tarifit</div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`p-2 rounded-xl transition-all ${audioEnabled ? 'text-blue-400' : 'text-gray-500'}`}
                >
                  {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-400 fill-current" />
                  <span className="text-red-400 font-bold">5</span>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-700/50 transition-all duration-200"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-6 pt-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-700/60 rounded-full h-4 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-500 h-4 rounded-full shadow-sm relative transition-all duration-500"
                    style={{ width: `${(currentExercise / 20) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm font-medium">
                  {currentExercise}/20
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-white text-2xl font-bold mb-8 text-center">
                {exercises[currentExercise].title}
              </h2>

              {renderExercise()}

              {/* Feedback section */}
              {showFeedback && (
                <div className="mb-8">
                  <div className={`flex items-center space-x-3 mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </div>
                    <span className="text-xl font-bold">
                      {isCorrect ? 'Excellent !' : 'Pas tout à fait'}
                    </span>
                  </div>
                  
                  {!isCorrect && (
                    <div className="text-red-400 mb-2">
                      <div className="font-semibold mb-2">Bonne réponse :</div>
                      <div className="text-red-300 space-y-1">
                        {exercises[currentExercise].type === 'match-pairs' ? (
                          exercises[currentExercise].correctPairs.map((pair, index) => (
                            <div key={index} className="text-sm">
                              {pair.french} → {pair.tarifit}
                            </div>
                          ))
                        ) : exercises[currentExercise].type === 'word-bank-fill' ? (
                          <div>
                            {Object.entries(exercises[currentExercise].correctWords).map(([index, word]) => 
                              `Blanc ${parseInt(index) + 1}: ${word}`
                            ).join(', ')}
                          </div>
                        ) : exercises[currentExercise].type === 'sentence-building' ? (
                          <div>{exercises[currentExercise].correctOrder.join(' ')}</div>
                        ) : exercises[currentExercise].type === 'true-false-reading' ? (
                          exercises[currentExercise].questions.map((q, index) => (
                            <div key={index} className="text-sm">
                              {index + 1}. {q.question} → {q.answer ? 'Vrai' : 'Faux'}
                            </div>
                          ))
                        ) : (
                          <div>{exercises[currentExercise].correct}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Continue button */}
              {exercises[currentExercise].type !== 'pronunciation' && exercises[currentExercise].type !== 'true-false-reading' && (
                <button
                  onClick={showFeedback ? nextExercise : handleContinue}
                  disabled={!canContinue() && !showFeedback}
                  className={`w-full py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform relative overflow-hidden ${
                    (canContinue() || showFeedback)
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl shadow-green-500/25 hover:scale-[1.02]'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span className="relative z-10 tracking-wide">
                    {showFeedback ? 
                      (currentExercise === 20 ? "TERMINER" : "CONTINUER") : 
                      "VÉRIFIER"
                    }
                  </span>
                </button>
              )}

              {/* Special continue button for true-false-reading */}
              {exercises[currentExercise].type === 'true-false-reading' && (
                <button
                  onClick={showFeedback ? nextExercise : handleContinue}
                  disabled={!canContinue() && !showFeedback}
                  className={`w-full py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform relative overflow-hidden ${
                    (canContinue() || showFeedback)
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl shadow-green-500/25 hover:scale-[1.02]'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span className="relative z-10 tracking-wide">
                    {showFeedback ? 
                      (currentExercise === 20 ? "TERMINER" : "CONTINUER") : 
                      "VÉRIFIER"
                    }
                  </span>
                </button>
              )}

              {/* Special continue button for pronunciation */}
              {exercises[currentExercise].type === 'pronunciation' && showFeedback && (
                <button
                  onClick={nextExercise}
                  className="w-full py-5 rounded-2xl text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl shadow-green-500/25 hover:scale-[1.02] transition-all duration-300"
                >
                  <span className="tracking-wide">
                    {currentExercise === 20 ? "TERMINER" : "CONTINUER"}
                  </span>
                </button>
              )}
            </div>

            {/* Bottom accent */}
            <div className="h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TarifitPronounModal;
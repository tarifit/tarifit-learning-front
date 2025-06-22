# Audio Files for Tarifit Learning

## How to add audio files:

1. Place your audio files in the `public/audio/` directory
2. Name them exactly as specified in the exercises (e.g., `Necc.wav`)
3. Supported formats: .wav, .mp3, .ogg

## Example files needed:
### Listen & Select Exercise:
- `public/audio/Necc.wav` - Audio for "Necc" (I)

### Pronunciation Exercise:
- `public/audio/Kenniw.wav` - Audio for "Kenniw" (You-Plural-M)

### Additional words:
- `public/audio/Cekk.wav` - Audio for "Cekk" (You-M)
- `public/audio/Cemm.wav` - Audio for "Cemm" (You-F)
- `public/audio/Netta.wav` - Audio for "Netta" (He)
- `public/audio/Nettat.wav` - Audio for "Nettat" (She)

## Pronunciation Exercise Features:
- **Speech Recognition**: Uses Web Speech API to check pronunciation
- **Phonetic Scoring**: Custom algorithm that scores pronunciation similarity (60% threshold)
- **Language Fallbacks**: Tries Moroccan Arabic → Arabic → French → English recognition
- **Audio Playback**: Plays example pronunciation from .wav files
- **Fallback**: If speech recognition fails, defaults to success after delay
- **Browser Compatibility**: Works in Chrome, Edge, Safari (limited support in Firefox)

## How Pronunciation Scoring Works:
1. **Speech-to-Text**: Browser converts speech to text
2. **Similarity Calculation**: Uses Levenshtein distance algorithm
3. **Phonetic Bonuses**: Adds points for common Tarifit sound patterns
4. **Threshold Check**: Requires 60% similarity to pass
5. **Visual Feedback**: Shows detailed scoring in browser console

## Pronunciation Accuracy Limitations:
⚠️ **Important**: The pronunciation checking has limitations:
- **Language Support**: Tarifit isn't natively supported by browsers
- **Text-Based**: Converts speech to text, then compares text (not actual pronunciation)
- **Approximation**: Uses phonetic patterns and similarity scoring
- **False Positives**: May accept incorrect pronunciations that sound similar
- **False Negatives**: May reject correct pronunciations due to recognition errors

## For Better Pronunciation Checking:
- Consider using specialized pronunciation assessment APIs
- Implement audio waveform comparison
- Use phonetic transcription libraries
- Add multiple pronunciation examples

## If audio files are missing:
The app will gracefully fall back to silent mode and log a message in the console.

## Recording Tips for Pronunciation Files:
1. **Clear pronunciation**: Record native Tarifit speakers if possible
2. **Good quality**: Use good microphone, minimal background noise
3. **Consistent volume**: Normalize audio levels across files
4. **File format**: .wav is preferred for quality, .mp3 for size

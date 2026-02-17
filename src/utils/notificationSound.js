// Notification sound utility
let audioContext = null;

// Initialize audio context on user interaction
export const initAudio = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  if (audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
        // Prime the context with a silent burst
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        gain.gain.setValueAtTime(0, audioContext.currentTime);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        osc.stop(audioContext.currentTime + 0.1);
    }).catch(err => console.warn("AudioContext resume failed:", err));
  }
  return audioContext;
};

// Play notification sound using Web Audio API
export const playNotificationSound = () => {
  try {
    const ctx = initAudio();
    
    // Ensure context is running (browsers suspend it without interaction)
    if (ctx.state === 'suspended') {
        ctx.resume().then(() => playNotificationSound()).catch(err => {
            console.warn("Retrying with file fallback...");
            playNotificationSoundFromFile();
        });
        return;
    }

    // Create oscillator for a pleasant notification sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Configure sound: Two-tone notification (like a gentle "ding")
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime); // First tone
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.1); // Second tone
    
    // Envelope: Quick attack, short sustain, quick release
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01); // Attack
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1); // Sustain
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25); // Release
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.25);
    
  } catch (error) {
    console.warn('Could not play notification sound:', error);
    playNotificationSoundFromFile(); // Fallback
  }
};

// Alternative: Play from audio file (if you have one)
export const playNotificationSoundFromFile = (audioUrl = '/sounds/notification.mp3') => {
  try {
    const audio = new Audio(audioUrl);
    audio.volume = 0.5;
    audio.play().catch(err => console.warn('Audio playback failed:', err));
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
};

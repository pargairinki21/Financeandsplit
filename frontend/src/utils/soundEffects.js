// Sound effects utility for the application
class SoundEffects {
  constructor() {
    this.sounds = {};
    this.isEnabled = true;
    this.volume = 0.3;
    this.initializeSounds();
  }

  initializeSounds() {
    // Create audio contexts for different sound effects
    this.sounds = {
      pageTransition: this.createSound([
        { frequency: 440, duration: 0.1 },
        { frequency: 554, duration: 0.1 },
        { frequency: 659, duration: 0.15 }
      ]),
      coinDrop: this.createSound([
        { frequency: 523, duration: 0.1 },
        { frequency: 659, duration: 0.1 },
        { frequency: 784, duration: 0.2 },
        { frequency: 1047, duration: 0.1 }
      ]),
      success: this.createSound([
        { frequency: 523, duration: 0.1 },
        { frequency: 659, duration: 0.1 },
        { frequency: 784, duration: 0.2 }
      ]),
      error: this.createSound([
        { frequency: 220, duration: 0.2 },
        { frequency: 196, duration: 0.3 }
      ])
    };
  }

  createSound(notes) {
    return () => {
      if (!this.isEnabled) return;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      let currentTime = audioContext.currentTime;

      notes.forEach(note => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(note.frequency, currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume, currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration);

        oscillator.start(currentTime);
        oscillator.stop(currentTime + note.duration);

        currentTime += note.duration;
      });
    };
  }

  playPageTransition() {
    this.sounds.pageTransition();
  }

  playCoinDrop() {
    this.sounds.coinDrop();
  }

  playSuccess() {
    this.sounds.success();
  }

  playError() {
    this.sounds.error();
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }
}

// Create a singleton instance
const soundEffects = new SoundEffects();

export default soundEffects;

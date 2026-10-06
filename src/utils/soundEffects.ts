/**
 * Web Audio API & Speech Synthesis sound effects generator.
 * Self-contained, zero external asset dependencies, low latency.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private voiceEnabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policy
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundOn(): boolean {
    return this.soundEnabled;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
  }

  public isVoiceOn(): boolean {
    return this.voiceEnabled;
  }

  /**
   * Speak friendly voice feedback using SpeechSynthesis
   */
  public speak(text: string) {
    if (!this.voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel(); // Stop previous utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.15; // Friendly, warm teacher tone
      utterance.lang = 'en-GB'; // British English for Cambridge IGCSE
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if speech synthesis unavailable in environment
    }
  }

  /**
   * Play musical drop chime when a coordinate point appears
   */
  public playPointSound(pointIndex: number = 0, coordText?: string) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pentatonic scale notes for pleasant harmony
      const frequencies = [329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
      const freq = frequencies[pointIndex % frequencies.length] || 523.25;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.15);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Ignore audio context errors
    }

    if (coordText && this.voiceEnabled) {
      this.speak(`Point ${coordText}`);
    }
  }

  /**
   * Play a smooth gliding harmonic curve connection sound effect
   */
  public playConnectCurveSound() {
    if (this.voiceEnabled) {
      this.speak("Connecting points with a smooth curve freehand!");
    }

    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const duration = 2.8;
      const now = this.ctx.currentTime;

      // Sweeping oscillator
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + duration);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.4);
      gain.gain.setValueAtTime(0.2, now + duration - 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);

      // Play pleasant resolution chord at the end of the curve
      setTimeout(() => {
        if (!this.soundEnabled || !this.ctx) return;
        const chimeNow = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const chordOsc = this.ctx!.createOscillator();
          const chordGain = this.ctx!.createGain();
          chordOsc.type = 'sine';
          chordOsc.frequency.setValueAtTime(freq, chimeNow + idx * 0.08);

          chordGain.gain.setValueAtTime(0, chimeNow + idx * 0.08);
          chordGain.gain.linearRampToValueAtTime(0.12, chimeNow + idx * 0.08 + 0.02);
          chordGain.gain.exponentialRampToValueAtTime(0.001, chimeNow + idx * 0.08 + 0.5);

          chordOsc.connect(chordGain);
          chordGain.connect(this.ctx!.destination);

          chordOsc.start(chimeNow + idx * 0.08);
          chordOsc.stop(chimeNow + idx * 0.08 + 0.5);
        });
      }, duration * 800);
    } catch {
      // Ignore
    }
  }

  /**
   * Play celebration chime + encouraging voice when student is correct
   */
  public playCorrectSound(praise?: string) {
    if (!this.soundEnabled && !this.voiceEnabled) return;
    this.initContext();

    if (this.soundEnabled && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        // Bright celebratory arpeggio: C5 - E5 - G5 - C6
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.09);

          gain.gain.setValueAtTime(0, now + i * 0.09);
          gain.gain.linearRampToValueAtTime(0.2, now + i * 0.09 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.45);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 0.45);
        });
      } catch {
        // Ignore
      }
    }

    if (this.voiceEnabled) {
      const defaultPraises = [
        "Brilliant! That's correct!",
        "Great job! Exactly right!",
        "Excellent! 1 mark awarded!",
        "Spot on! Well calculated!",
        "Superb work!"
      ];
      const msg = praise || defaultPraises[Math.floor(Math.random() * defaultPraises.length)];
      setTimeout(() => this.speak(msg), 250);
    }
  }

  /**
   * Gentle, encouraging sound for wrong answer
   */
  public playWrongSound() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.25);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Ignore
    }

    if (this.voiceEnabled) {
      setTimeout(() => this.speak("Nice try! Check your calculation or open the hint."), 200);
    }
  }
}

export const soundManager = new SoundManager();

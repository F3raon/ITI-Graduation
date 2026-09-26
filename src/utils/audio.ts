// Procedural Web Audio API sound generator for cinematic sci-fi atmosphere
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private isInitialized: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.startAmbient();
      this.playChime(440, 'triangle', 0.15);
    } else {
      this.stopAmbient();
    }
    return !this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private startAmbient() {
    if (!this.ctx || this.isMuted) return;
    try {
      if (this.ambientOsc) {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
      }
      // Sub-bass atmospheric drone
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();
      this.filter = this.ctx.createBiquadFilter();

      this.ambientOsc.type = 'sawtooth';
      this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(140, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(4, this.ctx.currentTime);

      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 3);

      this.ambientOsc.connect(this.filter);
      this.filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc.start();
      this.isInitialized = true;
    } catch {
      // Audio autoplay policy handled
    }
  }

  private stopAmbient() {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        if (this.ambientOsc) {
          try {
            this.ambientOsc.stop();
            this.ambientOsc.disconnect();
          } catch {
            // ignore
          }
          this.ambientOsc = null;
        }
      }, 500);
    }
  }

  public playChime(freq = 520, type: OscillatorType = 'sine', duration = 0.25) {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }

  public playHover() {
    this.playChime(640, 'sine', 0.08);
  }

  public playSelect() {
    this.playChime(880, 'triangle', 0.2);
  }
}

export const soundEngine = new SoundEngine();

// Audio Synthesizer for ambient sounds and meditation chimes using Web Audio API

class SoundService {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientSourceNodes: AudioNode[] = [];
  private currentAmbient: 'none' | 'chuva' | 'celestial' | 'aguas' = 'none';

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play peaceful bell chime (for prayer start, interval, or finish)
  public playChime(freq = 528, duration = 3.5) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.5, now);

      // Bell envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.35, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch {
      // AudioContext might be blocked until user interaction
    }
  }

  // Start background ambient sound
  public playAmbient(type: 'chuva' | 'celestial' | 'aguas', volume = 0.3) {
    try {
      this.stopAmbient();
      this.initCtx();
      if (!this.ctx) return;

      this.currentAmbient = type;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(volume, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      if (type === 'celestial') {
        // Celestial warm pad: subtle chord harmonic oscillators
        const freqs = [196, 261.63, 329.63, 392]; // G3, C4, E4, G4
        freqs.forEach((f) => {
          if (!this.ctx || !this.ambientGain) return;
          const osc = this.ctx.createOscillator();
          const lfo = this.ctx.createOscillator();
          const lfoGain = this.ctx.createGain();
          const panner = this.ctx.createStereoPanner?.() || null;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, this.ctx.currentTime);

          // Gentle vibrato
          lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
          lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);

          const oscGain = this.ctx.createGain();
          oscGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

          if (panner) {
            osc.connect(oscGain);
            oscGain.connect(panner);
            panner.connect(this.ambientGain);
          } else {
            osc.connect(oscGain);
            oscGain.connect(this.ambientGain);
          }

          osc.start();
          lfo.start();

          this.ambientSourceNodes.push(osc, lfo, oscGain, lfoGain);
        });
      } else if (type === 'chuva' || type === 'aguas') {
        // Pink / filtered noise generator for rain or flowing stream
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        if (type === 'chuva') {
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        } else {
          // aguas: bandpass for babbling brook
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(500, this.ctx.currentTime);
          filter.Q.setValueAtTime(1.8, this.ctx.currentTime);
        }

        whiteNoise.connect(filter);
        filter.connect(this.ambientGain);
        whiteNoise.start();

        this.ambientSourceNodes.push(whiteNoise, filter);
      }
    } catch (err) {
      console.warn('Audio ambient initialization error:', err);
    }
  }

  public setAmbientVolume(vol: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  public stopAmbient() {
    this.ambientSourceNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // Ignored
      }
    });
    this.ambientSourceNodes = [];
    if (this.ambientGain) {
      this.ambientGain.disconnect();
      this.ambientGain = null;
    }
    this.currentAmbient = 'none';
  }

  public getCurrentAmbient() {
    return this.currentAmbient;
  }
}

export const soundService = new SoundService();

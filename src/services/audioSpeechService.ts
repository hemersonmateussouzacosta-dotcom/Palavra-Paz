// Audio Speech Narration service using Web Speech API

class AudioSpeechService {
  private isSpeaking = false;
  private isPaused = false;
  private currentText = '';
  private onStatusChangeCallback: ((speaking: boolean, paused: boolean) => void) | null = null;

  public setStatusCallback(cb: (speaking: boolean, paused: boolean) => void) {
    this.onStatusChangeCallback = cb;
  }

  private notify() {
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback(this.isSpeaking, this.isPaused);
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    this.stop();
    this.currentText = text;

    const cleanText = text
      .replace(/[\*\#\_]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.88; // Gentle, reverent pace for prayer/devotional
    utterance.pitch = 0.96;

    // Pick best Portuguese voice if available
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(
      (v) => v.lang.startsWith('pt') && (v.name.includes('Luciana') || v.name.includes('Yara') || v.name.includes('Google') || v.name.includes('Natural'))
    ) || voices.find((v) => v.lang.startsWith('pt'));

    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.notify();
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.isSpeaking = false;
      this.isPaused = false;
      this.notify();
    };

    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if ('speechSynthesis' in window && this.isSpeaking) {
      window.speechSynthesis.pause();
      this.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if ('speechSynthesis' in window && this.isPaused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.notify();
    }
  }

  public getState() {
    return {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
      currentText: this.currentText,
    };
  }
}

export const audioSpeechService = new AudioSpeechService();

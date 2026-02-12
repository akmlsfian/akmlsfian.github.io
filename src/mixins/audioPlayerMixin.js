export const audioPlayerMixin = {
  data() {
    return {
      audioContext: null,
      audioBuffer: null,
      sourceNode: null,
      analyser: null,
      gainNode: null,
      isPlaying: false,
      startTime: 0,
      pausedAt: 0,
      currentTime: 0,
      duration: 0,
      volume: 0.7,
      isLoading: false,
      uploadProgress: 0,
      currentFileName: '',
      dataArray: null,
    };
  },
  methods: {
    async initAudioContext() {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(this.audioContext.destination);
      }
    },
    async loadAudioFile(file) {
      if (!file) return;
      this.isLoading = true;
      this.currentFileName = file.name;
      this.uploadProgress = 0;

      try {
        await this.initAudioContext();
        
        const reader = new FileReader();
        
        const arrayBuffer = await new Promise((resolve, reject) => {
          reader.onprogress = (event) => {
            if (event.lengthComputable) {
              this.uploadProgress = Math.round((event.loaded / event.total) * 100);
            }
          };
          
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsArrayBuffer(file);
        });

        this.uploadProgress = 100; // Decoding starts
        
        const decodedBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.audioBuffer = decodedBuffer;
        this.duration = decodedBuffer.duration;
        this.playAudio();
      } catch (error) {
        console.error('Error loading audio:', error);
        alert('Failed to load audio file.');
      } finally {
        this.isLoading = false;
        this.uploadProgress = 0;
      }
    },
    playAudio() {
      if (this.sourceNode) {
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      }

      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = this.audioBuffer;
      this.sourceNode.connect(this.analyser);
      this.analyser.connect(this.gainNode);

      const offset = this.pausedAt;
      this.sourceNode.start(0, offset);
      this.startTime = this.audioContext.currentTime - offset;
      this.isPlaying = true;

      this.sourceNode.onended = () => {
        if (this.currentTime >= this.duration) {
          this.isPlaying = false;
          this.pausedAt = 0;
          this.currentTime = 0;
        }
      };
    },
    pauseAudio() {
      if (this.sourceNode) {
        this.sourceNode.stop();
        this.pausedAt = this.audioContext.currentTime - this.startTime;
        this.isPlaying = false;
      }
    },
    togglePlay() {
      if (this.isPlaying) this.pauseAudio();
      else this.playAudio();
    },
    seekAudio() {
      if (this.isPlaying) this.sourceNode.stop();
      this.pausedAt = this.currentTime;
      if (this.isPlaying) this.playAudio();
    },
    updateVolume() {
      if (this.gainNode) this.gainNode.gain.value = this.volume;
    },
    resetAudio() {
      this.pauseAudio();
      this.audioBuffer = null;
      this.currentFileName = '';
      this.currentTime = 0;
      this.duration = 0;
      this.pausedAt = 0;
    },
    updateAudioTime() {
      if (this.isPlaying && this.audioContext) {
        this.currentTime = this.audioContext.currentTime - this.startTime;
      }
    },
    getAudioData() {
      if (this.analyser && this.isPlaying) {
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
      }
      return null;
    }
  },
  beforeUnmount() {
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
};

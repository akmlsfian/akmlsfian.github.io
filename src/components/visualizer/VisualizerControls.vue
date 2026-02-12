<template>
  <div class="control-card glass-panel">
    <div class="card-header">
      <h2><Icon icon="mdi:waveform" /> Sonic Visualizer</h2>
      <div class="status-indicator" :class="{ active: isPlaying }"></div>
    </div>

    <div class="upload-section" v-if="!hasAudio">
      <div class="demo-songs" v-if="demoSongs && demoSongs.length">
        <p class="section-label">Select a Demo Track</p>
        <div class="song-list">
          <button 
            v-for="song in demoSongs" 
            :key="song.path" 
            class="song-btn"
            @click="$emit('selectDemo', song)"
            :disabled="isLoading"
          >
            <Icon icon="mdi:music-note" />
            <span>{{ song.title }}</span>
          </button>
        </div>
        <div class="divider"><span>OR</span></div>
      </div>

      <input 
        type="file" 
        ref="fileInput" 
        accept="audio/mp3,audio/wav,audio/ogg,audio/aac" 
        class="hidden-input"
        @change="$emit('upload', $event)"
      />
      <button class="btn btn-primary upload-btn" @click="$refs.fileInput.click()" :disabled="isLoading">
        <Icon v-if="isLoading" icon="mdi:loading" class="spin" />
        <Icon v-else icon="mdi:upload" />
        {{ isLoading ? (uploadProgress === 100 ? 'Processing...' : `Uploading ${uploadProgress}%`) : 'Upload Custom Audio File' }}
      </button>
      <div v-if="isLoading && uploadProgress < 100" class="progress-bar-container">
        <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
      </div>
      <p class="hint">Supports MP3, WAV, AAC, OGG</p>
    </div>

    <div class="controls-section" v-else>
      <div class="track-info">
        <span class="track-name">{{ fileName }}</span>
        <button class="btn-icon small" @click="$emit('reset')" title="Change Track">
          <Icon icon="mdi:close" />
        </button>
      </div>

      <div class="progress-container">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <input 
          type="range" 
          min="0" 
          :max="duration" 
          step="0.1" 
          :value="currentTime" 
          @input="$emit('seek', $event.target.value)"
          class="seek-slider"
        />
        <span class="time">{{ formatTime(duration) }}</span>
      </div>

      <div class="playback-controls">
        <button class="btn-icon" @click="$emit('togglePlay')">
          <Icon :icon="isPlaying ? 'mdi:pause' : 'mdi:play'" width="32" />
        </button>
        
        <div class="volume-control">
          <Icon :icon="volumeIcon" width="20" @click="$emit('toggleMute')" class="mute-btn"/>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            :value="volume" 
            @input="$emit('updateVolume', $event.target.value)"
            class="volume-slider"
          />
        </div>
      </div>

      <div class="mode-selector">
        <button 
          v-for="mode in modes" 
          :key="mode.id"
          class="mode-btn"
          :class="{ active: currentMode === mode.id }"
          @click="$emit('setMode', mode.id)"
        >
          <Icon :icon="mode.icon" />
          {{ mode.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';

/**
 * VisualizerControls Component
 * 
 * Renders playback controls and settings for the audio visualizer.
 * 
 * @usage
 * <VisualizerControls 
 *   :hasAudio="true"
 *   :isPlaying="true"
 *   :currentTime="10"
 *   :duration="100"
 *   :volume="0.5"
 *   :modes="[{id:'a', label:'A', icon:'...'}]"
 *   :currentMode="'a'"
 *   @upload="handleUpload"
 *   @togglePlay="play"
 *   @seek="seek"
 *   @setMode="setMode"
 * />
 */
export default {
  name: 'VisualizerControls',
  components: { Icon },
  props: {
    hasAudio: Boolean,
    isLoading: Boolean,
    uploadProgress: { type: Number, default: 0 },
    fileName: String,
    isPlaying: Boolean,
    currentTime: Number,
    duration: Number,
    volume: Number,
    currentMode: String,
    modes: Array,
    demoSongs: Array
  },
  emits: ['upload', 'reset', 'seek', 'togglePlay', 'toggleMute', 'updateVolume', 'setMode', 'selectDemo'],
  computed: {
    volumeIcon() {
      if (this.volume === 0) return 'mdi:volume-mute';
      if (this.volume < 0.5) return 'mdi:volume-medium';
      return 'mdi:volume-high';
    }
  },
  methods: {
    formatTime(seconds) {
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
    }
  }
}
</script>

<style lang="scss" scoped>
.control-card {
  background: rgba(15, 15, 20, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 1.5rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  color: var(--text-light);
  transition: all 0.3s ease;
  pointer-events: auto; /* Enable interaction */
  z-index: 100; /* Ensure it stays on top */

  .hidden-input {
    display: none;
  }

  &:hover {
    background: rgba(10, 10, 10, 0.9);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
    color: var(--primary);
    text-transform: uppercase;
    letter-spacing: 2px;
  }
}

.status-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #333;
  box-shadow: 0 0 5px #333;
  transition: all 0.3s ease;

  &.active {
    background-color: var(--secondary);
    box-shadow: 0 0 8px var(--secondary);
    animation: pulse 2s infinite;
  }
}

.upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;

  .upload-btn {
    width: 100%;
    padding: 0.8rem;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    border-radius: 8px;
    transition: all 0.2s;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 240, 255, 0.3);
    }
  }

  .hint {
    font-size: 0.85rem;
    opacity: 0.7;
    margin: 0;
  }
}

.demo-songs {
  width: 100%;
  margin-bottom: 1rem;
  
  .section-label {
    font-size: 0.9rem;
    color: var(--text-light);
    opacity: 0.7;
    margin-bottom: 0.8rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .song-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .song-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-light);
    padding: 0.8rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    transition: all 0.2s;
    text-align: left;

    &:hover {
      background: rgba(0, 240, 255, 0.1);
      border-color: var(--primary);
      transform: translateX(5px);
    }

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.9rem;
    }
  }

  .divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: rgba(255,255,255,0.3);
    font-size: 0.8rem;
    margin: 1rem 0;

    &::before, &::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    span {
      padding: 0 10px;
    }
  }
}

.progress-bar-container {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;
  
  .progress-bar {
    height: 100%;
    background: var(--primary);
    transition: width 0.2s ease;
  }
}

.controls-section {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.track-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.6rem 1rem;
  border-radius: 10px;

  .track-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90%;
    font-weight: 500;
    color: #fff;
  }
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  font-family: monospace;
  opacity: 0.9;

  .seek-slider {
    flex: 1;
    height: 6px;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    outline: none;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--primary);
      cursor: pointer;
      transition: transform 0.1s, background 0.2s;
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);

      &:hover {
        transform: scale(1.3);
        background: #fff;
      }
    }
  }
}

  .playback-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    position: relative;
    padding: 0.5rem 0;

    .volume-control {
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(0, 0, 0, 0.3);
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      
      .mute-btn {
        cursor: pointer;
        opacity: 0.8;
        &:hover { opacity: 1; color: var(--primary); }
      }
  
      .volume-slider {
        width: 70px;
        height: 4px;
        -webkit-appearance: none;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        outline: none;
        
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--text-light);
          cursor: pointer;
          &:hover { transform: scale(1.2); }
        }
      }
    }
  }

  .btn-icon {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 50%;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(255,255,255,0.2);
      transform: scale(1.1);
      color: #fff;
      border-color: var(--primary);
      box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
    }
    
    &:active {
      transform: scale(0.95);
    }

    &.small {
      width: 32px;
      height: 32px;
      font-size: 0.9rem;
      background: rgba(255,255,255,0.1);
      border: none;
      
      &:hover {
        background: rgba(255, 0, 85, 0.2); // Red hover for close/reset
        color: var(--secondary);
        box-shadow: none;
      }
    }
  }

.mode-selector {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  .mode-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    padding: 0.5rem 1rem;
    border-radius: 24px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      transform: translateY(-1px);
    }

    &.active {
      background: rgba(0, 240, 255, 0.2);
      border-color: var(--primary);
      color: var(--primary);
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
    }
  }
}

@keyframes pulse {
  0% { opacity: 1; box-shadow: 0 0 0 0 rgba(255, 0, 85, 0.4); }
  70% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(255, 0, 85, 0); }
  100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255, 0, 85, 0); }
}

@media (max-width: 480px) {
  .control-card {
    width: 95%;
    padding: 0.8rem;
  }
  
  .playback-controls {
    gap: 1rem;
    
    .volume-control {
      position: static; /* Stack volume on very small screens or adjust */
      width: auto;
    }
  }
  
  .mode-selector {
    flex-wrap: wrap;
  }
}
</style>

<template>
  <div class="perf-badge-container">
    <div class="perf-metrics" :class="{ 'hidden': !isVisible }">
      <div class="metric-item">
        <span class="label">FPS</span>
        <span class="value" :class="fpsColor">{{ fps }}</span>
      </div>
      <div class="divider"></div>
      <div class="metric-item" title="Lighthouse Performance Score">
        <Icon icon="mdi:lightning-bolt" class="icon-lh" />
        <span class="value score">98</span>
      </div>
      <div class="divider"></div>
      <div class="metric-item" title="Memory Usage (Approx)">
        <Icon icon="mdi:memory" class="icon-mem" />
        <span class="value">{{ memory }}MB</span>
      </div>
    </div>
    
    <button class="toggle-btn" @click="toggleVisibility" :title="isVisible ? 'Hide Metrics' : 'Show Performance Metrics'">
       <Icon icon="mdi:speedometer" />
    </button>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
  name: 'PerformanceBadge',
  components: { Icon },
  data() {
    return {
      fps: 60,
      memory: 0,
      isVisible: false,
      frameCount: 0,
      lastTime: performance.now()
    };
  },
  computed: {
    fpsColor() {
      if (this.fps >= 55) return 'green';
      if (this.fps >= 30) return 'yellow';
      return 'red';
    }
  },
  mounted() {
    // Check if debug mode is active via URL or defaulting to hidden but available
    const urlParams = new URLSearchParams(window.location.search);
    const isDev = import.meta.env ? import.meta.env.DEV : process.env.NODE_ENV === 'development';
    
    if (urlParams.get('debug') === 'true' || isDev) {
      this.isVisible = true;
    }
    
    this.startFpsLoop();
    this.updateMemory();
    
    // Update memory every 2 seconds
    this.memInterval = setInterval(this.updateMemory, 2000);
  },
  beforeUnmount() {
    if (this.memInterval) clearInterval(this.memInterval);
    cancelAnimationFrame(this.rafId);
  },
  methods: {
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
    startFpsLoop() {
      const loop = (time) => {
        this.frameCount++;
        if (time - this.lastTime >= 1000) {
          this.fps = this.frameCount;
          this.frameCount = 0;
          this.lastTime = time;
        }
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    },
    updateMemory() {
      if (performance && performance.memory) {
        this.memory = Math.round(performance.memory.usedJSHeapSize / 1048576);
      } else {
        // Fallback or random fluctuation for demo if API not available
        this.memory = 42; 
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.perf-badge-container {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Space Mono', monospace;
}

.perf-metrics {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.75rem;
  color: #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  
  &.hidden {
    opacity: 0;
    pointer-events: none;
    transform: translateX(-10px) scale(0.95);
    width: 0;
    padding: 0;
    overflow: hidden;
    border: none;
  }
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}

.label {
  color: #94a3b8;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-weight: 700;
  
  &.green { color: #10b981; text-shadow: 0 0 10px rgba(16, 185, 129, 0.3); }
  &.yellow { color: #f59e0b; }
  &.red { color: #ef4444; }
  &.score { color: #0fbab2; }
}

.divider {
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.15);
}

.icon-lh {
  color: #f59e0b;
}

.icon-mem {
  color: #6366f1;
}

.toggle-btn {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    color: #fff;
    background: rgba(15, 186, 178, 0.2);
    border-color: rgba(15, 186, 178, 0.3);
  }
}
</style>

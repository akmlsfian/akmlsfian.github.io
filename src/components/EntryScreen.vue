<template>
  <transition name="explode">
    <div v-if="visible" class="entry-screen" @click="enter">
      <div class="content">
        <h1 class="title">Akmal Sufian</h1>
        <p class="subtitle">Software Programmer & Web Developer</p>
        <div class="hint">Click anywhere to start</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'EntryScreen',
  data() {
    return {
      visible: true
    };
  },
  methods: {
    enter() {
      this.visible = false;
      this.$emit('enter');
    }
  }
}
</script>

<style lang="scss" scoped>
.entry-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.98);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(20px);
}

.content {
  text-align: center;
  color: var(--text-light);
}

.title {
  font-size: clamp(3rem, 6vw, 6rem);
  font-weight: 900;
  letter-spacing: -2px;
  background: linear-gradient(135deg, var(--primary) 0%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  animation: pulse 3s infinite ease-in-out;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--text-muted);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.hint {
  margin-top: 3rem;
  font-size: 0.875rem;
  opacity: 0.6;
  animation: blink 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(43, 241, 255, 0.2)); }
  50% { transform: scale(1.02); filter: drop-shadow(0 0 20px rgba(43, 241, 255, 0.5)); }
}

@keyframes blink {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

/* Transition Effects */
.explode-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.explode-leave-to {
  transform: scale(1.5);
  opacity: 0;
  filter: blur(10px);
}
</style>

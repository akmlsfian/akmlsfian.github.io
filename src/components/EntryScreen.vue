<template>
  <transition name="explode">
    <div v-if="visible" class="entry-screen" @click="enter">
      <div class="content">
        <h1 class="title">{{ displayedTitle }}</h1>
        <p class="subtitle">Software Programmer & Web Developer</p>
        <div class="hint">
          <span class="click-text">Click to initialize</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'EntryScreen',
  data() {
    return {
      visible: true,
      originalText: 'akmlsfian',
      displayedTitle: '', // Start empty or random
      interval: null
    };
  },
  mounted() {
    this.startHackerEffect();
  },
  beforeUnmount() {
    if (this.interval) clearInterval(this.interval);
  },
  methods: {
    enter() {
      this.visible = false;
      this.$emit('enter');
    },
    startHackerEffect() {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let iteration = 0;
      
      // Initialize with random characters immediately to prevent empty flash
      this.displayedTitle = this.originalText.split("")
        .map(() => letters[Math.floor(Math.random() * letters.length)])
        .join("");

      this.interval = setInterval(() => {
        this.displayedTitle = this.originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return this.originalText[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");
        
        if (iteration >= this.originalText.length) { 
          clearInterval(this.interval);
          this.displayedTitle = this.originalText; // Ensure clean final state
        }
        
        iteration += 1 / 3; // Resolve 1 character every 3 frames
      }, 50); // 50ms per frame
    }
  }
}
</script>

<style lang="scss" scoped>
.entry-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.85); /* Slightly more transparent */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(20px);
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.content {
  text-align: center;
  color: var(--text-light);
  position: relative;
  z-index: 2;
  transition: transform 0.2s ease;
}

.title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 700;
  letter-spacing: -4px;
  background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  /* Modern glow */
  text-shadow: 0 0 30px rgba(43, 241, 255, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    text-shadow: 0 0 50px rgba(43, 241, 255, 0.6);
    letter-spacing: -2px; /* Expand slightly */
  }
}

.subtitle {
  font-family: 'Inter', sans-serif;
  font-size: clamp(0.875rem, 1.5vw, 1.25rem);
  color: var(--text-muted);
  letter-spacing: 4px;
  text-transform: uppercase;
  font-weight: 300;
}

.hint {
  margin-top: 4rem;
  font-size: 0.75rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--primary);
  opacity: 0.7;
  
  .click-text {
    border: 1px solid rgba(43, 241, 255, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    background: rgba(43, 241, 255, 0.05);
    animation: blink 2s infinite;
  }
}

@keyframes blink {
  0%, 100% { opacity: 0.5; box-shadow: 0 0 0 rgba(43, 241, 255, 0); }
  50% { opacity: 1; box-shadow: 0 0 10px rgba(43, 241, 255, 0.3); }
}

/* EXPLOSION Transition Effects */
.explode-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.explode-leave-to {
  opacity: 0;
  filter: blur(20px);
  /* The explosion: Scale up massively */
  transform: scale(3); 
}

.explode-leave-to .title {
  /* Extra burst for title */
  letter-spacing: 50px;
  filter: blur(10px);
}
</style>

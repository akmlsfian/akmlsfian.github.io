<template>
  <div class="app-container">
    <EntryScreen @enter="onEnter" />
    <ParticlesBackground v-if="!isVisualizerRoute" />
    
    <div class="nav-wrapper" :class="{ 'visualizer-mode': isVisualizerRoute, 'controls-hidden': isVisualizerRoute && !isVisualizerControlsVisible }" v-if="isEntered">
      <NavBar />
    </div>
    
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import ParticlesBackground from './components/ParticlesBackground.vue';
import EntryScreen from './components/EntryScreen.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    ParticlesBackground,
    EntryScreen
  },
  data() {
    return {
      isEntered: false,
      isVisualizerControlsVisible: true
    }
  },
  computed: {
    isVisualizerRoute() {
      return this.$route.name === 'visualizer';
    }
  },
  mounted() {
    window.addEventListener('visualizer-ui-toggle', this.handleVisualizerUiToggle);
    if (!this.isEntered) {
      document.body.style.overflow = 'hidden';
    }
  },
  beforeUnmount() {
    window.removeEventListener('visualizer-ui-toggle', this.handleVisualizerUiToggle);
    document.body.style.overflow = '';
  },
  methods: {
    handleVisualizerUiToggle(e) {
      this.isVisualizerControlsVisible = e.detail;
    },
    onEnter() {
      this.isEntered = true;
      document.body.style.overflow = '';
      // Scroll to top on enter
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
</script>

<style lang="scss">
@import './style.scss';

.app-container {
  position: relative;
  min-height: 100vh;
}

.nav-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2000; // Ensure it's above visualizer controls
  transition: transform 0.3s ease, opacity 0.3s ease;
  pointer-events: none; // Allow clicks to pass through wrapper by default

  // Default state (not visualizer) - allow clicks on children
  &:not(.visualizer-mode) {
    pointer-events: auto;
  }

  &.visualizer-mode {
    // Desktop: Hidden by default, show when controls are visible
    @media (min-width: 769px) {
      .navbar {
        transform: translate(-50%, -150%);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
      }

      // Show when controls are visible (not hidden)
      &:not(.controls-hidden) .navbar {
        transform: translate(-50%, 0);
        opacity: 1;
        pointer-events: auto;
      }
    }

    // Mobile: Transparent background, floating toggle
    @media (max-width: 768px) {
      .navbar {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        padding-top: 1rem;
        pointer-events: none; // Pass clicks through empty areas

        .logo, .desktop-nav {
          opacity: 0;
          pointer-events: none;
          display: none; // Hide logo to clear view
        }

        .mobile-toggle {
          pointer-events: auto;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          margin-left: auto; // Push to right if flex container
          
          transition: all 0.3s ease;
          opacity: 1;
          transform: translateY(0);
        }

        .mobile-menu {
          pointer-events: auto;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      }
      
      // Hide toggle when controls are hidden
      &.controls-hidden .mobile-toggle {
        opacity: 0;
        transform: translateY(-20px);
        pointer-events: none;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

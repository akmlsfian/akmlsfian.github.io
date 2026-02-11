<template>
  <div class="app-container">
    <ParticlesBackground />
    <NavBar />
    
    <main>
      <EntryScreen @enter="handleEnter" />
      
      <div v-if="entered" class="content-wrapper">
        <section id="about" class="page-section">
          <div class="container">
            <BioSection />
          </div>
        </section>

        <section id="skills" class="page-section">
          <div class="container">
            <SkillsSection />
          </div>
        </section>

        <section id="portfolio" class="page-section">
          <div class="container">
            <PortfolioGallery />
          </div>
        </section>
        
        <footer class="main-footer">
          <div class="container">
            <div class="footer-content">
              <p>&copy; {{ new Date().getFullYear() }} akmlsfian. All rights reserved.</p>
              <div class="social-links">
                <a href="#" class="social-icon"><Icon icon="mdi:github" width="24" /></a>
                <a href="#" class="social-icon"><Icon icon="mdi:linkedin" width="24" /></a>
                <a href="#" class="social-icon"><Icon icon="mdi:twitter" width="24" /></a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import BioSection from './components/BioSection.vue';
import SkillsSection from './components/SkillsSection.vue';
import PortfolioGallery from './components/PortfolioGallery.vue';
import EntryScreen from './components/EntryScreen.vue';
import ParticlesBackground from './components/ParticlesBackground.vue';
import { Icon } from '@iconify/vue';

export default {
  name: 'App',
  components: {
    NavBar,
    BioSection,
    SkillsSection,
    PortfolioGallery,
    EntryScreen,
    ParticlesBackground,
    Icon
  },
  data() {
    return {
      entered: false
    }
  },
  methods: {
    handleEnter() {
      this.entered = true;
      // Smooth scroll to top after entry
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
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

.content-wrapper {
  position: relative;
  z-index: 10;
  animation: fadeIn 1s ease-out;
}

.main-footer {
  padding: 4rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  margin-top: 4rem;
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1.5rem;
    }
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
  
  .social-links {
    display: flex;
    gap: 1.5rem;
    
    .social-icon {
      color: var(--text-muted);
      transition: all 0.3s ease;
      
      &:hover {
        color: var(--primary);
        transform: translateY(-3px);
      }
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

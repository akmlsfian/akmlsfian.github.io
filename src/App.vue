<template>
  <ThreeBackground />
  <EntryScreen v-if="!entered" @enter="startExperience" />
  
  <transition name="fade-app">
    <div v-if="entered" class="app-layout">
      <NavBar @navigate="scrollToSection" :activeSection="activeSection" />
      
      <main class="main-content" @scroll="onScroll">
        <section id="about" class="page-section" ref="about">
          <div class="container">
            <BioSection />
          </div>
        </section>

        <section id="skills" class="page-section" ref="skills">
          <div class="container">
            <SkillsSection />
          </div>
        </section>

        <section id="portfolio" class="page-section" ref="portfolio">
          <div class="container">
            <div class="section-heading">
              <h2>Gallery</h2>
              <div class="line-dec"></div>
              <p>A snapshot of my past web development projects.</p>
            </div>
            <PortfolioGallery />
          </div>
        </section>

        <section id="contact" class="page-section" ref="contact">
          <div class="container">
            <div class="section-heading">
              <h2>Contact Me</h2>
              <div class="line-dec"></div>
              <p>If you'd like to get in touch with me, please feel free to reach out at any time.</p>
            </div>
            
            <div class="contact-grid">
              <a href="https://wa.me/60194320001?text=Hi" target="_blank" class="contact-card">
                <Icon icon="mdi:whatsapp" width="32" />
                <span>+6 019-432 0001</span>
              </a>
              <a href="mailto:akmalsir46@gmail.com" class="contact-card">
                <Icon icon="mdi:email" width="32" />
                <span>akmalsir46@gmail.com</span>
              </a>
              <a href="https://linkedin.com/in/akmlsfian" target="_blank" class="contact-card">
                <Icon icon="mdi:linkedin" width="32" />
                <span>Akmal Sufian</span>
              </a>
              <a href="https://github.com/akmlsfian" target="_blank" class="contact-card">
                <Icon icon="mdi:github" width="32" />
                <span>akmlsfian</span>
              </a>
            </div>
            
             <div class="resume-links">
               <a href="/DOCS/RESUME (Software Programmer) MOHAMAD AKMAL.pdf" target="_blank" class="btn btn-primary">
                 <Icon icon="mdi:file-document" /> Download Resume
               </a>
             </div>
          </div>
        </section>
        
        <footer class="site-footer">
          <p>&copy; {{ new Date().getFullYear() }} Akmal Sufian. Built with Vue 3 & Three.js.</p>
        </footer>
      </main>
    </div>
  </transition>
</template>

<script>
import ThreeBackground from './components/ThreeBackground.vue';
import EntryScreen from './components/EntryScreen.vue';
import NavBar from './components/NavBar.vue';
import BioSection from './components/BioSection.vue';
import SkillsSection from './components/SkillsSection.vue';
import PortfolioGallery from './components/PortfolioGallery.vue';
import { Icon } from '@iconify/vue';

export default {
  name: 'App',
  components: {
    ThreeBackground,
    EntryScreen,
    NavBar,
    BioSection,
    SkillsSection,
    PortfolioGallery,
    Icon
  },
  data() {
    return {
      entered: false,
      activeSection: 'about'
    };
  },
  mounted() {
    // Check if user has already entered in this session (optional, skipping for now)
    window.addEventListener('scroll', this.onScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    startExperience() {
      this.entered = true;
      // Play sound here
    },
    scrollToSection(id) {
      this.activeSection = id;
    },
    onScroll() {
      const sections = ['about', 'skills', 'portfolio', 'contact'];
      for (const section of sections) {
        const el = this.$refs[section];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 300 && rect.bottom >= 300) {
            this.activeSection = section;
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
/* Layout */
.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 0;
  transition: margin-left 0.3s ease;
  
  @media (min-width: 1024px) {
    margin-left: 280px;
  }
}

.page-section {
  min-height: 100vh;
  padding: 6rem 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
}

.section-heading {
  margin-bottom: 3rem;
  
  .line-dec {
    width: 60px;
    height: 3px;
    background: var(--secondary);
    margin: 1rem 0;
  }
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.contact-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  color: var(--text-light);
  text-align: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--primary);
    transform: translateY(-5px);
  }
}

.resume-links {
  text-align: center;
}

.site-footer {
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.fade-app-enter-active {
  transition: opacity 1s ease;
}
.fade-app-enter-from {
  opacity: 0;
}
</style>

<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="nav-container">
      <div class="logo">
        <a href="#">
          <span class="text-primary">&lt;</span>
          akmlsfian
          <span class="text-primary">/&gt;</span>
        </a>
      </div>

      <!-- Desktop Menu -->
      <div class="desktop-nav">
        <div class="nav-links">
          <a 
            v-for="link in links" 
            :key="link.name" 
            :href="link.href"
            :class="{ 'active-link': activeSection === link.id }"
            @click.prevent="scrollTo(link.id)"
          >
            {{ link.name }}
          </a>
        </div>
        <a href="#contact" class="btn btn-sm btn-primary">Contact</a>
      </div>

      <!-- Mobile Toggle -->
      <button class="mobile-toggle" @click="toggleMobileMenu" aria-label="Toggle Menu">
        <Icon :icon="isMobileMenuOpen ? 'mdi:close' : 'mdi:menu'" width="24" />
      </button>

      <!-- Mobile Menu -->
      <transition name="slide-fade">
        <div v-if="isMobileMenuOpen" class="mobile-menu">
          <div class="mobile-links">
            <a 
              v-for="link in links" 
              :key="link.name" 
              :href="link.href"
              @click="handleMobileClick(link.id)"
            >
              {{ link.name }}
            </a>
            <a href="#contact" class="btn btn-primary" @click="isMobileMenuOpen = false">Let's Talk</a>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
  name: 'NavBar',
  components: { Icon },
  data() {
    return {
      isScrolled: false,
      isMobileMenuOpen: false,
      activeSection: 'about',
      links: [
        { name: 'About', href: '#about', id: 'about' },
        { name: 'Work', href: '#portfolio', id: 'portfolio' },
        { name: 'Systems', href: '#skills', id: 'skills' }
      ]
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll(); // Init
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
      
      // Active section detection
      const sections = ['about', 'portfolio', 'skills', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            this.activeSection = section;
          }
        }
      }
    },
    scrollTo(id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        this.activeSection = id;
      }
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    handleMobileClick(id) {
      this.scrollTo(id);
      this.isMobileMenuOpen = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 1.5rem 0;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  background: transparent;
  border-bottom: 1px solid transparent;

  &.scrolled {
    padding: 1rem 0;
    background: rgba(11, 11, 12, 0.8);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.logo {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.5px;
  color: var(--text-light);
  
  a {
    display: flex;
    align-items: center;
    gap: 2px;
  }
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 3rem;
  
  @media (max-width: 768px) {
    display: none;
  }
}

.nav-links {
  display: flex;
  gap: 2rem;
  
  a {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-muted);
    transition: color 0.2s ease;
    
    &:hover, &.active-link {
      color: var(--primary);
    }
  }
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 0;
  
  @media (max-width: 768px) {
    display: block;
  }
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: var(--surface-1);
  border-bottom: 1px solid var(--border-color);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  .mobile-links {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    
    a {
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--text-light);
    }
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

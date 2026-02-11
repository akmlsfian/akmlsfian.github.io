<template>
  <header class="navbar glass-panel" :class="{ 'scrolled': isScrolled }">
    <div class="container nav-container">
      <div class="logo">
        <a href="#" @click.prevent="scrollToTop">
          <span class="text-primary">&lt;</span>akmlsfian<span class="text-primary">/&gt;</span>
        </a>
      </div>

      <!-- Desktop Nav -->
      <nav class="desktop-nav">
        <ul class="nav-links">
          <li v-for="link in links" :key="link.id">
            <a :href="link.href" @click.prevent="handleNav(link.href)">
              {{ link.text }}
            </a>
          </li>
        </ul>
        <a href="#contact" class="btn btn-sm btn-primary" @click.prevent="handleNav('#contact')">
          Let's Talk
        </a>
      </nav>

      <!-- Mobile Toggle -->
      <button class="mobile-toggle" @click="isOpen = !isOpen" aria-label="Toggle Menu">
        <Icon :icon="isOpen ? 'mdi:close' : 'mdi:menu'" width="28" />
      </button>

      <!-- Mobile Menu -->
      <Transition name="slide-fade">
        <div v-if="isOpen" class="mobile-menu glass-panel">
          <ul class="mobile-links">
            <li v-for="link in links" :key="link.id">
              <a :href="link.href" @click.prevent="handleNav(link.href)">
                {{ link.text }}
              </a>
            </li>
            <li>
               <a href="#contact" class="btn btn-primary" @click.prevent="handleNav('#contact')">
                Let's Talk
              </a>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
  name: 'NavBar',
  components: { Icon },
  data() {
    return {
      isOpen: false,
      isScrolled: false,
      links: [
        { id: 'about', text: 'About', href: '#about' },
        { id: 'skills', text: 'Skills', href: '#skills' },
        { id: 'portfolio', text: 'Work', href: '#portfolio' }
      ]
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleNav(href) {
      this.isOpen = false;
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 3rem); /* Matches container padding roughly */
  max-width: 1400px; /* Aligns with main content */
  z-index: 1000;
  padding: 0.75rem 2rem; /* Match container padding */
  transition: all 0.3s var(--ease-in-out);
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.6); /* Darker initial state */

  &.scrolled {
    background: rgba(0, 0, 0, 0.85);
    border-color: var(--glass-border);
    box-shadow: var(--glass-shadow);
    padding: 0.75rem 2rem;
  }

  @media (max-width: 768px) {
    top: 1rem;
    width: calc(100% - 2rem);
    padding: 0.75rem 1.5rem;
  }
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0; /* Container padding handled by navbar */
  max-width: none; /* Let navbar handle width */
}

.logo {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: -1px;
  
  a {
    display: flex;
    align-items: center;
    gap: 2px;
  }
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    display: none;
  }
}

.nav-links {
  display: flex;
  gap: 2rem;
  
  a {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-light);
    opacity: 0.8;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--primary);
      transition: width 0.3s ease;
    }
    
    &:hover {
      opacity: 1;
      color: var(--primary);
      
      &::after {
        width: 100%;
      }
    }
  }
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 1rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.95);
  
  .mobile-links {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    
    a {
      font-size: 1.1rem;
      font-weight: 600;
      display: block;
    }
  }
}

.btn-sm {
  padding: 0.5rem 1.5rem;
  font-size: 0.8rem;
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

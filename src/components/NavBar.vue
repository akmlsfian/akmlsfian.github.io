<template>
  <div>
    <button class="toggle-btn" @click="toggleMenu" aria-label="Toggle Menu">
      <Icon :icon="isOpen ? 'mdi:close' : 'mdi:menu'" width="24" />
    </button>
    
    <nav class="sidebar" :class="{ 'is-open': isOpen }">
      <div class="sidebar-content">
        <div class="profile">
          <div class="avatar-container">
            <img src="/images/me.jpg" alt="Akmal Sufian" class="avatar" />
          </div>
          <h3>Akmal Sufian</h3>
          <p class="role">Software Programmer</p>
          <p class="role-sub">Web Developer</p>
        </div>

        <ul class="nav-links">
          <li v-for="link in links" :key="link.id">
            <a :href="link.href" @click.prevent="handleNav(link.href, link.id)" :class="{ active: activeSection === link.id }">
              {{ link.text }}
            </a>
          </li>
        </ul>

        <div class="socials">
          <a href="https://www.linkedin.com/in/akmlsfian" target="_blank" aria-label="LinkedIn"><Icon icon="mdi:linkedin" width="24" /></a>
          <a href="https://github.com/akmlsfian" target="_blank" aria-label="GitHub"><Icon icon="mdi:github" width="24" /></a>
          <a href="https://wa.me/60194320001?text=Hi" target="_blank" aria-label="WhatsApp"><Icon icon="mdi:whatsapp" width="24" /></a>
        </div>
        
        <div class="contact-info">
          <p>+6 019-432 0001</p>
          <p>akmalsir46@gmail.com</p>
        </div>
      </div>
    </nav>
    
    <!-- Overlay for mobile -->
    <div v-if="isOpen" class="overlay" @click="closeMenu"></div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
  name: 'NavBar',
  components: { Icon },
  props: {
    activeSection: {
      type: String,
      default: 'about'
    }
  },
  data() {
    return {
      isOpen: false,
      links: [
        { id: 'about', text: 'About Me', href: '#about' },
        { id: 'skills', text: 'Skills', href: '#skills' },
        { id: 'portfolio', text: 'Gallery', href: '#portfolio' },
        { id: 'contact', text: 'Contact Me', href: '#contact' }
      ]
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    closeMenu() {
      this.isOpen = false;
    },
    handleNav(href, id) {
      this.closeMenu();
      this.$emit('navigate', id);
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.toggle-btn {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  background: var(--primary);
  color: var(--bg-dark);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: transform 0.3s ease;
  
  @media (min-width: 1024px) {
    display: none;
  }
  
  &:hover {
    transform: scale(1.1);
  }
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  z-index: 999;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
  
  &.is-open {
    transform: translateX(0);
  }
  
  @media (min-width: 1024px) {
    transform: translateX(0);
    background: rgba(15, 23, 42, 0.8);
  }
}

.sidebar-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  text-align: center;
}

.profile {
  margin-bottom: 2rem;
  
  .avatar-container {
    width: 120px;
    height: 120px;
    margin: 0 auto 1.5rem;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }
  
  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-light);
  }
  
  p {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin: 0;
  }
}

.nav-links {
  margin-bottom: auto;
  
  li {
    margin-bottom: 0.5rem;
    display: block;
    width: 100%;
  }
  
  a {
    display: block;
    padding: 1rem;
    color: var(--text-muted);
    font-weight: 600;
    font-size: 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid transparent;
    
    &:hover, &.active {
      color: var(--primary);
      background: rgba(43, 241, 255, 0.05);
      border-color: rgba(43, 241, 255, 0.1);
    }
  }
}

.socials {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  a {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    color: var(--text-light);
    transition: all 0.3s ease;
    
    &:hover {
      background: var(--primary);
      color: var(--bg-dark);
      transform: translateY(-3px);
    }
  }
}

.contact-info {
  font-size: 0.75rem;
  color: var(--text-muted);
  
  p {
    margin: 0.25rem 0;
  }
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  backdrop-filter: blur(2px);
  
  @media (min-width: 1024px) {
    display: none;
  }
}
</style>

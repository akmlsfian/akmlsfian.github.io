<template>
  <div class="contact-section" id="contact">
    <div class="contact-content">
      <div class="section-header">
        <h2>Let's Connect</h2>
        <p class="section-subtitle">Open for opportunities and technical collaborations.</p>
      </div>
      
      <div class="contact-grid">
        <div class="contact-card">
          <div class="card-icon-wrapper">
            <Icon icon="mdi:email-fast-outline" class="card-icon" />
          </div>
          <div class="card-content">
            <h3>Email</h3>
            <p>{{ contact.email }}</p>
            <a :href="'mailto:' + contact.email" class="action-link">Send Message <Icon icon="mdi:arrow-right" class="arrow-icon" /></a>
          </div>
        </div>
        
        <div class="contact-card">
          <div class="card-icon-wrapper">
            <Icon icon="mdi:whatsapp" class="card-icon" />
          </div>
          <div class="card-content">
            <h3>WhatsApp</h3>
            <p>Quick Chat</p>
            <a :href="contact.whatsapp" target="_blank" class="action-link">Start Chat <Icon icon="mdi:arrow-right" class="arrow-icon" /></a>
          </div>
        </div>
        
        <div class="contact-card">
          <div class="card-icon-wrapper">
            <Icon icon="mdi:linkedin" class="card-icon" />
          </div>
          <div class="card-content">
            <h3>LinkedIn</h3>
            <p>Professional Network</p>
            <a :href="contact.linkedin" target="_blank" class="action-link">Connect <Icon icon="mdi:arrow-right" class="arrow-icon" /></a>
          </div>
        </div>

        <div class="contact-card">
          <div class="card-icon-wrapper">
            <Icon icon="mdi:github" class="card-icon" />
          </div>
          <div class="card-content">
            <h3>GitHub</h3>
            <p>Codebase & Contributions</p>
            <a :href="contact.github" target="_blank" class="action-link">View Profile <Icon icon="mdi:arrow-right" class="arrow-icon" /></a>
          </div>
        </div>
      </div>
    </div>
    
    <footer class="footer">
      <p>&copy; {{ new Date().getFullYear() }} {{ name }}. Engineered with Vue 3 & Three.js.</p>
    </footer>
  </div>
</template>

<script>
import biodata from '@/data/biodata.json';
import { Icon } from '@iconify/vue';

export default {
  name: 'ContactSection',
  components: { Icon },
  data() {
    return {
      contact: biodata.contact,
      name: biodata.name
    }
  }
}
</script>

<style lang="scss" scoped>
.contact-section {
  padding: 6rem 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 4rem;
  
  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-light);
    margin-bottom: 0.5rem;
  }
  
  .section-subtitle {
    color: var(--text-muted);
    font-size: 1.1rem;
    max-width: 600px;
  }
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 6rem;
}

.contact-card {
  background: var(--surface-1);
  border: 1px solid var(--border-color);
  padding: 2rem;
  border-radius: 4px; /* Minimal radius */
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
  
  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    
    .card-icon {
      color: var(--primary);
    }
  }
}

.card-icon-wrapper {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
}

.card-icon {
  font-size: 1.5rem;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.card-content {
  flex: 1;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-light);
    margin-bottom: 0.25rem;
  }
  
  p {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 1rem;
  }
}

.action-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-light);
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--primary);
    
    .arrow-icon {
      transform: translateX(4px);
    }
  }
  
  .arrow-icon {
    transition: transform 0.2s ease;
  }
}

.footer {
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
  text-align: center;
  
  p {
    color: var(--text-muted);
    font-size: 0.85rem;
    font-family: var(--font-mono);
    opacity: 0.7;
  }
}

@media (max-width: 768px) {
  .contact-section {
    padding: 4rem 1rem 2rem;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
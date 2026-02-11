<template>
  <div class="contact-section" id="contact">
    <div class="contact-content">
      <div class="section-heading">
        <h2 class="gradient-text">Let's Connect</h2>
        <div class="line-dec"></div>
      </div>
      
      <div class="contact-grid">
        <div class="contact-card glass-panel">
          <Icon icon="mdi:email-fast-outline" class="card-icon" />
          <h3>Email Me</h3>
          <p>{{ contact.email }}</p>
          <a :href="'mailto:' + contact.email" class="action-link">Send Email <Icon icon="mdi:arrow-right" /></a>
        </div>
        
        <div class="contact-card glass-panel">
          <Icon icon="mdi:whatsapp" class="card-icon" />
          <h3>WhatsApp</h3>
          <p>Quick Chat</p>
          <a :href="contact.whatsapp" target="_blank" class="action-link">Chat Now <Icon icon="mdi:arrow-right" /></a>
        </div>
        
        <div class="contact-card glass-panel">
          <Icon icon="mdi:linkedin" class="card-icon" />
          <h3>LinkedIn</h3>
          <p>Professional Network</p>
          <a :href="contact.linkedin" target="_blank" class="action-link">Connect <Icon icon="mdi:arrow-right" /></a>
        </div>

        <div class="contact-card glass-panel">
          <Icon icon="mdi:github" class="card-icon" />
          <h3>GitHub</h3>
          <p>Check my Code</p>
          <a :href="contact.github" target="_blank" class="action-link">Follow <Icon icon="mdi:arrow-right" /></a>
        </div>
      </div>
    </div>
    
    <footer class="footer">
      <p>&copy; {{ new Date().getFullYear() }} {{ name }}. All rights reserved.</p>
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
  padding: 4rem 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-heading {
  text-align: center;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0;
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }
  
  .line-dec {
    width: 80px;
    height: 4px;
    background: var(--primary);
    margin-top: 0.5rem;
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
  }
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.contact-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 229, 255, 0.15);
    border-color: rgba(0, 229, 255, 0.3);
    
    .card-icon {
      color: var(--primary);
      transform: scale(1.1);
    }
  }
  
  .card-icon {
    font-size: 3rem;
    color: var(--text-muted);
    margin-bottom: 1rem;
    transition: all 0.3s;
  }
  
  h3 {
    color: var(--text-light);
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
  }
  
  p {
    color: var(--text-muted);
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }
  
  .action-link {
    margin-top: auto;
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.footer {
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}
</style>
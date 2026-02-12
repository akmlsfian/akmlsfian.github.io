<template>
  <div class="bio-section">
    <div class="bio-grid">
      <!-- Main Content -->
      <div class="bio-content">
        <div class="intro-header">
          <h1 class="name">{{ bio.name }}</h1>
          <h2 class="role">{{ bio.title }}</h2>
          <p class="subtitle">{{ bio.subtitle }}</p>
        </div>

        <div class="bio-body">
          <p class="background-text">{{ bio.background }}</p>
          
          <div class="action-row">
            <a href="#contact" class="btn btn-primary">
              Contact Me
            </a>
            <a :href="bio.contact.github" target="_blank" class="btn btn-outline">
              <Icon icon="mdi:github" /> GitHub
            </a>
          </div>
        </div>
      </div>
      
      <!-- Traits / Philosophy -->
      <div class="traits-column">
        <div 
          v-for="(trait, index) in bio.traits" 
          :key="trait.title" 
          class="trait-card"
        >
          <div class="trait-icon">
            <Icon :icon="trait.icon" />
          </div>
          <div class="trait-info">
            <h4>{{ trait.title }}</h4>
            <p>{{ trait.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bioData from '@/data/biodata.json';
import { Icon } from '@iconify/vue';

export default {
  name: 'BioSection',
  components: { Icon },
  data() {
    return {
      bio: bioData
    };
  }
}
</script>

<style lang="scss" scoped>
.bio-section {
  padding: 4rem 0;
}

.bio-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

.intro-header {
  margin-bottom: 2rem;
  
  .name {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 700;
    color: var(--text-light);
    margin-bottom: 0.5rem;
    letter-spacing: -0.03em;
  }
  
  .role {
    font-size: clamp(1.5rem, 3vw, 2rem);
    color: var(--primary);
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .subtitle {
    font-family: 'Space Mono', monospace;
    color: var(--text-muted);
    font-size: 1.1rem;
  }
}

.background-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-muted);
  margin-bottom: 2rem;
  max-width: 65ch;
}

.action-row {
  display: flex;
  gap: 1rem;
}

.traits-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.trait-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 8px;
  background: var(--surface-1);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--primary);
    transform: translateX(4px);
  }
  
  .trait-icon {
    font-size: 1.5rem;
    color: var(--primary);
    flex-shrink: 0;
    margin-top: 0.25rem;
  }
  
  .trait-info {
    h4 {
      font-size: 1.1rem;
      color: var(--text-light);
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    p {
      font-size: 0.95rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin: 0;
    }
  }
}
</style>

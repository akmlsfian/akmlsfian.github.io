<template>
  <div class="skills-wrapper">
    <div class="section-header">
      <h2>Engineering Context</h2>
      <p>Technical systems and standards deployed in production environments.</p>
    </div>

    <div class="skills-grid">
      <div 
        v-for="(domain, index) in skills" 
        :key="domain.category" 
        class="domain-card"
      >
        <div class="card-header">
          <h3>{{ domain.category }}</h3>
          <p class="domain-desc">{{ domain.description }}</p>
        </div>

        <div class="tech-stack">
          <span 
            v-for="tech in domain.stack" 
            :key="tech" 
            class="tech-pill"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import skillsData from '@/data/skills.json';

export default {
  name: 'SkillsSection',
  data() {
    return {
      skills: skillsData
    };
  }
}
</script>

<style lang="scss" scoped>
.skills-wrapper {
  width: 100%;
}

.section-header {
  margin-bottom: 4rem;
  
  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    margin-bottom: 1rem;
    color: var(--text-light);
  }
  
  p {
    color: var(--text-muted);
    font-size: 1.1rem;
    max-width: 60ch;
  }
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.domain-card {
  background: var(--surface-1);
  border: 1px solid var(--border-color);
  padding: 2rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  transition: border-color 0.2s ease;
  
  &:hover {
    border-color: var(--primary);
  }
}

.card-header {
  h3 {
    font-size: 1.5rem;
    color: var(--text-light);
    margin-bottom: 0.5rem;
  }
  
  .domain-desc {
    font-size: 0.95rem;
    color: var(--text-muted);
    line-height: 1.5;
  }
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tech-pill {
  font-family: 'Space Mono', monospace;
  font-size: 0.85rem;
  color: var(--primary);
  background: rgba(0, 224, 224, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid rgba(0, 224, 224, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 224, 224, 0.1);
    transform: translateY(-1px);
  }
}

@media (max-width: 768px) {
  .section-header {
    margin-bottom: 2rem;
  }
  
  .domain-card {
    padding: 1.5rem;
  }
}
</style>

<template>
  <div class="skills-wrapper">
    <div class="section-heading text-center">
      <h2 class="gradient-text">Technical Arsenal</h2>
      <div class="line-dec mx-auto"></div>
      <p>A comprehensive overview of my technical capabilities and proficiency levels.</p>
    </div>

    <div class="skills-grid">
      <div 
        v-for="(cat, index) in skills" 
        :key="cat.category" 
        class="skill-category glass-panel"
        :style="{ animationDelay: `${index * 0.15}s` }"
      >
        <div class="category-header">
          <div class="header-icon">
            <Icon v-if="cat.category === 'Backend'" icon="mdi:server-network" />
            <Icon v-else-if="cat.category === 'Frontend'" icon="mdi:monitor-dashboard" />
            <Icon v-else-if="cat.category === 'Database'" icon="mdi:database-search" />
            <Icon v-else icon="mdi:code-braces" />
          </div>
          <h3>{{ cat.category }}</h3>
        </div>

        <div class="skills-list">
          <div v-for="skill in cat.skills" :key="skill.name" class="skill-item">
            <div class="skill-info">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-percentage">{{ skill.level }}%</span>
            </div>
            <div class="progress-track">
              <div 
                class="progress-fill" 
                :style="{ width: `${skill.level}%` }"
              >
                <div class="glow-point"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import skillsData from '@/data/skills.json';
import { Icon } from '@iconify/vue';

export default {
  name: 'SkillsSection',
  components: { Icon },
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

.section-heading {
  margin-bottom: 4rem;
  text-align: center;
  
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
    margin: 1rem auto;
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(43, 241, 255, 0.4);
  }
  
  p {
    max-width: 600px;
    margin: 0 auto;
    opacity: 0.7;
  }
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.skill-category {
  padding: 2rem;
  transition: all 0.4s var(--ease-out-expo);
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    transform: translateY(-5px);
    border-color: var(--primary);
    box-shadow: 0 10px 40px -10px rgba(43, 241, 255, 0.1);
    
    .header-icon {
      background: var(--primary);
      color: var(--bg-dark);
      transform: scale(1.1) rotate(5deg);
    }
  }
}

.category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    font-size: 1.5rem;
    color: var(--text-light);
  }
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--primary);
  transition: all 0.4s var(--ease-out-expo);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skill-item {
  .skill-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
    font-weight: 500;
    
    .skill-name { color: var(--text-light); }
    .skill-percentage { color: var(--primary); font-family: 'Space Mono', monospace; }
  }
}

.progress-track {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 3px;
  position: relative;
  transition: width 1.5s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 0 10px rgba(43, 241, 255, 0.5);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transform: translateX(-100%);
    animation: shimmer 2s infinite;
  }
}

.glow-point {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 15px #fff;
  opacity: 0.8;
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.skill-category {
  animation: slideUp 0.8s var(--ease-out-expo) backwards;
}
</style>

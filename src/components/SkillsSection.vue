<template>
  <div class="skills-container">
    <div class="section-heading">
      <h2>Skills & Traits</h2>
      <div class="line-dec"></div>
      <p>A showcase of my technical proficiency and professional capabilities.</p>
    </div>

    <div class="skills-grid">
      <div v-for="category in skills" :key="category.category" class="skill-category">
        <h3>{{ category.category }}</h3>
        <div class="skill-list">
          <div v-for="skill in category.skills" :key="skill.name" class="skill-item">
            <div class="skill-info">
              <span>{{ skill.name }}</span>
              <span>{{ skill.level }}%</span>
            </div>
            <div class="progress-bg">
              <div 
                class="progress-fill" 
                :style="{ width: skill.level + '%' }"
                :class="{ 'high': skill.level > 80, 'med': skill.level <= 80 && skill.level > 60 }"
              ></div>
            </div>
          </div>
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
.section-heading {
  margin-bottom: 3rem;
  
  .line-dec {
    width: 60px;
    height: 3px;
    background: var(--secondary);
    margin: 1rem 0;
  }
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.skill-category {
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: var(--primary);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.5rem;
    display: inline-block;
  }
}

.skill-item {
  margin-bottom: 1.5rem;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-light);
}

.progress-bg {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--text-muted);
  border-radius: 4px;
  transition: width 1s ease-out;
  
  &.high {
    background: var(--primary);
    box-shadow: 0 0 10px rgba(43, 241, 255, 0.3);
  }
  
  &.med {
    background: #64748b;
  }
}
</style>

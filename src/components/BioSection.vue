<template>
  <div class="bio-wrapper">
    <div class="bio-content">
      <div class="section-heading">
        <h2 class="gradient-text">About Me</h2>
        <div class="line-dec"></div>
      </div>
      
      <div class="bio-text glass-panel">
        <p v-html="bio.about"></p>
        <div class="divider"></div>
        <h3 class="sub-heading">My Journey</h3>
        <p>{{ bio.background }}</p>
      </div>
      
      <div class="action-area">
        <a href="#contact" class="btn btn-primary">Let's Connect</a>
      </div>
    </div>

    <div class="traits-wrapper">
      <div class="traits-grid">
        <div 
          v-for="(trait, index) in bio.traits" 
          :key="trait.title" 
          class="trait-card glass-panel"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="icon-box">
            <Icon v-if="trait.title.includes('Leader')" icon="mdi:account-group-outline" width="32" />
            <Icon v-else-if="trait.title.includes('Fast')" icon="mdi:rocket-launch-outline" width="32" />
            <Icon v-else icon="mdi:brain" width="32" />
          </div>
          <div class="trait-content">
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
.bio-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

.section-heading {
  margin-bottom: 2rem;
  
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
    box-shadow: 0 0 10px rgba(43, 241, 255, 0.4);
  }
}

.bio-text {
  padding: 2.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--primary);
    opacity: 0.5;
  }
  
  p {
    margin-bottom: 0;
  }
  
  .divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 2rem 0;
  }
  
  .sub-heading {
    color: var(--primary);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
}

.traits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.trait-card {
  padding: 2rem;
  transition: all 0.4s var(--ease-out-expo);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    border-color: var(--primary);
    box-shadow: 0 10px 40px -10px rgba(43, 241, 255, 0.15);
    
    .icon-box {
      background: var(--primary);
      color: var(--bg-dark);
      transform: rotateY(180deg);
    }
  }
}

.icon-box {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 1.5rem;
  transition: all 0.5s var(--ease-out-expo);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.trait-content {
  h4 {
    color: var(--text-light);
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
  }
  
  p {
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0;
    opacity: 0.8;
  }
}

/* Animations */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.trait-card {
  animation: slideUp 0.8s var(--ease-out-expo) backwards;
}
</style>

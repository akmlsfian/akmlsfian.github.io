<template>
  <div class="bio-container">
    <div class="section-heading">
      <h2>About Me</h2>
      <div class="line-dec"></div>
      <p v-html="bio.about"></p>
    </div>

    <div class="section-heading">
      <h2>My Background</h2>
      <div class="line-dec"></div>
      <p>{{ bio.background }}</p>
    </div>

    <div class="traits-grid">
      <div v-for="trait in bio.traits" :key="trait.title" class="trait-card">
        <div class="icon-box">
          <!-- Mapping titles to icons crudely -->
          <Icon v-if="trait.title.includes('Leader')" icon="mdi:account-group" width="32" />
          <Icon v-else-if="trait.title.includes('Fast')" icon="mdi:rocket-launch" width="32" />
          <Icon v-else icon="mdi:brain" width="32" />
        </div>
        <h4>{{ trait.title }}</h4>
        <p>{{ trait.description }}</p>
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
.section-heading {
  margin-bottom: 3rem;
  
  h2 {
    color: var(--text-light);
    margin-bottom: 1rem;
  }
  
  .line-dec {
    width: 60px;
    height: 3px;
    background: var(--secondary);
    margin-bottom: 1.5rem;
  }
}

.traits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.trait-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(43, 241, 255, 0.2);
    transform: translateY(-5px);
    
    .icon-box {
      color: var(--primary);
      transform: scale(1.1);
    }
  }
}

.icon-box {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: var(--text-light);
  transition: all 0.3s ease;
}

h4 {
  color: var(--text-light);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}
</style>

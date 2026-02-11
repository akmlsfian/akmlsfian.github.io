<template>
  <div class="gallery-container">
    <div class="filters">
      <button 
        v-for="filter in filters" 
        :key="filter.value"
        @click="activeFilter = filter.value"
        :class="{ active: activeFilter === filter.value }"
        class="filter-btn"
      >
        {{ filter.label }}
      </button>
    </div>

    <transition-group name="gallery-fade" tag="div" class="gallery-grid">
      <div 
        v-for="item in filteredItems" 
        :key="item.id" 
        class="gallery-item"
        @click="openLightbox(item)"
      >
        <div class="image-wrapper">
          <img :src="item.image" :alt="item.title" loading="lazy" />
          <div class="overlay">
            <div class="content">
              <h4>{{ item.title }}</h4>
              <span class="tech">{{ item.tech }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition-group>

    <transition name="fade">
      <div v-if="selectedItem" class="lightbox" @click="selectedItem = null">
        <div class="lightbox-content" @click.stop>
          <button class="close-btn" @click="selectedItem = null">
            <Icon icon="mdi:close" width="24" />
          </button>
          <img :src="selectedItem.image" :alt="selectedItem.title" />
          <div class="info">
            <h3>{{ selectedItem.title }}</h3>
            <p>{{ selectedItem.description }}</p>
            <span class="badge">{{ selectedItem.tech }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import portfolioData from '@/data/portfolio.json';
import { Icon } from '@iconify/vue';

export default {
  name: 'PortfolioGallery',
  components: { Icon },
  data() {
    return {
      items: portfolioData,
      activeFilter: 'all',
      selectedItem: null,
      filters: [
        { label: 'All', value: 'all' },
        { label: 'Career', value: 'career' },
        { label: 'Freelance', value: 'freelance' }
      ]
    };
  },
  computed: {
    filteredItems() {
      if (this.activeFilter === 'all') {
        return this.items;
      }
      return this.items.filter(item => item.category === this.activeFilter);
    }
  },
  methods: {
    openLightbox(item) {
      this.selectedItem = item;
    }
  }
}
</script>

<style lang="scss" scoped>
.gallery-container {
  padding: 2rem 0;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.filter-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.5rem 1rem;
  position: relative;
  transition: color 0.3s ease;
  text-transform: uppercase;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--primary);
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  &:hover, &.active {
    color: var(--text-light);
    &::after {
      width: 100%;
    }
  }
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.gallery-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 16/10;
  
  &:hover {
    .image-wrapper img {
      transform: scale(1.05);
    }
    .overlay {
      opacity: 1;
    }
  }
}

.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
  
  .content {
    text-align: center;
    padding: 1rem;
    transform: translateY(20px);
    transition: transform 0.3s ease;
  }
}

.gallery-item:hover .content {
  transform: translateY(0);
}

h4 {
  color: var(--text-light);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.tech {
  color: var(--primary);
  font-size: 0.875rem;
  font-weight: 600;
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.lightbox-content {
  background: var(--bg-card);
  border-radius: 8px;
  overflow: hidden;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  img {
    width: 100%;
    height: auto;
    max-height: 60vh;
    object-fit: contain;
    background: #000;
  }
  
  .info {
    padding: 1.5rem;
    
    h3 {
      margin-bottom: 0.5rem;
      color: var(--text-light);
    }
    
    p {
      color: var(--text-muted);
      margin-bottom: 1rem;
    }
    
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: rgba(43, 241, 255, 0.1);
      color: var(--primary);
      border-radius: 99px;
      font-size: 0.875rem;
      font-weight: 600;
    }
  }
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0,0,0,0.5);
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
  
  &:hover {
    background: var(--secondary);
  }
}

/* Transitions */
.gallery-fade-move,
.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition: all 0.5s ease;
}

.gallery-fade-enter-from,
.gallery-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.gallery-fade-leave-active {
  position: absolute;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

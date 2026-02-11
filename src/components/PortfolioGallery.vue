<template>
  <div class="portfolio-wrapper">
    <div class="section-heading text-center">
      <h2 class="gradient-text">Selected Works</h2>
      <div class="line-dec mx-auto"></div>
      <p>A collection of projects that define my journey.</p>
    </div>

    <div class="gallery-grid">
      <div 
        v-for="(project, index) in portfolio" 
        :key="project.title" 
        class="project-card glass-panel"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @click="openLightbox(project)"
      >
        <div class="image-wrapper">
          <img :src="project.image" :alt="project.title" loading="lazy" />
          
          <!-- Project Icon Overlay -->
          <div v-if="project.icon" class="project-icon-overlay">
            <img :src="project.icon" :alt="project.title + ' icon'" />
          </div>

          <div class="overlay">
            <div class="overlay-content">
              <Icon icon="mdi:eye-outline" width="48" />
              <span>View Details</span>
            </div>
          </div>
        </div>
        
        <div class="card-content">
          <div class="card-header">
            <h3>{{ project.title }}</h3>
            <span class="category-tag">{{ project.category }}</span>
          </div>
          <p class="short-desc">{{ truncateText(project.description, 80) }}</p>
          <div class="tech-stack-mini">
            <span v-for="tech in project.technologies.slice(0, 3)" :key="tech" class="tech-dot"></span>
            <span class="tech-more" v-if="project.technologies.length > 3">+{{ project.technologies.length - 3 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Transition name="fade">
      <div v-if="selectedProject" class="lightbox-overlay" @click.self="closeLightbox">
        <div class="lightbox-content glass-panel">
          <button class="close-btn" @click="closeLightbox">
            <Icon icon="mdi:close" width="24" />
          </button>
          
          <div class="lightbox-grid">
            <div class="lightbox-image">
              <div class="image-container">
                <Transition name="fade" mode="out-in">
                  <img :key="currentImage" :src="currentImage" :alt="selectedProject.title" />
                </Transition>
                
                <div v-if="hasGallery" class="gallery-controls">
                  <button class="control-btn prev" @click.stop="prevImage">
                    <Icon icon="mdi:chevron-left" width="32" />
                  </button>
                  <button class="control-btn next" @click.stop="nextImage">
                    <Icon icon="mdi:chevron-right" width="32" />
                  </button>
                  
                  <div class="indicators">
                    <span 
                      v-for="(img, idx) in galleryImages" 
                      :key="idx" 
                      class="dot"
                      :class="{ active: idx === currentImageIndex }"
                      @click.stop="currentImageIndex = idx"
                    ></span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="lightbox-details">
              <h3>{{ selectedProject.title }}</h3>
              <span class="category-badge">{{ selectedProject.category }}</span>
              
              <div class="divider"></div>
              
              <p class="description">{{ selectedProject.description }}</p>
              
              <div class="tech-stack-section">
                <h4>Technologies</h4>
                <div class="tags">
                  <span v-for="tech in selectedProject.technologies" :key="tech" class="tech-tag">
                    {{ tech }}
                  </span>
                </div>
              </div>
              
              <div class="actions">
                <a v-if="selectedProject.link" :href="selectedProject.link" target="_blank" class="btn btn-primary">
                  <Icon icon="mdi:rocket-launch" /> Live Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
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
      portfolio: portfolioData.map(item => ({
        ...item,
        technologies: item.technologies || (item.tech ? [item.tech] : [])
      })),
      selectedProject: null,
      currentImageIndex: 0
    };
  },
  computed: {
    galleryImages() {
      if (!this.selectedProject) return [];
      return this.selectedProject.gallery || [this.selectedProject.image];
    },
    currentImage() {
      return this.galleryImages[this.currentImageIndex];
    },
    hasGallery() {
      return this.galleryImages.length > 1;
    }
  },
  methods: {
    truncateText(text, length) {
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    },
    openLightbox(project) {
      this.selectedProject = project;
      this.currentImageIndex = 0;
      document.body.style.overflow = 'hidden';
    },
    closeLightbox() {
      this.selectedProject = null;
      document.body.style.overflow = 'auto';
    },
    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryImages.length;
    },
    prevImage() {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
    }
  }
}
</script>

<style lang="scss" scoped>
.portfolio-wrapper {
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

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.project-card {
  overflow: hidden;
  transition: all 0.4s var(--ease-out-expo);
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-8px);
    border-color: var(--primary);
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
    
    .image-wrapper img {
      transform: scale(1.1);
    }
    
    .overlay {
      opacity: 1;
    }
  }
}

.image-wrapper {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s var(--ease-out-expo);
  }

  .project-icon-overlay {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 48px;
    height: 48px;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 6px;
    z-index: 5;
    backdrop-filter: blur(4px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 0;
      transition: none; /* Don't scale icon on hover */
    }
  }
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  .overlay-content {
    text-align: center;
    color: var(--primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    
    span {
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  }
}

.card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  
  h3 {
    font-size: 1.25rem;
    color: var(--text-light);
    margin: 0;
  }
  
  .category-tag {
    font-size: 0.75rem;
    color: var(--primary);
    background: rgba(43, 241, 255, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    white-space: nowrap;
  }
}

.short-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
  flex: 1;
}

.tech-stack-mini {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .tech-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--primary);
    opacity: 0.6;
  }
  
  .tech-more {
    font-size: 0.8rem;
    color: var(--text-muted);
  }
}

/* Lightbox */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.lightbox-content {
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0;
  
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
    
    &:hover {
      background: var(--secondary);
    }
  }
}

.lightbox-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.lightbox-image {
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 400px;
  
  .image-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    max-height: 600px;
  }
  
  .gallery-controls {
    position: absolute;
    inset: 0;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .control-btn {
    pointer-events: auto;
    background: rgba(0, 0, 0, 0.3);
    border: none;
    color: white;
    padding: 1rem 0.5rem;
    cursor: pointer;
    transition: background 0.3s;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    
    &:hover {
      background: rgba(0, 0, 0, 0.6);
      color: var(--primary);
    }
    
    &.prev { left: 0; border-radius: 0 8px 8px 0; }
    &.next { right: 0; border-radius: 8px 0 0 8px; }
  }
  
  .indicators {
    pointer-events: auto;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 10;
    
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background: rgba(255, 255, 255, 0.8);
      }
      
      &.active {
        background: var(--primary);
        transform: scale(1.2);
        box-shadow: 0 0 8px var(--primary);
      }
    }
  }
}

.lightbox-details {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  h3 {
    font-size: 2rem;
    color: var(--text-light);
  }
  
  .category-badge {
    display: inline-block;
    align-self: flex-start;
    padding: 0.25rem 0.75rem;
    background: var(--primary);
    color: var(--bg-dark);
    font-weight: 700;
    font-size: 0.8rem;
    border-radius: 99px;
    text-transform: uppercase;
  }
  
  .divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .description {
    font-size: 1rem;
    line-height: 1.7;
    color: #cbd5e1;
  }
  
  .tech-stack-section {
    h4 {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      
      .tech-tag {
        font-size: 0.85rem;
        padding: 0.25rem 0.75rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        color: var(--text-light);
      }
    }
  }
  
  .actions {
    margin-top: auto;
    display: flex;
    gap: 1rem;
    
    @media (max-width: 480px) {
      flex-direction: column;
    }
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="portfolio-wrapper">
    <div class="section-header">
      <h2>Selected Work</h2>
      <p>Case studies in system architecture, performance optimization, and product engineering.</p>
    </div>

    <div class="gallery-grid">
      <div 
        v-for="(project, index) in portfolio" 
        :key="project.id" 
        class="project-card"
        @click="openLightbox(project)"
      >
        <div class="image-wrapper">
          <img :src="project.image" :alt="project.title" loading="lazy" />
          <div class="overlay">
            <div class="overlay-content">
              <span>View Case Study</span>
            </div>
          </div>
          <div v-if="project.icon" class="project-icon-wrapper">
             <img :src="project.icon" :alt="project.title + ' icon'" class="project-icon" />
          </div>
        </div>

        <div class="card-content">
          <div class="card-header">
            <h3>{{ project.title }}</h3>
            <span class="category-tag">{{ project.category }}</span>
          </div>
          <p class="role-tag">{{ project.role }}</p>
          <div class="tech-stack-mini">
             <span v-for="t in (project.stack || []).slice(0, 3)" :key="t" class="tech-dot"></span>
             <span class="tech-text">{{ (project.stack || []).slice(0, 3).join(' · ') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition name="zoom">
        <div v-if="selectedProject" class="lightbox-overlay" @click.self="closeLightbox">
          <div class="lightbox-content">
            <button class="close-btn" @click="closeLightbox">
              <Icon icon="mdi:close" width="24" />
            </button>
            
            <div class="lightbox-grid">
              <div class="lightbox-image-container" @click="toggleFullscreen">
                <img :src="currentImage" :alt="selectedProject.title" class="lightbox-image" />
                <div class="fullscreen-hint">
                  <Icon icon="mdi:fullscreen" /> Click to expand
                </div>
                
                <!-- Gallery Navigation -->
                <div v-if="galleryImages.length > 1" class="gallery-nav">
                  <button class="nav-btn prev" @click.stop="prevImage" :disabled="currentImageIndex === 0">
                    <Icon icon="mdi:chevron-left" width="24" />
                  </button>
                  <button class="nav-btn next" @click.stop="nextImage" :disabled="currentImageIndex === galleryImages.length - 1">
                    <Icon icon="mdi:chevron-right" width="24" />
                  </button>
                  <div class="gallery-indicators">
                    <span 
                      v-for="(img, idx) in galleryImages" 
                      :key="idx" 
                      class="indicator" 
                      :class="{ active: idx === currentImageIndex }"
                      @click.stop="currentImageIndex = idx"
                    ></span>
                  </div>
                </div>
              </div>

              <div class="lightbox-details">
                <div class="details-header">
                  <span class="category-badge">{{ selectedProject.category }}</span>
                  <h3>{{ selectedProject.title }}</h3>
                  <div class="links" v-if="selectedProject.links">
                    <a v-if="selectedProject.links.demo" :href="selectedProject.links.demo" target="_blank" class="link-btn">
                      <Icon icon="mdi:web" /> Live URL
                    </a>
                    <a v-if="selectedProject.links.repo" :href="selectedProject.links.repo" target="_blank" class="link-btn">
                      <Icon icon="mdi:github" /> Code
                    </a>
                  </div>
                </div>

                <div class="case-study-grid">
                  <div class="study-section" v-if="selectedProject.problem">
                    <h4>Problem</h4>
                    <p>{{ selectedProject.problem }}</p>
                  </div>
                  
                  <div class="study-section" v-if="selectedProject.solution">
                    <h4>Solution</h4>
                    <p>{{ selectedProject.solution }}</p>
                  </div>

                  <div class="study-section" v-if="selectedProject.architecture">
                    <h4>Architecture</h4>
                    <p>{{ selectedProject.architecture }}</p>
                  </div>

                  <div class="study-section" v-if="selectedProject.performance">
                    <h4>Performance</h4>
                    <p>{{ selectedProject.performance }}</p>
                  </div>

                  <!-- Senior Details Grid -->
                  <div class="senior-grid">
                    <div class="study-section" v-if="selectedProject.constraints && selectedProject.constraints.length">
                       <h4><Icon icon="mdi:alert-octagon-outline" class="inline-icon" /> Constraints</h4>
                       <ul class="detail-list">
                         <li v-for="(item, i) in selectedProject.constraints" :key="i">{{ item }}</li>
                       </ul>
                    </div>

                    <div class="study-section" v-if="selectedProject.decisions && selectedProject.decisions.length">
                       <h4><Icon icon="mdi:chess-knight" class="inline-icon" /> Key Decisions</h4>
                       <ul class="detail-list">
                         <li v-for="(item, i) in selectedProject.decisions" :key="i">{{ item }}</li>
                       </ul>
                    </div>

                    <div class="study-section full-width" v-if="selectedProject.tradeoffs && selectedProject.tradeoffs.length">
                       <h4><Icon icon="mdi:scale-balance" class="inline-icon" /> Trade-offs</h4>
                       <ul class="detail-list">
                         <li v-for="(item, i) in selectedProject.tradeoffs" :key="i" class="tradeoff-item">{{ item }}</li>
                       </ul>
                    </div>
                    
                     <div class="study-section full-width highlight" v-if="selectedProject.impact">
                       <h4><Icon icon="mdi:chart-line-variant" class="inline-icon" /> Impact & Scale</h4>
                       <p class="impact-text">{{ selectedProject.impact }}</p>
                    </div>
                  </div>

                  <!-- Deep Dive Section -->
                  <div class="deep-dive-container" v-if="selectedProject.deepDive">
                      <button class="deep-dive-btn" @click="toggleDeepDive" :class="{ active: isDeepDiveOpen }">
                         <span class="btn-content">
                            <Icon icon="mdi:hub" class="icon-pulse" />
                            Architecture Deep Dive
                         </span>
                         <Icon :icon="isDeepDiveOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
                      </button>
                      
                      <div v-if="isDeepDiveOpen" class="deep-dive-content">
                          <div class="diagram-scroll">
                              <div class="system-flow">
                                  <div v-for="(node, idx) in selectedProject.deepDive.nodes" :key="node.id" class="flow-step">
                                      <div class="node-card" :class="node.type">
                                          <span class="node-icon">
                                              <Icon v-if="node.type === 'input'" icon="mdi:microphone" />
                                              <Icon v-else-if="node.type === 'process'" icon="mdi:memory" />
                                              <Icon v-else-if="node.type === 'logic'" icon="mdi:gate" />
                                              <Icon v-else-if="node.type === 'network'" icon="mdi:ethernet" />
                                              <Icon v-else-if="node.type === 'cloud'" icon="mdi:cloud-processing" />
                                              <Icon v-else-if="node.type === 'ai'" icon="mdi:brain" />
                                              <Icon v-else-if="node.type === 'output'" icon="mdi:monitor-dashboard" />
                                          </span>
                                          <span class="node-label">{{ node.label }}</span>
                                      </div>
                                      <div v-if="idx < selectedProject.deepDive.nodes.length - 1" class="flow-arrow">
                                          <span class="arrow-label" v-if="selectedProject.deepDive.edges && selectedProject.deepDive.edges[idx]">{{ selectedProject.deepDive.edges[idx].label }}</span>
                                          <Icon icon="mdi:arrow-right" class="arrow-icon" />
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <p class="deep-dive-text">{{ selectedProject.deepDive.description }}</p>
                      </div>
                  </div>
                </div>
                
                <div class="tech-stack-section">
                  <h4>Technology Stack</h4>
                  <div class="tags">
                    <span v-for="tech in (selectedProject.stack || [])" :key="tech" class="tech-tag">
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Fullscreen Viewer -->
      <Transition name="fade">
        <div v-if="isFullscreen && selectedProject" class="fullscreen-viewer" @click.self="toggleFullscreen">
          <button class="fs-close-btn" @click="toggleFullscreen">
            <Icon icon="mdi:close" width="32" />
          </button>
          <img :src="currentImage" :alt="selectedProject.title" class="fs-image" />
        </div>
      </Transition>
    </Teleport>
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
      portfolio: portfolioData,
      selectedProject: null,
      currentImageIndex: 0,
      isFullscreen: false,
      isDeepDiveOpen: false
    };
  },
  computed: {
    galleryImages() {
      if (!this.selectedProject) return [];
      // Support array of images if available, else single image
      return this.selectedProject.gallery || [this.selectedProject.image];
    },
    currentImage() {
      return this.galleryImages[this.currentImageIndex];
    }
  },
  methods: {
    openLightbox(project) {
      this.selectedProject = project;
      this.currentImageIndex = 0;
      this.isFullscreen = false;
      this.isDeepDiveOpen = true; // Auto-open for visibility or false? Let's default to false to keep it clean, but user asked for "expandable".
      this.isDeepDiveOpen = false;
      document.body.style.overflow = 'hidden';
    },
    toggleDeepDive() {
      this.isDeepDiveOpen = !this.isDeepDiveOpen;
    },
    closeLightbox() {
      this.selectedProject = null;
      this.isFullscreen = false;
      document.body.style.overflow = '';
    },
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
    },
    nextImage() {
      if (this.currentImageIndex < this.galleryImages.length - 1) {
        this.currentImageIndex++;
      }
    },
    prevImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.portfolio-wrapper {
  width: 100%;
}

.project-icon-wrapper {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 48px;
  height: 48px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  .project-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.gallery-nav {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  
  .nav-btn {
    pointer-events: auto;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    backdrop-filter: blur(4px);
    
    &:hover:not(:disabled) {
      background: var(--primary);
    }
    
    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
}

.gallery-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  pointer-events: auto;
  
  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.2s;
    
    &.active {
      background: var(--primary);
      transform: scale(1.2);
    }
    
    &:hover {
      background: rgba(255, 255, 255, 0.8);
    }
  }
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

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.project-card {
  background: var(--surface-1);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s var(--ease-out-quart);
  display: flex;
  flex-direction: column;
  
  &:hover {
    border-color: var(--primary);
    transform: translateY(-4px);
    
    .image-wrapper img {
      transform: scale(1.05);
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
  background: var(--surface-2);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    .overlay-content {
      background: var(--surface-1);
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      color: var(--primary);
      font-weight: 600;
      font-size: 0.9rem;
      border: 1px solid var(--primary);
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
  margin-bottom: 0.5rem;
  
  h3 {
    font-size: 1.25rem;
    color: var(--text-light);
    margin: 0;
  }
}

.category-tag {
  font-size: 0.75rem;
  color: var(--primary);
  background: rgba(0, 224, 224, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
}

.role-tag {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.tech-stack-mini {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .tech-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--primary);
    opacity: 0.5;
  }
  
  .tech-text {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-family: 'Space Mono', monospace;
  }
}

/* Lightbox */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
    align-items: flex-start;
    overflow-y: auto;
  }
}

.lightbox-content {
  width: 100%;
  max-width: 1400px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  
  @media (max-width: 768px) {
    height: auto;
    max-height: none;
    overflow-y: visible;
  }
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--primary);
    color: var(--bg-dark);
  }
}

.lightbox-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  height: 100%;
  overflow: hidden;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    height: auto;
    overflow-y: auto;
  }
}

.lightbox-image-container {
  background: #000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-in;
  height: 100%;
  min-height: 400px;
  
  .lightbox-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  .fullscreen-hint {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: rgba(0,0,0,0.7);
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  &:hover .fullscreen-hint {
    opacity: 1;
  }
}

.lightbox-details {
  padding: 2.5rem;
  overflow-y: auto;
  background: var(--surface-1);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.details-header {
  .category-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: var(--primary);
    color: var(--bg-dark);
    font-weight: 700;
    font-size: 0.75rem;
    border-radius: 4px;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 2rem;
    color: var(--text-light);
    margin: 0 0 1rem 0;
  }
  
  .links {
    display: flex;
    gap: 1rem;
  }
  
  .link-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--primary);
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.case-study-grid {
  display: grid;
  gap: 2rem;
}

.study-section {
  h4 {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
    border-left: 2px solid var(--primary);
    padding-left: 0.75rem;
  }
  
  p {
    font-size: 1rem;
    line-height: 1.6;
    color: #d4d4d8;
    margin: 0;
  }
}

.tech-stack-section {
  h4 {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    margin-bottom: 1rem;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    
    .tech-tag {
      font-size: 0.85rem;
      padding: 0.4rem 0.8rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      color: var(--text-light);
      font-family: 'Space Mono', monospace;
    }
  }
}

.fullscreen-viewer {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .fs-close-btn {
    position: absolute;
    top: 2rem;
    right: 2rem;
    background: rgba(255,255,255,0.1);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border: none;
    cursor: pointer;
    
    &:hover {
      background: var(--primary);
      color: var(--bg-dark);
    }
  }
  
  .fs-image {
    max-width: 95vw;
    max-height: 95vh;
    object-fit: contain;
  }
}

.zoom-enter-active,
.zoom-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.zoom-enter-from,
.zoom-leave-to,
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.95);
}

/* Senior Grid Layout */
.senior-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.full-width {
  grid-column: 1 / -1;
}

.inline-icon {
  vertical-align: middle;
  margin-right: 0.5rem;
  color: var(--primary);
}

.detail-list {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--text-light);
    font-size: 0.95rem;
    line-height: 1.5;
    
    &::before {
      content: "▹";
      position: absolute;
      left: 0;
      color: var(--primary);
    }
    
    &.tradeoff-item {
      white-space: pre-wrap; /* Handle newlines in tradeoffs */
      font-family: 'Space Mono', monospace;
      font-size: 0.85rem;
      background: rgba(255, 255, 255, 0.03);
      padding: 1rem;
      padding-left: 1rem;
      border-left: 3px solid var(--secondary, #f59e0b);
      border-radius: 4px;
      
      &::before {
        display: none;
      }
    }
  }
}

.highlight {
  background: rgba(15, 186, 178, 0.05); /* primary-600 tint */
  border: 1px solid rgba(15, 186, 178, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  
  h4 {
    border-left: none;
    padding-left: 0;
    color: var(--primary);
  }
  
  .impact-text {
    font-size: 1.1rem;
    font-weight: 500;
    color: #fff;
  }
}

/* Deep Dive Section */
.deep-dive-container {
  margin-top: 2rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface-2);
}

.deep-dive-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: none;
  border-bottom: 1px solid transparent;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s ease;
  
  .btn-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 600;
    font-size: 1rem;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &.active {
    background: rgba(15, 186, 178, 0.1);
    color: var(--primary);
    border-bottom-color: var(--border-color);
  }
}

.deep-dive-content {
  padding: 2rem;
  background: #0f172a; /* Darker bg for diagram */
}

.diagram-scroll {
  overflow-x: auto;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.system-flow {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: max-content;
  padding: 1rem;
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.node-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--surface-1);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  min-width: 140px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .node-icon {
    font-size: 1.5rem;
    color: var(--text-muted);
  }
  
  .node-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-light);
  }
  
  /* Node Types */
  &.input { border-top: 3px solid #60a5fa; }
  &.process { border-top: 3px solid #f59e0b; }
  &.logic { border-top: 3px solid #8b5cf6; }
  &.network { border-top: 3px solid #10b981; }
  &.cloud { border-top: 3px solid #0fbab2; }
  &.ai { border-top: 3px solid #ec4899; }
  &.output { border-top: 3px solid #60a5fa; }
}

.flow-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-muted);
  
  .arrow-label {
    font-size: 0.7rem;
    font-family: 'Space Mono', monospace;
    color: var(--text-muted);
    background: rgba(0,0,0,0.3);
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    white-space: nowrap;
  }
  
  .arrow-icon {
    font-size: 1.25rem;
    opacity: 0.5;
  }
}

.deep-dive-text {
  max-width: 70ch;
  margin: 0 auto;
  line-height: 1.7;
  color: #d4d4d8;
  font-size: 1rem;
  border-left: 3px solid var(--primary);
  padding-left: 1.5rem;
}

.icon-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}
</style>

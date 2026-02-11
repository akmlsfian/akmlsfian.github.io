<template>
  <div class="bio-section">
    <div class="section-header">
      <h2 class="neon-text">About <span class="text-white">Me</span></h2>
      <div class="scanner-line"></div>
    </div>
    
    <div class="bio-grid">
      <!-- Profile Card -->
      <div class="profile-card glass-panel slide-in-left">
        <div class="image-wrapper">
          <div class="hex-frame">
            <img src="/images/me.jpg" alt="Akmal Sufian" class="profile-img" />
          </div>
          <div class="status-indicator">
            <span class="dot"></span> Online
          </div>
        </div>
        
        <div class="bio-content">
          <h3 class="name-title">{{ bio.name }}</h3>
          <p class="role-subtitle">{{ bio.title }}</p>
          
          <!-- Character Stats Grid -->
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Subject ID</span>
              <span class="stat-value">{{ bio.personalInfo.fullName }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Alias</span>
              <span class="stat-value text-primary">"{{ bio.personalInfo.nickname }}"</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Origin</span>
              <span class="stat-value">{{ bio.personalInfo.birthPlace }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Current Location</span>
              <span class="stat-value">{{ bio.personalInfo.currentLocation }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Age</span>
              <span class="stat-value">{{ age }} <span class="stat-sub">Levels</span></span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Experience</span>
              <span class="stat-value">{{ yearsOfExperience }} <span class="stat-sub">Years</span></span>
            </div>
          </div>
          
          <div class="journey-box" :class="{ 'is-open': isJourneyOpen }" @click="toggleJourney">
            <div class="journey-header">
              <h4><Icon icon="mdi:map-marker-path" /> My Journey</h4>
              <Icon :icon="isJourneyOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="toggle-icon" />
            </div>
            <div class="journey-content-wrapper">
               <p>{{ bio.background }}</p>
            </div>
          </div>
          
          <div class="action-row">
            <a href="#contact" class="btn btn-neon">
              <Icon icon="mdi:flash" /> Initialize Contact
            </a>
          </div>
        </div>
      </div>
      
      <!-- Traits Grid -->
      <div class="traits-container">
        <div 
          v-for="(trait, index) in bio.traits" 
          :key="trait.title" 
          class="trait-module glass-panel"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="module-header">
            <div class="icon-frame">
              <Icon :icon="trait.icon" />
            </div>
            <h4>{{ trait.title }}</h4>
          </div>
          <p>{{ trait.description }}</p>
          <div class="corner-accents"></div>
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
      bio: bioData,
      isJourneyOpen: false
    };
  },
  methods: {
    toggleJourney() {
      this.isJourneyOpen = !this.isJourneyOpen;
    }
  },
  computed: {
    age() {
      if (!this.bio.personalInfo?.birthDate) return 'Unknown';
      const birthDate = new Date(this.bio.personalInfo.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    yearsOfExperience() {
      if (!this.bio.personalInfo?.careerStartDate) return 'Unknown';
      const startDate = new Date(this.bio.personalInfo.careerStartDate);
      const today = new Date();
      
      let years = today.getFullYear() - startDate.getFullYear();
      const m = today.getMonth() - startDate.getMonth();
      
      // Calculate precise decimal for "3.4+" style if desired, or just years
      // User asked for "Year of Experience in the field: {follow the career started date up to now}"
      // Let's do a precise "2.5+" or "3+" style or just text
      // Let's return a formatted string like "3+" or "2.5"
      
      const diffTime = Math.abs(today - startDate);
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25); 
      return diffYears.toFixed(1) + '+';
    }
  }
}
</script>

<style lang="scss" scoped>
.bio-section {
  padding: 2rem 0;
}

.section-header {
  margin-bottom: 3rem;
  position: relative;
  display: inline-block;
  
  .neon-text {
    font-size: 3rem;
    color: var(--primary);
    text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
    margin: 0;
    
    .text-white {
      color: #fff;
      text-shadow: none;
    }
  }
  
  .scanner-line {
    width: 100%;
    height: 2px;
    background: var(--primary);
    box-shadow: 0 0 10px var(--primary);
    margin-top: 0.5rem;
    animation: scan 2s infinite alternate;
  }
}

.bio-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 2rem;
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.profile-card {
  padding: 3rem;
  display: flex;
  gap: 3rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 2rem;
    gap: 2rem;
  }
}

.image-wrapper {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  .hex-frame {
    width: 200px;
    height: 200px;
    position: relative;
    clip-path: polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%);
    background: #000;
    padding: 4px;
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(45deg, var(--primary), transparent);
      z-index: -1;
    }
    
    .profile-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      clip-path: polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%);
      filter: grayscale(20%) contrast(1.1);
      transition: all 0.5s ease;
    }
    
    &:hover .profile-img {
      filter: grayscale(0) contrast(1);
      transform: scale(1.05);
    }
  }
  
  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--primary);
    background: rgba(0, 240, 255, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 99px;
    border: 1px solid rgba(0, 240, 255, 0.2);
    
    .dot {
      width: 8px;
      height: 8px;
      background: var(--primary);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--primary);
      animation: pulse 2s infinite;
    }
  }
}

.bio-content {
  flex: 1;
  
  .name-title {
    font-size: 2.5rem;
    margin-bottom: 0.25rem;
    background: linear-gradient(90deg, #fff, #aaa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .role-subtitle {
    font-family: 'Space Mono', monospace;
    color: var(--primary);
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin: 2rem 0;
    
    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    border-left: 2px solid rgba(255, 255, 255, 0.1);
    background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, transparent 100%);
    transition: all 0.3s ease;
    
    &:hover {
      border-left-color: var(--primary);
      background: linear-gradient(90deg, rgba(0, 240, 255, 0.1) 0%, transparent 100%);
      transform: translateX(5px);
    }
  }

  .stat-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 0.25rem;
  }

  .stat-value {
    font-family: 'Space Mono', monospace;
    font-size: 1.1rem;
    color: var(--text-light);
    font-weight: 600;
    
    &.text-primary {
      color: var(--primary);
    }
    
    .stat-sub {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.4);
      font-weight: 400;
    }
  }
  
  .bio-body {
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 2rem;
  }
  
  .journey-box {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: var(--primary);
      background: rgba(0, 240, 255, 0.05);
    }

    .journey-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h4 {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-light);
        font-size: 1.1rem;
      }

      .toggle-icon {
        color: var(--primary);
        font-size: 1.5rem;
        transition: transform 0.3s ease;
      }
    }

    .journey-content-wrapper {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      
      p {
        overflow: hidden;
        margin: 0;
        opacity: 0;
        transition: opacity 0.3s ease;
        line-height: 1.6;
        color: var(--text-muted);
      }
    }

    &.is-open {
      border-color: var(--primary);
      background: rgba(0, 240, 255, 0.05);

      .journey-content-wrapper {
        grid-template-rows: 1fr;
        margin-top: 1rem;
        
        p {
          opacity: 1;
        }
      }
    }
  }
  
  .action-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 0.9rem;
    }
    
    .btn-neon {
      background: var(--primary);
      color: #000;
      box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
      
      &:hover {
        background: #fff;
        box-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
      }
    }
    
    .btn-outline {
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      
      &:hover {
        border-color: var(--primary);
        color: var(--primary);
        background: rgba(0, 240, 255, 0.05);
      }
    }
  }
}

.traits-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.trait-module {
  padding: 1.5rem;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    transform: translateX(10px);
    border-color: var(--primary);
    box-shadow: inset 0 0 20px rgba(0, 240, 255, 0.05);
    
    .icon-frame {
      color: var(--bg-dark);
      background: var(--primary);
      box-shadow: 0 0 15px var(--primary);
    }
  }
  
  .module-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    
    .icon-frame {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      font-size: 1.25rem;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    h4 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--text-light);
    }
  }
  
  p {
    font-size: 0.9rem;
    margin: 0;
    color: var(--text-muted);
    line-height: 1.6;
  }
  
  .corner-accents {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    border-top: 2px solid var(--primary);
    border-right: 2px solid var(--primary);
    opacity: 0.5;
  }
}

@keyframes scan {
  from { width: 0; opacity: 0; }
  to { width: 100%; opacity: 1; }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(0, 240, 255, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(0, 240, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 240, 255, 0); }
}

.slide-in-left {
  animation: slideInLeft 1s var(--ease-out-expo) backwards;
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>

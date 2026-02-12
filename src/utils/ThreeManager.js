import * as THREE from 'three';

class ThreeManager {
  constructor() {
    this.renderer = null;
    this.container = null;
    this.resizeObserver = null;
  }

  init() {
    if (this.renderer) return this.renderer;

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true, // Can turn off if using post-processing with SMAA
      alpha: true,
      stencil: false,
      depth: true
    });

    // Performance constraint: Cap pixel ratio
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Tone mapping for high-quality look
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // Handle Resize
    window.addEventListener('resize', this.handleResize.bind(this));
    
    return this.renderer;
  }

  mount(container) {
    this.init();
    
    // If already attached elsewhere, it will move to new container
    // DOM nodes can only be in one place
    if (container) {
        // Clear container first just in case
        while(container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(this.renderer.domElement);
        this.container = container;
        this.handleResize();
    }
  }

  unmount() {
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.container = null;
  }

  handleResize() {
    if (!this.renderer) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Emit event for scenes to update cameras
    window.dispatchEvent(new CustomEvent('three-resize', { 
      detail: { width, height } 
    }));
  }

  getRenderer() {
    return this.init();
  }

  dispose() {
      // Rare: complete cleanup
      window.removeEventListener('resize', this.handleResize.bind(this));
      if (this.renderer) {
          this.renderer.dispose();
          this.renderer = null;
      }
  }
}

// Singleton instance
export default new ThreeManager();

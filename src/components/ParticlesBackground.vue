<template>
  <div ref="container" class="particles-container"></div>
</template>

<script>
import * as THREE from 'three';
import ThreeManager from '@/utils/ThreeManager';

export default {
  name: 'ParticlesBackground',
  data() {
    return {
      mouseX: 0,
      mouseY: 0,
      targetX: 0,
      targetY: 0,
      animationId: null
    }
  },
  created() {
    // Non-reactive Three.js instances
    this.scene = null;
    this.camera = null;
    this.particles = null;
    this.originalPositions = null;
    this.phases = null;
  },
  mounted() {
    this.init();
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('three-resize', this.handleResize);
  },
  beforeUnmount() {
    this.cleanup();
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('three-resize', this.handleResize);
  },
  methods: {
    init() {
      const container = this.$refs.container;
      // Mount the shared renderer
      ThreeManager.mount(container);
      
      // Setup Scene
      this.scene = new THREE.Scene();
      // Match the background color of the site
      this.scene.background = new THREE.Color(0x0B0B0C);
      this.scene.fog = new THREE.FogExp2(0x0B0B0C, 0.0015);

      // Setup Camera
      this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 100;
      this.camera.position.y = 20;

      // Create Particles (Structured Grid)
      const geometry = new THREE.BufferGeometry();
      
      // Grid dimensions
      const dimX = 50;
      const dimZ = 50;
      const count = dimX * dimZ;
      
      const positions = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const phases = new Float32Array(count); // For wave animation
      
      const spacing = 4;
      
      let i = 0;
      for(let x = 0; x < dimX; x++) {
        for(let z = 0; z < dimZ; z++) {
          // Centered grid
          const px = (x - dimX / 2) * spacing;
          const pz = (z - dimZ / 2) * spacing;
          const py = 0; // Flat initially
          
          positions[i * 3] = px;
          positions[i * 3 + 1] = py;
          positions[i * 3 + 2] = pz;
          
          sizes[i] = 1.0;
          phases[i] = (x + z) * 0.1; // Wave phase based on position
          
          i++;
        }
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1)); // Custom attribute if using shader, but here we use CPU for simplicity first or maybe...
      
      // Store original positions for CPU animation
      this.originalPositions = positions.slice();
      this.phases = phases;
      
      // Material - Simple and performant
      // Using a simple circle texture generated on canvas would be better, but points are fine for now
      // Let's generate a texture for better visuals than square points
      const sprite = this.getSprite();
      
      const material = new THREE.PointsMaterial({
        size: 0.8,
        map: sprite,
        color: 0x0fbab2, // Primary Teal
        transparent: true,
        opacity: 0.3,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      this.particles = new THREE.Points(geometry, material);
      this.scene.add(this.particles);

      // Start Loop
      this.animate();
    },
    
    getSprite() {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const context = canvas.getContext('2d');
      // Soft circle
      const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 32, 32);
      
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    },

    animate() {
      this.animationId = requestAnimationFrame(this.animate);
      
      const time = Date.now() * 0.001;
      
      // Smooth Mouse Interaction
      this.targetX = this.mouseX * 0.0005;
      this.targetY = this.mouseY * 0.0005;
      
      // Rotate entire system slowly
      if (this.particles) {
        // CPU Wave Animation
        const positions = this.particles.geometry.attributes.position.array;
        
        for(let i = 0; i < this.phases.length; i++) {
            // Sine wave based on time and phase
            // y = sin(time + phase) * amplitude
            const y = Math.sin(time + this.phases[i]) * 2;
            positions[i * 3 + 1] = y;
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;

        // Interaction rotation
        this.scene.rotation.x += (this.targetY - this.scene.rotation.x) * 0.05;
        this.scene.rotation.y += (this.targetX - this.scene.rotation.y) * 0.05;
      }

      const renderer = ThreeManager.getRenderer();
      if (renderer) {
        renderer.render(this.scene, this.camera);
      }
    },
    
    handleMouseMove(event) {
      this.mouseX = event.clientX - window.innerWidth / 2;
      this.mouseY = event.clientY - window.innerHeight / 2;
    },
    
    handleResize(event) {
      // Event detail contains width/height from ThreeManager
      if (this.camera) {
        const { width, height } = event ? event.detail : { width: window.innerWidth, height: window.innerHeight };
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
      }
    },
    
    cleanup() {
      cancelAnimationFrame(this.animationId);
      ThreeManager.unmount();
      
      if (this.particles) {
        this.scene.remove(this.particles);
        this.particles.geometry.dispose();
        this.particles.material.map.dispose();
        this.particles.material.dispose();
      }
      // Note: We don't dispose the renderer as it is shared
    }
  }
}
</script>

<style lang="scss" scoped>
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Behind everything */
  pointer-events: none; /* Let clicks pass through */
  background-color: var(--bg-dark); /* Fallback */
}
</style>

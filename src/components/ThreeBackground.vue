<template>
  <div ref="container" class="three-background"></div>
</template>

<script>
import * as THREE from 'three';

export default {
  name: 'ThreeBackground',
  data() {
    return {
      mouseX: 0,
      mouseY: 0,
    };
  },
  mounted() {
    this.initThree();
    window.addEventListener('resize', this.onWindowResize);
    document.addEventListener('mousemove', this.onMouseMove);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    document.removeEventListener('mousemove', this.onMouseMove);
    this.cleanup();
  },
  methods: {
    initThree() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 30;

      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.$refs.container.appendChild(this.renderer.domElement);

      // Particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 2000;
      const posArray = new Float32Array(particlesCount * 3);

      for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      // Material - Using the primary cyan color #2bf1ff
      const material = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x2bf1ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      this.particlesMesh = new THREE.Points(particlesGeometry, material);
      this.scene.add(this.particlesMesh);

      this.animate();
    },
    animate() {
      this.animationId = requestAnimationFrame(this.animate);

      // Gentle rotation
      this.particlesMesh.rotation.y += 0.0003;
      this.particlesMesh.rotation.x += 0.0001;

      // Mouse interaction parallax
      this.particlesMesh.rotation.x += this.mouseY * 0.00005;
      this.particlesMesh.rotation.y += this.mouseX * 0.00005;

      this.renderer.render(this.scene, this.camera);
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onMouseMove(event) {
      this.mouseX = event.clientX - window.innerWidth / 2;
      this.mouseY = event.clientY - window.innerHeight / 2;
    },
    cleanup() {
      if (this.animationId) cancelAnimationFrame(this.animationId);
      if (this.scene) {
        this.scene.remove(this.particlesMesh);
        if (this.particlesMesh) {
          this.particlesMesh.geometry.dispose();
          this.particlesMesh.material.dispose();
        }
        if (this.renderer) this.renderer.dispose();
      }
    }
  }
}
</script>

<style scoped>
.three-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  /* Dark blue gradient background matching the theme */
  background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
  pointer-events: none;
}
</style>

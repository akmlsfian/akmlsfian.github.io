<template>
  <div class="visualizer-container" @mousemove="showControlsTemporary" @click="showControlsTemporary">
    <div ref="canvasContainer" class="canvas-wrapper"></div>

    <transition name="fade">
      <div class="ui-overlay" v-show="isControlsVisible || !audioBuffer">
        <VisualizerControls 
          :hasAudio="!!audioBuffer"
          :isLoading="isLoading"
          :uploadProgress="uploadProgress"
          :fileName="currentFileName"
          :isPlaying="isPlaying"
          :currentTime="currentTime"
          :duration="duration"
          :volume="volume"
          :currentMode="currentMode"
          :modes="modes"
          :demoSongs="demoSongs"
          @upload="handleFileUpload"
          @selectDemo="handleDemoSelect"
          @reset="resetAudio"
          @seek="handleSeek"
          @togglePlay="togglePlay"
          @toggleMute="toggleMute"
          @updateVolume="handleVolumeChange"
          @setMode="setMode"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import * as THREE from 'three';
import VisualizerControls from '../components/visualizer/VisualizerControls.vue';
import { audioPlayerMixin } from '../mixins/audioPlayerMixin';

export default {
  name: 'AudioVisualizerView',
  components: { VisualizerControls },
  mixins: [audioPlayerMixin],
  data() {
    return {
      currentMode: 'orb',
      modes: [
        { id: 'orb', label: 'Orb', icon: 'mdi:earth' },
        { id: 'galaxy', label: 'Galaxy', icon: 'mdi:creation' },
        { id: 'infinity', label: 'Infinity', icon: 'mdi:road-variant' },
        { id: 'bars', label: 'Spectrum', icon: 'mdi:chart-bar' },
        { id: 'tunnel', label: 'Tunnel', icon: 'mdi:bullseye-arrow' },
        { id: 'grid', label: 'Matrix', icon: 'mdi:grid' },
        { id: 'wave', label: 'Wave', icon: 'mdi:waveform' },
        { id: 'particles', label: 'Particles', icon: 'mdi:blur' }
      ],
      demoSongs: [
        { title: 'Eiffel 65 - Blue (Hardstyle Remix)', path: '/songs/Eiffel 65 - Blue (Hardstyle Remix By Team Blue) [MONKEY TEMPO].mp3' },
        { title: 'Everytime We Touch (Hardstyle)', path: '/songs/Everytime We Touch (Hardstyle).mp3' },
        { title: 'Gonzi - BASSKILLER', path: '/songs/Gonzi - BASSKILLER.mp3' }
      ],
      prevVolume: 0.7,
      isControlsVisible: true,
      controlsTimeout: null
    };
  },
  created() {
    // Non-reactive Three.js instances
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.meshGroup = null;
    this.animationId = null;
  },
  mounted() {
    this.initThree();
    window.addEventListener('resize', this.handleResize);
    this.animationLoop();
  },
  beforeUnmount() {
    this.cleanupThree();
    window.removeEventListener('resize', this.handleResize);
    if (this.controlsTimeout) clearTimeout(this.controlsTimeout);
  },
  watch: {
    audioBuffer(newVal) {
      if (newVal) {
        // Audio loaded successfully
        this.setControlsVisibility(false);
        this.currentMode = 'orb'; 
        this.updateVisualizerMode();
      } else {
        this.setControlsVisibility(true);
      }
    }
  },
  methods: {
    showControlsTemporary() {
      if (!this.audioBuffer) return; // Always show if no audio
      
      this.setControlsVisibility(true);
      if (this.controlsTimeout) clearTimeout(this.controlsTimeout);
      
      this.controlsTimeout = setTimeout(() => {
        if (this.isPlaying) {
          this.setControlsVisibility(false);
        }
      }, 3000);
    },
    setControlsVisibility(visible) {
      this.isControlsVisible = visible;
      window.dispatchEvent(new CustomEvent('visualizer-ui-toggle', { detail: visible }));
    },
    async handleDemoSelect(song) {
      this.isLoading = true;
      this.currentFileName = song.title;
      this.uploadProgress = 0;
      
      try {
        await this.initAudioContext();
        const response = await fetch(song.path);
        const arrayBuffer = await response.arrayBuffer();
        
        this.uploadProgress = 100;
        const decodedBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.audioBuffer = decodedBuffer;
        this.duration = decodedBuffer.duration;
        this.playAudio();
      } catch (error) {
        console.error('Error loading demo:', error);
      } finally {
        this.isLoading = false;
      }
    },
    handleFileUpload(event) {
      this.loadAudioFile(event.target.files[0]);
    },
    handleSeek(value) {
      this.currentTime = parseFloat(value);
      this.seekAudio();
    },
    handleVolumeChange(value) {
      this.volume = parseFloat(value);
      this.updateVolume();
    },
    toggleMute() {
      if (this.volume > 0) {
        this.prevVolume = this.volume;
        this.volume = 0;
      } else {
        this.volume = this.prevVolume || 0.7;
      }
      this.updateVolume();
    },
    initThree() {
      const container = this.$refs.canvasContainer;
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x000000, 0.03); // Denser fog for infinity

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      
      // Adjust camera for mobile (move back if screen is narrow)
      const isMobile = window.innerWidth < 768;
      this.camera.position.set(0, 0, isMobile ? 35 : 20);
      
      this.camera.lookAt(0, 0, 0);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(this.renderer.domElement);

      this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      
      const p1 = new THREE.PointLight(0x00f0ff, 2);
      p1.position.set(20, 20, 20);
      this.scene.add(p1);

      const p2 = new THREE.PointLight(0xff0055, 2);
      p2.position.set(-20, -20, -20);
      this.scene.add(p2);

      this.createVisualizerGroup();
    },
    createVisualizerGroup() {
      if (this.meshGroup) this.scene.remove(this.meshGroup);
      this.meshGroup = new THREE.Group();
      this.scene.add(this.meshGroup);
      this.updateVisualizerMode();
    },
    setMode(mode) {
      this.currentMode = mode;
      this.updateVisualizerMode();
    },
    updateVisualizerMode() {
      if (!this.meshGroup) return;
      
      while(this.meshGroup.children.length > 0){ 
        const obj = this.meshGroup.children[0];
        if(obj.geometry) obj.geometry.dispose();
        if(obj.material) obj.material.dispose();
        this.meshGroup.remove(obj); 
      }
      
      const isMobile = window.innerWidth < 768;
      this.camera.position.set(0, 0, isMobile ? 35 : 20); // Reset camera
      this.camera.rotation.set(0, 0, 0);

      if (this.currentMode === 'orb') this.createOrb();
      else if (this.currentMode === 'galaxy') this.createGalaxy();
      else if (this.currentMode === 'infinity') this.createInfinity();
      else if (this.currentMode === 'bars') this.createBars();
      else if (this.currentMode === 'tunnel') this.createTunnel();
      else if (this.currentMode === 'grid') this.createGrid();
      else if (this.currentMode === 'wave') this.createWave();
      else if (this.currentMode === 'particles') this.createParticles();
    },
    createOrb() {
      // Abstract Deforming Sphere (Smaller)
      const geometry = new THREE.IcosahedronGeometry(4, 4);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x000000, 
        emissive: 0x00f0ff,
        emissiveIntensity: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.9
      });
      const mesh = new THREE.Mesh(geometry, material);
      this.meshGroup.add(mesh);
    },
    createGalaxy() {
      // Exploding Galaxy / Aurora
      const geometry = new THREE.BufferGeometry();
      const count = 5000;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      
      for (let i = 0; i < count; i++) {
        // Spiral distribution
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 20;
        const spiral = angle + radius * 0.5;
        
        positions[i * 3] = Math.cos(spiral) * radius;     // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2; // y (flat galaxy)
        positions[i * 3 + 2] = Math.sin(spiral) * radius; // z
        
        // Aurora colors (Cyan to Purple)
        const mix = Math.random();
        colors[i * 3] = mix * 0.5;     // R
        colors[i * 3 + 1] = 1.0 - mix; // G
        colors[i * 3 + 2] = 1.0;       // B
        
        sizes[i] = Math.random();
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      const material = new THREE.PointsMaterial({ 
        size: 0.1, 
        vertexColors: true, 
        transparent: true, 
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });
      this.meshGroup.add(new THREE.Points(geometry, material));
    },
    createInfinity() {
      // Infinite Grid/Terrain
      const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x110022, 
        emissive: 0xff0055,
        emissiveIntensity: 0.2,
        wireframe: true,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = -5;
      this.meshGroup.add(mesh);
      
      // Store original positions for reference
      geometry.userData = { originalPositions: geometry.attributes.position.clone() };
    },
    createBars() {
      // Circular Spectrum Bars
      const count = 64;
      const radius = 10;
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshPhongMaterial({
        color: 0x00f0ff,
        emissive: 0x0000aa,
        specular: 0xffffff,
        shininess: 100
      });

      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        const angle = (i / count) * Math.PI * 2;
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.z = Math.sin(angle) * radius;
        mesh.rotation.y = -angle;
        mesh.userData = { index: i, angle: angle };
        this.meshGroup.add(mesh);
      }
    },
    createTunnel() {
      // Geometric Tunnel
      const count = 30;
      const geometry = new THREE.TorusGeometry(5, 0.1, 8, 4); // Square rings
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xff0055,
        wireframe: true,
        transparent: true,
        opacity: 0.5
      });

      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = -i * 5;
        mesh.rotation.z = i * 0.1;
        this.meshGroup.add(mesh);
      }
    },
    createGrid() {
      // 3D Matrix of cubes
      const size = 10;
      const gap = 2;
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

      for(let x = 0; x < size; x++) {
        for(let z = 0; z < size; z++) {
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(
            (x - size/2) * gap,
            0,
            (z - size/2) * gap
          );
          mesh.userData = { x: x, z: z };
          this.meshGroup.add(mesh);
        }
      }
      // Rotate group for better view
      this.meshGroup.rotation.x = 0.5;
      this.meshGroup.rotation.y = 0.5;
    },
    createWave() {
      // Digital Wave
      const geometry = new THREE.PlaneGeometry(60, 20, 63, 20);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x00f0ff, 
        wireframe: true,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 3;
      this.meshGroup.add(mesh);
    },
    createParticles() {
      // Particle Cloud
      const geometry = new THREE.BufferGeometry();
      const count = 2000;
      const positions = new Float32Array(count * 3);
      
      for(let i=0; i<count; i++) {
        positions[i*3] = (Math.random() - 0.5) * 50;
        positions[i*3+1] = (Math.random() - 0.5) * 50;
        positions[i*3+2] = (Math.random() - 0.5) * 50;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        size: 0.2,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
      });
      this.meshGroup.add(new THREE.Points(geometry, material));
    },
    animationLoop() {
      this.animationId = requestAnimationFrame(this.animationLoop);
      this.updateAudioTime();

      const data = this.getAudioData(); // Returns Uint8Array (0-255)
      
      if (this.meshGroup) {
        if (data && this.isPlaying) {
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
          
          if (this.currentMode === 'orb') this.animateOrb(data, avg, bass);
          else if (this.currentMode === 'galaxy') this.animateGalaxy(data, avg, bass);
          else if (this.currentMode === 'infinity') this.animateInfinity(data, avg, bass);
          else if (this.currentMode === 'bars') this.animateBars(data, avg, bass);
          else if (this.currentMode === 'tunnel') this.animateTunnel(data, avg, bass);
          else if (this.currentMode === 'grid') this.animateGrid(data, avg, bass);
          else if (this.currentMode === 'wave') this.animateWave(data, avg, bass);
          else if (this.currentMode === 'particles') this.animateParticles(data, avg, bass);
          
          // Subtle camera sway
          if (this.currentMode !== 'infinity' && this.currentMode !== 'tunnel') {
             const baseZ = window.innerWidth < 768 ? 35 : 20;
             this.camera.position.z = baseZ - (bass / 50);
          }
        } else {
          // Idle animation
          if (this.currentMode === 'tunnel') {
             this.meshGroup.children.forEach(mesh => {
                mesh.position.z += 0.1;
                if(mesh.position.z > 10) mesh.position.z -= 150;
             });
          } else {
             this.meshGroup.rotation.y += 0.001;
          }
        }
      }
      
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    },
    animateOrb(data, avg, bass) {
      const mesh = this.meshGroup.children[0];
      const positionAttribute = mesh.geometry.attributes.position;
      const vertex = new THREE.Vector3();
      
      for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        vertex.normalize();
        
        const freqIndex = i % data.length;
        const value = data[freqIndex] / 255;
        
        // Reduced scale: Base 4 + effect
        const distance = 4 + (value * 3) + (bass / 60);
        
        vertex.multiplyScalar(distance);
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      mesh.geometry.attributes.position.needsUpdate = true;
      mesh.rotation.z += 0.002;
      mesh.rotation.y += 0.002;
    },
    animateGalaxy(data, avg, bass) {
      const points = this.meshGroup.children[0];
      const positions = points.geometry.attributes.position;
      const count = positions.count;
      
      // Expand / Explode based on bass
      const explosion = 1 + (bass / 500); // 1.0 to 1.5
      points.scale.set(explosion, explosion, explosion);
      points.rotation.y += 0.001 + (avg * 0.0001);
      
      // Animate particles
      for(let i=0; i<count; i++) {
        let y = positions.getY(i);
        // Wave motion on Y
        y += Math.sin(Date.now() * 0.001 + positions.getX(i)) * 0.02;
        positions.setY(i, y);
      }
      positions.needsUpdate = true;
    },
    animateInfinity(data, avg, bass) {
      const mesh = this.meshGroup.children[0];
      const positions = mesh.geometry.attributes.position;
      const original = mesh.geometry.userData.originalPositions;
      
      // Move forward logic (shift Z)
      const speed = 0.5 + (avg / 50);
      
      for(let i=0; i<positions.count; i++) {
        let z = positions.getZ(i);
        z += speed;
        if (z > 50) z -= 100; // Loop back
        positions.setZ(i, z);
        
        // Height displacement based on X position (frequency map)
        const x = positions.getX(i);
        // Map X (-50 to 50) to frequency index (0 to data.length)
        const freqIndex = Math.floor(((x + 50) / 100) * data.length * 0.5);
        const value = data[freqIndex] || 0;
        
        // Set Y based on audio
        positions.setY(i, (value / 255) * 10);
      }
      
      positions.needsUpdate = true;
      
      // Tilt camera for "flying" effect
      this.camera.position.set(0, 5, 20);
      this.camera.lookAt(0, 0, -20);
    },
    animateBars(data, avg, bass) {
      this.meshGroup.children.forEach((mesh, i) => {
        // Map data index to bar index
        const index = Math.floor((i / this.meshGroup.children.length) * (data.length / 4));
        const val = data[index] || 0;
        
        // Scale bars based on frequency
        const scaleY = 1 + (val / 10);
        mesh.scale.set(1, scaleY, 1);
        
        // Color shift based on height
        mesh.material.color.setHSL(val / 255, 1, 0.5);
      });
      this.meshGroup.rotation.y += 0.005;
      this.meshGroup.rotation.z = Math.sin(Date.now() * 0.001) * 0.2;
    },
    animateTunnel(data, avg, bass) {
      const speed = 0.5 + (bass / 50); // Speed up on bass
      
      this.meshGroup.children.forEach((mesh, i) => {
        mesh.position.z += speed;
        if(mesh.position.z > 20) mesh.position.z -= 150; // Loop
        
        // Rotate rings based on audio
        mesh.rotation.z += 0.01 + (avg * 0.0001);
        
        // Scale based on audio history/delay effect?
        // Simple immediate reaction for now
        const val = data[i % 50] / 255;
        const scale = 1 + val;
        mesh.scale.set(scale, scale, scale);
      });
      
      this.camera.position.set(0, 0, 0); // Inside tunnel
      this.camera.lookAt(0, 0, -100); // Look down the tunnel
    },
    animateGrid(data, avg, bass) {
      this.meshGroup.children.forEach((mesh, i) => {
        const val = data[i % (data.length/2)] / 255;
        mesh.position.y = val * 10;
        mesh.scale.set(1, 1 + val * 5, 1);
        mesh.material.color.setHSL(0.3 + val * 0.5, 1, 0.5);
      });
      this.meshGroup.rotation.y += 0.002;
    },
    animateWave(data, avg, bass) {
      const mesh = this.meshGroup.children[0];
      const positions = mesh.geometry.attributes.position;
      const width = 64; // width segments + 1
      
      for(let i=0; i<positions.count; i++) {
        const x = i % width;
        const val = data[x * 2] / 255; // sample data
        const y = positions.getY(i);
        
        // Simple wave effect
        const targetY = (val * 10) + Math.sin(i * 0.1 + Date.now() * 0.005) * 2;
        positions.setZ(i, targetY); // Displace Z since we rotated X
      }
      positions.needsUpdate = true;
    },
    animateParticles(data, avg, bass) {
      const points = this.meshGroup.children[0];
      points.rotation.y += 0.001 + (avg * 0.0001);
      const positions = points.geometry.attributes.position;
      
      const beat = bass / 255;
      
      for(let i=0; i<positions.count; i++) {
        // Jitter based on bass
        if (beat > 0.5) {
           positions.setY(i, positions.getY(i) + (Math.random()-0.5) * beat);
        }
      }
      positions.needsUpdate = true;
      
      // Pulse scale
      const s = 1 + (bass / 100);
      points.scale.set(s, s, s);
    },
    handleResize() {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Re-adjust camera z on resize
        const isMobile = window.innerWidth < 768;
        // Only adjust if we are not in infinity or tunnel mode (those handle their own camera)
        if (this.currentMode !== 'infinity' && this.currentMode !== 'tunnel') {
             this.camera.position.z = isMobile ? 35 : 20;
        }
      }
    },
    cleanupThree() {
      cancelAnimationFrame(this.animationId);
      if (this.renderer) this.renderer.dispose();
      if (this.scene) {
        this.scene.traverse((object) => {
          if (object.isMesh || object.isPoints) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) object.material.forEach(m => m.dispose());
            else object.material.dispose();
          }
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.visualizer-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(circle at center, #111, #000);
  cursor: pointer; /* Indicate interaction */
}
.canvas-wrapper {
  position: absolute; inset: 0; z-index: 1;
}
.ui-overlay {
  position: absolute; inset: 0; z-index: 10;
  display: flex; align-items: flex-end; justify-content: center;
  padding-bottom: 3rem; pointer-events: none;
  transition: opacity 0.5s ease;
  
  @media (max-width: 768px) { padding-bottom: 5rem; }
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

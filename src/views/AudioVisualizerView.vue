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
import ThreeManager from '@/utils/ThreeManager';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PMREMGenerator } from 'three';
import VisualizerControls from '../components/visualizer/VisualizerControls.vue';
import { audioPlayerMixin } from '../mixins/audioPlayerMixin';

// Noise shader chunk for reuse
const noiseChunk = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute( 
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    return 10.0 * ( dot(p0, x0) + dot(p1, x1) + dot(p2, x2) + dot(p3, x3) ); // Scaled for intensity
  }
`;

export default {
  name: 'AudioVisualizerView',
  components: { VisualizerControls },
  mixins: [audioPlayerMixin],
  data() {
    return {
      currentMode: 'blob',
      modes: [
        { id: 'blob', label: 'Chrome Blob', icon: 'mdi:water' },
        { id: 'sphere', label: 'Glass Sphere', icon: 'mdi:crystal-ball' },
        { id: 'terrain', label: 'Cyber Terrain', icon: 'mdi:terrain' },
        { id: 'neural', label: 'Neural Net', icon: 'mdi:brain' },
        { id: 'vortex', label: 'Black Hole', icon: 'mdi:black-hole' },
        { id: 'shards', label: 'Crystal Shards', icon: 'mdi:shimmer' },
        { id: 'radial', label: 'Minimal Radial', icon: 'mdi:circle-outline' },
        { id: 'orb', label: 'Classic Orb', icon: 'mdi:earth' },
        { id: 'galaxy', label: 'Galaxy', icon: 'mdi:creation' },
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
      
      // Use ThreeManager to get the shared renderer and mount it
      this.renderer = ThreeManager.mount(container);
      
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x0B0B0C, 0.03); // Match bg-dark

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      
      // Adjust camera for mobile (move back if screen is narrow)
      const isMobile = window.innerWidth < 768;
      this.camera.position.set(0, 0, isMobile ? 35 : 20);
      
      this.camera.lookAt(0, 0, 0);

      // Environment for PBR materials (Chrome, Glass)
      const pmremGenerator = new PMREMGenerator(this.renderer);
      pmremGenerator.compileEquirectangularShader();
      this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment()).texture;

      this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      
      // Updated lights for new color scheme
      const p1 = new THREE.PointLight(0x0fbab2, 2); // Primary Teal
      p1.position.set(20, 20, 20);
      this.scene.add(p1);

      const p2 = new THREE.PointLight(0xFFFFFF, 1.5); // Secondary White
      p2.position.set(-20, -20, -20);
      this.scene.add(p2);

      this.createVisualizerGroup();
      this.createShockwave(); // Global shockwave effect
      this.initPostProcessing();
    },
    initPostProcessing() {
      const renderScene = new RenderPass(this.scene, this.camera);
      
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, 0.4, 0.85
      );
      bloomPass.threshold = 0.2;
      bloomPass.strength = 1.0; // Slightly reduced strength
      bloomPass.radius = 0.5;

      const rgbShiftPass = new ShaderPass(RGBShiftShader);
      rgbShiftPass.uniforms['amount'].value = 0.0015; // Subtle aberration

      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(renderScene);
      this.composer.addPass(bloomPass);
      this.composer.addPass(rgbShiftPass);
    },
    createVisualizerGroup() {
      if (this.meshGroup) this.scene.remove(this.meshGroup);
      this.meshGroup = new THREE.Group();
      this.scene.add(this.meshGroup);
      this.updateVisualizerMode();
    },
    createShockwave() {
      // Global shockwave ring
      const geometry = new THREE.RingGeometry(10, 11, 64);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x0fbab2, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0
      });
      this.shockwave = new THREE.Mesh(geometry, material);
      this.shockwave.rotation.x = -Math.PI / 2;
      this.shockwave.visible = false;
      this.scene.add(this.shockwave);
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
        if(obj.material) {
          if(Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
        this.meshGroup.remove(obj); 
      }
      
      const isMobile = window.innerWidth < 768;
      this.camera.position.set(0, 0, isMobile ? 35 : 20); // Reset camera
      this.camera.rotation.set(0, 0, 0);
      
      // Reset background environment if changed
      this.scene.background = null;
      this.scene.environment = null;

      switch(this.currentMode) {
        case 'blob': this.createBlob(); break;
        case 'sphere': this.createSphere(); break;
        case 'terrain': this.createTerrain(); break;
        case 'neural': this.createNeural(); break;
        case 'vortex': this.createVortex(); break;
        case 'shards': this.createShards(); break;
        case 'radial': this.createRadial(); break;
        case 'orb': this.createOrb(); break;
        case 'galaxy': this.createGalaxy(); break;
        default: this.createOrb();
      }
    },
    createOrb() {
      // Abstract Deforming Sphere (Smaller)
      const geometry = new THREE.IcosahedronGeometry(4, 4);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x0B0B0C, 
        emissive: 0x0fbab2,
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
        
        // Aurora colors (Cyan to White)
        const mix = Math.random();
        colors[i * 3] = mix * 0.0;     // R (Low red for cyan)
        colors[i * 3 + 1] = 0.8 + (mix * 0.2); // G (High green for cyan/white)
        colors[i * 3 + 2] = 0.8 + (mix * 0.2);       // B (High blue for cyan/white)
        
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
    createBars() {
      // Circular Spectrum Bars
      const count = 64;
      const radius = 10;
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshPhongMaterial({
        color: 0x0fbab2,
        emissive: 0x003033, // Dark cyan
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
    createGrid() {
      // 3D Matrix of cubes
      const size = 10;
      const gap = 2;
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true });

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
        color: 0x00E0E0, 
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
          
          // Beat Detection & Shockwave
          if (bass > 200 && !this.isShockwaving) {
            this.triggerShockwave();
          }
          this.updateShockwave();

          switch(this.currentMode) {
            case 'blob': this.animateBlob(data, avg, bass); break;
            case 'sphere': this.animateSphere(data, avg, bass); break;
            case 'terrain': this.animateTerrain(data, avg, bass); break;
            case 'neural': this.animateNeural(data, avg, bass); break;
            case 'vortex': this.animateVortex(data, avg, bass); break;
            case 'shards': this.animateShards(data, avg, bass); break;
            case 'radial': this.animateRadial(data, avg, bass); break;
            case 'orb': this.animateOrb(data, avg, bass); break;
            case 'galaxy': this.animateGalaxy(data, avg, bass); break;
            default: this.animateOrb(data, avg, bass);
          }
          
          // Subtle camera sway
          if (['blob', 'sphere', 'orb', 'radial'].includes(this.currentMode)) {
             const baseZ = window.innerWidth < 768 ? 35 : 20;
             this.camera.position.z = baseZ - (bass / 50);
          }
        } else {
          // Idle animation
          this.meshGroup.rotation.y += 0.002;
        }
      }
      
      if (this.composer) {
        this.composer.render();
      } else if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    },
    triggerShockwave() {
      this.isShockwaving = true;
      this.shockwave.visible = true;
      this.shockwave.scale.set(1, 1, 1);
      this.shockwave.material.opacity = 0.8;
      
      setTimeout(() => { this.isShockwaving = false; }, 300); // Debounce
    },
    updateShockwave() {
      if (this.shockwave.visible) {
        this.shockwave.scale.x += 0.5;
        this.shockwave.scale.y += 0.5;
        this.shockwave.material.opacity -= 0.04;
        
        if (this.shockwave.material.opacity <= 0) {
          this.shockwave.visible = false;
        }
      }
    },
    // New Visualizer Modes
    createBlob() {
      const geometry = new THREE.IcosahedronGeometry(8, 40); // High subdivision
      const material = new THREE.MeshStandardMaterial({
        color: 0x0B0B0C,
        roughness: 0.1,
        metalness: 0.9,
        emissive: 0x00E0E0,
        emissiveIntensity: 0.2,
      });

      material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = { value: 0 };
        shader.uniforms.uBass = { value: 0 };
        
        shader.vertexShader = `
          uniform float uTime;
          uniform float uBass;
          ${noiseChunk}
        ` + shader.vertexShader;
        
        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `
          #include <begin_vertex>
          float noise = snoise(vec3(position * 0.5 + uTime * 0.5));
          float displacement = noise * (2.0 + uBass * 0.05);
          vec3 newPos = position + normal * displacement;
          transformed = newPos;
          `
        );
        material.userData.shader = shader;
      };

      const mesh = new THREE.Mesh(geometry, material);
      this.meshGroup.add(mesh);
    },
    animateBlob(data, avg, bass) {
      const mesh = this.meshGroup.children[0];
      if (mesh.material.userData.shader) {
        mesh.material.userData.shader.uniforms.uTime.value = performance.now() / 1000;
        mesh.material.userData.shader.uniforms.uBass.value = bass;
      }
      mesh.rotation.y += 0.002;
    },

    createSphere() {
      const geometry = new THREE.SphereGeometry(7, 64, 64);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 1, // Glass
        thickness: 2,
        ior: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0,
        transparent: true,
        opacity: 1
      });
      const sphere = new THREE.Mesh(geometry, material);
      this.meshGroup.add(sphere);

      // Inner particles
      const pGeo = new THREE.BufferGeometry();
      const count = 200;
      const positions = new Float32Array(count * 3);
      for(let i=0; i<count; i++) {
        const r = 4 * Math.random();
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i*3+2] = r * Math.cos(phi);
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0x00E0E0,
        size: 0.2,
        blending: THREE.AdditiveBlending
      });
      const particles = new THREE.Points(pGeo, pMat);
      this.meshGroup.add(particles);
    },
    animateSphere(data, avg, bass) {
      const sphere = this.meshGroup.children[0];
      const particles = this.meshGroup.children[1];
      
      sphere.rotation.y += 0.002;
      particles.rotation.y -= 0.005;

      // Color shift based on mids
      const mid = data[data.length / 2] / 255;
      particles.material.color.setHSL(0.5, 1, 0.5 + mid * 0.4);
      
      // Pulse inner particles
      const positions = particles.geometry.attributes.position;
      for(let i=0; i<positions.count; i++) {
         // Jitter
         if (bass > 100) {
            positions.setY(i, positions.getY(i) + (Math.random()-0.5) * 0.1);
         }
      }
      positions.needsUpdate = true;
    },

    createTerrain() {
      const geometry = new THREE.PlaneGeometry(200, 200, 64, 64);
      const material = new THREE.MeshStandardMaterial({
        color: 0x0B0B0C,
        emissive: 0x00E0E0,
        emissiveIntensity: 0.5,
        wireframe: true,
        displacementScale: 20
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = -10;
      this.meshGroup.add(mesh);
      
      // Fog
      this.scene.fog = new THREE.FogExp2(0x0B0B0C, 0.02);
    },
    animateTerrain(data, avg, bass) {
      const mesh = this.meshGroup.children[0];
      const positions = mesh.geometry.attributes.position;
      
      // Move terrain (scroll texture effect)
      // We shift Z values to create illusion of flight
      const speed = 0.8 + (bass / 50); // Speed up on bass
      
      for(let i=0; i<positions.count; i++) {
        let z = positions.getZ(i);
        z += speed;
        if (z > 100) z -= 200; // Loop back
        positions.setZ(i, z);
        
        // Height based on audio
        // We map X coordinate to frequency bin
        const x = positions.getX(i);
        const freqIdx = Math.floor(Math.abs(x) % data.length);
        const val = data[freqIdx] / 255;
        
        // Dynamic height: combination of noise and audio
        // Use a simple sine wave 'noise' for terrain rolling
        const rolling = Math.sin(x * 0.1 + performance.now() * 0.001) * 2;
        const spike = val * 15; // Audio spikes
        
        // Apply height (which is Y in world space because of rotation, but Z in geometry)
        // Since we rotated -PI/2, local Z becomes world Y (up/down) relative to the plane's surface
        // Wait, PlaneGeometry normal is +Z. Rotated -90deg X -> Normal is +Y.
        // So modifying Z attribute moves vertices in world +Y.
        positions.setZ(i, rolling + spike); 
      }
      positions.needsUpdate = true;
      
      // Camera sway
      this.camera.position.x = Math.sin(performance.now() * 0.0005) * 5;
      this.camera.position.y = 15 + Math.cos(performance.now() * 0.0005) * 2;
      this.camera.lookAt(0, 0, -20);
    },

    createNeural() {
      const count = 200;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for(let i=0; i<count; i++) {
        positions[i*3] = (Math.random()-0.5) * 40;
        positions[i*3+1] = (Math.random()-0.5) * 40;
        positions[i*3+2] = (Math.random()-0.5) * 40;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      // Nodes
      const pMat = new THREE.PointsMaterial({
        color: 0x00E0E0,
        size: 0.5,
        transparent: true,
        opacity: 0.8
      });
      const points = new THREE.Points(geometry, pMat);
      this.meshGroup.add(points);

      // Connections (Lines)
      // We'll create a line geometry that connects close points
      // For static demo, we can just connect random pairs or use an index buffer
      // But dynamic lines are expensive. Let's use a fixed set of lines.
      const lineGeo = new THREE.BufferGeometry();
      // Create max connections
      const maxConnections = count * 2;
      const linePos = new Float32Array(maxConnections * 6); // 2 points per line * 3 coords
      lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00E0E0,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      this.meshGroup.add(lines);
    },
    animateNeural(data, avg, bass) {
      const points = this.meshGroup.children[0];
      const lines = this.meshGroup.children[1];
      const positions = points.geometry.attributes.position;
      
      // Pulse nodes
      const s = 1 + (bass / 100);
      points.scale.set(s, s, s);
      points.rotation.y += 0.001;
      lines.rotation.y += 0.001;

      // Update lines based on proximity (expensive loop, limit check)
      const linePos = lines.geometry.attributes.position;
      let lineIdx = 0;
      const threshold = 10 + (avg / 10); // Connections reach further on loud volume
      
      // Only check a subset per frame or use simple random connections
      // For performance, let's just jitter existing points and draw lines between neighbors
      for(let i=0; i<positions.count; i++) {
        // Jitter
        positions.setX(i, positions.getX(i) + Math.sin(performance.now()*0.001 + i)*0.05);
      }
      positions.needsUpdate = true;
      
      // Update lines (connect i to i+1 for simple effect)
      for(let i=0; i<positions.count-1; i++) {
         if(lineIdx >= linePos.count) break;
         
         const x1 = positions.getX(i);
         const y1 = positions.getY(i);
         const z1 = positions.getZ(i);
         
         const x2 = positions.getX(i+1);
         const y2 = positions.getY(i+1);
         const z2 = positions.getZ(i+1);
         
         const dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2 + (z2-z1)**2);
         if (dist < threshold) {
            linePos.setXYZ(lineIdx++, x1, y1, z1);
            linePos.setXYZ(lineIdx++, x2, y2, z2);
         } else {
            // Hide line
            linePos.setXYZ(lineIdx++, 0,0,0);
            linePos.setXYZ(lineIdx++, 0,0,0);
         }
      }
      lines.geometry.attributes.position.needsUpdate = true;
    },

    createVortex() {
      const count = 2000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      
      for(let i=0; i<count; i++) {
         const r = Math.random() * 30 + 5;
         const theta = Math.random() * Math.PI * 2;
         positions[i*3] = r * Math.cos(theta);
         positions[i*3+1] = (Math.random() - 0.5) * 5; // Height
         positions[i*3+2] = r * Math.sin(theta);
         
         colors[i*3] = 0;
         colors[i*3+1] = 0.8 + Math.random()*0.2; // Cyan
         colors[i*3+2] = 0.8 + Math.random()*0.2; // Cyan
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.PointsMaterial({
         size: 0.2,
         vertexColors: true,
         blending: THREE.AdditiveBlending,
         transparent: true,
         opacity: 0.8
      });
      const points = new THREE.Points(geometry, material);
      this.meshGroup.add(points);
      
      // Central Black Hole (Disk)
      const diskGeo = new THREE.CircleGeometry(4, 32);
      const diskMat = new THREE.MeshBasicMaterial({ color: 0x0B0B0C });
      const disk = new THREE.Mesh(diskGeo, diskMat);
      disk.rotation.x = -Math.PI/2;
      this.meshGroup.add(disk);
      
      // Accretion disk glow
      const ringGeo = new THREE.RingGeometry(4, 4.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({ 
        color: 0x00E0E0, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI/2;
      this.meshGroup.add(ring);
    },
    animateVortex(data, avg, bass) {
       const points = this.meshGroup.children[0];
       const positions = points.geometry.attributes.position;
       const colors = points.geometry.attributes.color;
       
       // Spin speed based on bass
       const speed = 0.005 + (bass / 5000);
       points.rotation.y += speed;
       
       // High frequencies for sparks
       const highs = data.slice(Math.floor(data.length * 0.7)).reduce((a, b) => a + b, 0) / (data.length * 0.3);

       // Pull particles inward
       for(let i=0; i<positions.count; i++) {
          const x = positions.getX(i);
          const z = positions.getZ(i);
          const dist = Math.sqrt(x*x + z*z);
          
          if (dist < 4) {
             // Reset to outer rim
             const r = 35;
             const theta = Math.random() * Math.PI * 2;
             positions.setX(i, r * Math.cos(theta));
             positions.setZ(i, r * Math.sin(theta));
             
             // Reset color (Cyan/Blue)
             colors.setXYZ(i, 0, 0.5 + Math.random()*0.5, 1);
          } else {
             // Move inward
             positions.setX(i, x * 0.99);
             positions.setZ(i, z * 0.99);
             
             // Spark effect on highs: randomly brighten some particles
             if (highs > 50 && Math.random() < 0.02) {
                 colors.setXYZ(i, 1, 1, 1); // White spark
             } else if (colors.getX(i) > 0.1) {
                 // Fade back to cyan/blue
                 colors.setX(i, colors.getX(i) * 0.9);
             }
          }
          
          // Audio reaction on Y
          const freqIdx = Math.floor((dist/35) * data.length);
          const val = data[freqIdx] / 255;
          positions.setY(i, (val * 8) * (Math.random() > 0.5 ? 1 : -1));
       }
       positions.needsUpdate = true;
       colors.needsUpdate = true;
       
       // Pulse Ring
       const ring = this.meshGroup.children[2];
       const s = 1 + (bass / 200);
       ring.scale.set(s, s, s);
    },

    createShards() {
      const count = 200;
      const geometry = new THREE.TetrahedronGeometry(1, 0);
      const material = new THREE.MeshPhysicalMaterial({
         color: 0x00E0E0,
         metalness: 1,
         roughness: 0.2,
         transmission: 0.5,
         thickness: 1,
         transparent: true,
         opacity: 0.8
      });
      
      const mesh = new THREE.InstancedMesh(geometry, material, count);
      const dummy = new THREE.Object3D();
      
      for(let i=0; i<count; i++) {
         dummy.position.set(
            (Math.random()-0.5) * 40,
            (Math.random()-0.5) * 40,
            (Math.random()-0.5) * 40
         );
         dummy.rotation.set(
            Math.random()*Math.PI,
            Math.random()*Math.PI,
            Math.random()*Math.PI
         );
         const s = Math.random() * 2;
         dummy.scale.set(s,s,s);
         dummy.updateMatrix();
         mesh.setMatrixAt(i, dummy.matrix);
      }
      this.meshGroup.add(mesh);
    },
    animateShards(data, avg, bass) {
       const mesh = this.meshGroup.children[0];
       const dummy = new THREE.Object3D();
       const count = mesh.count;
       
       mesh.rotation.y += 0.001;
       mesh.rotation.z += 0.001;
       
       // We can't easily animate individual instances efficiently without storing their initial states
       // For now, let's just pulse the whole group scale or rotate faster on beat
       
       if (bass > 150) {
          mesh.rotation.y += 0.05;
       }
       
       // Actually, let's update a few instances if we want "flashes"
       // Or just change color
       const mid = data[30] / 255;
       mesh.material.emissive.setHSL(0.5, 1, mid * 0.5);
    },

    createRadial() {
       const count = 128;
       const radius = 10;
       const points = [];
       for(let i=0; i<=count; i++) {
          const theta = (i/count) * Math.PI * 2;
          points.push(new THREE.Vector3(
             Math.cos(theta) * radius,
             Math.sin(theta) * radius,
             0
          ));
       }
       const geometry = new THREE.BufferGeometry().setFromPoints(points);
       const material = new THREE.LineBasicMaterial({ color: 0x00E0E0, linewidth: 2 });
       const line = new THREE.Line(geometry, material);
       this.meshGroup.add(line);
       
       // Inner ring
       const material2 = new THREE.LineBasicMaterial({ color: 0xFFFFFF, linewidth: 1, transparent: true, opacity: 0.5 });
       const line2 = new THREE.Line(geometry.clone(), material2);
       line2.scale.set(0.5, 0.5, 0.5);
       this.meshGroup.add(line2);
    },
    animateRadial(data, avg, bass) {
       const line = this.meshGroup.children[0];
       const positions = line.geometry.attributes.position;
       const count = positions.count;
       const radius = 10 + (bass / 20);
       
       for(let i=0; i<count; i++) {
          const theta = (i/(count-1)) * Math.PI * 2;
          const freqIdx = Math.floor((i/count) * data.length * 0.5);
          const val = data[freqIdx] / 255;
          
          const r = radius + (val * 10);
          positions.setXYZ(i, Math.cos(theta)*r, Math.sin(theta)*r, 0);
       }
       positions.needsUpdate = true;
       
       const line2 = this.meshGroup.children[1];
       line2.rotation.z -= 0.01;
       const s = 0.5 + (avg / 100);
       line2.scale.set(s,s,s);
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
    animateBars(data, avg, bass) {
      this.meshGroup.children.forEach((mesh, i) => {
        // Map data index to bar index
        const index = Math.floor((i / this.meshGroup.children.length) * (data.length / 4));
        const val = data[index] || 0;
        
        // Scale bars based on frequency
        const scaleY = 1 + (val / 10);
        mesh.scale.set(1, scaleY, 1);
        
        // Color shift based on height
        mesh.material.color.setHSL(0.5, 1, 0.3 + (val / 510)); // Cyan range
      });
      this.meshGroup.rotation.y += 0.005;
      this.meshGroup.rotation.z = Math.sin(Date.now() * 0.001) * 0.2;
    },
    animateGrid(data, avg, bass) {
      this.meshGroup.children.forEach((mesh, i) => {
        const val = data[i % (data.length/2)] / 255;
        mesh.position.y = val * 10;
        mesh.scale.set(1, 1 + val * 5, 1);
        mesh.material.color.setHSL(0.5, 1, 0.3 + val * 0.7);
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
    createHelix() {
      // Double Helix DNA
      const geometry = new THREE.BufferGeometry();
      const count = 1000;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      
      const color1 = new THREE.Color(0x00E0E0);
      const color2 = new THREE.Color(0xFFFFFF);
      
      for(let i=0; i<count; i++) {
        const i3 = i * 3;
        const angle = i * 0.1;
        const radius = 5;
        const branch = i % 2 === 0 ? 1 : -1;
        
        // Store original angle and y for animation reference if needed, 
        // but we'll recompute in animateHelix
        positions[i3] = Math.cos(angle) * radius * branch;
        positions[i3+1] = (i * 0.05) - 25; // Spread -25 to 25
        positions[i3+2] = Math.sin(angle) * radius * branch;
        
        const c = i % 2 === 0 ? color1 : color2;
        colors[i3] = c.r;
        colors[i3+1] = c.g;
        colors[i3+2] = c.b;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      
      const points = new THREE.Points(geometry, material);
      points.rotation.z = Math.PI / 6; 
      this.meshGroup.add(points);
    },
    animateHelix(data, avg, bass) {
      const points = this.meshGroup.children[0];
      points.rotation.y += 0.02; // Spin
      
      const positions = points.geometry.attributes.position;
      
      for(let i=0; i<positions.count; i++) {
         const y = positions.getY(i);
         // Map Y position to data index
         const idx = Math.floor(((y + 25) / 50) * data.length);
         const safeIdx = Math.max(0, Math.min(idx, data.length - 1));
         const val = data[safeIdx] / 255;
         
         const angle = i * 0.1;
         const radius = 5 + (val * 5);
         const branch = i % 2 === 0 ? 1 : -1;
         
         positions.setX(i, Math.cos(angle) * radius * branch);
         positions.setZ(i, Math.sin(angle) * radius * branch);
      }
      positions.needsUpdate = true;
    },
    handleResize() {
      if (this.camera) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        // Re-adjust camera z on resize
        const isMobile = window.innerWidth < 768;
        this.camera.position.z = isMobile ? 35 : 20;
      }
      if (this.composer) {
        this.composer.setSize(window.innerWidth, window.innerHeight);
      }
    },
    cleanupThree() {
      cancelAnimationFrame(this.animationId);
      ThreeManager.unmount();
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
  background: radial-gradient(circle at center, #1a1a1c, #0b0b0c);
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

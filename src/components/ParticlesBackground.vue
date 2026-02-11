<template>
  <div class="particles-container">
    <vue-particles
      id="tsparticles"
      :options="particlesOptions"
    />
  </div>
</template>

<script>
export default {
  name: 'ParticlesBackground',
  data() {
    return {
      particlesOptions: {
        background: {
          color: {
            value: "transparent" // We keep the CSS gradient background
          }
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push"
            },
            onHover: {
              enable: true,
              mode: "grab"
            },
            resize: true
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 40
            },
            push: {
              quantity: 4
            },
            repulse: {
              distance: 200,
              duration: 0.4
            },
            grab: {
              distance: 140,
              links: {
                opacity: 0.5
              }
            }
          }
        },
        particles: {
          color: {
            value: "#2bf1ff"
          },
          links: {
            color: "#2bf1ff",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce"
            },
            random: true,
            speed: 1,
            straight: false,
            path: {
              enable: true,
              options: {
                size: 30, // waviness
                draw: false,
                increment: 0.004
              },
              generator: "simplexNoise" // requires path generator plugin, but standard move random is often enough. 
              // simpler: just use random move with straight: false
            },
            // Let's stick to standard organic movement for reliability first
          },
          number: {
            density: {
              enable: true,
              area: 800
            },
            value: 80
          },
          opacity: {
            value: 0.3,
            random: true,
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false
            }
          },
          shape: {
            type: "circle"
          },
          size: {
            value: { min: 1, max: 3 },
            random: true,
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 0.1,
              sync: false
            }
          }
        },
        detectRetina: true
      }
    };
  }
}
</script>

<style scoped>
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
  pointer-events: auto; /* Allow interactions */
}
</style>

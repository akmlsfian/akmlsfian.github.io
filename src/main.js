import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import Particles from "@tsparticles/vue3";
import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.

const app = createApp(App);

app.use(Particles, {
  init: async engine => {
    await loadFull(engine); // you can load the full tsParticles library from "tsparticles" if you need it
  }
});

app.mount('#app')

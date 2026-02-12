<template>
  <div class="home-view">
    <div class="content-wrapper">
      <section id="about" class="page-section">
        <div class="container">
          <BioSection />
        </div>
      </section>

      <section id="skills" class="page-section">
        <div class="container">
          <SkillsSection />
        </div>
      </section>

      <section id="portfolio" class="page-section">
        <div class="container">
          <PortfolioGallery />
        </div>
      </section>

      <section id="contact" class="page-section">
        <div class="container">
          <ContactSection />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import BioSection from '../components/BioSection.vue';
import SkillsSection from '../components/SkillsSection.vue';
import PortfolioGallery from '../components/PortfolioGallery.vue';
import ContactSection from '../components/ContactSection.vue';

export default {
  name: 'HomeView',
  components: {
    BioSection,
    SkillsSection,
    PortfolioGallery,
    ContactSection
  }
}
</script>

<style lang="scss" scoped>
.content-wrapper {
  position: relative;
  z-index: 10;
}
</style>

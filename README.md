# Akmal Sufian - Interactive Portfolio

## Repository Analysis
This repository has been transformed from a legacy static HTML/CSS template into a modern Vue 3 application.

### Structure
- **src/**: Source code for the Vue application.
  - **components/**: Vue components (Options API).
  - **data/**: JSON files containing content (Bio, Skills, Portfolio).
  - **style.scss**: Global styles and variables.
- **public/**: Static assets (images, icons).
- **_legacy/**: Archived files from the previous version.

### Tech Stack
- **Framework**: Vue 3 (Options API)
- **Build Tool**: Vite
- **Styling**: SCSS, CSS Variables
- **Graphics**: Three.js (Particle Background)
- **Icons**: Iconify/vue

## Deployment Configuration

### GitHub Pages Settings
- **Source**: Deploy from a branch
- **Branch**: `gh-pages` (Folder: `/root`)
- **Domain**: https://akmlsfian.github.io

### Automated Deployment
A GitHub Actions workflow is configured in `.github/workflows/deploy.yml`. 
- **Trigger**: Push to `main` branch.
- **Process**: Installs dependencies, builds the project, and pushes the `dist` folder to the `gh-pages` branch.

## Development

### Setup
```bash
npm install
```

### Run Local Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

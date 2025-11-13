import { homeHeroTemplate } from './hero.template.js';
import { homeHeroStyles } from './hero.styles.js';

const templateCache = document.createElement('template');

class HomeHeroSection extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    if (!templateCache.innerHTML) {
      templateCache.innerHTML = `
        <style>${homeHeroStyles}</style>
        ${homeHeroTemplate()}
      `;
    }

    this.innerHTML = '';
    this.appendChild(templateCache.content.cloneNode(true));
  }
}

customElements.define('home-hero-section', HomeHeroSection);

export default HomeHeroSection;
export { HomeHeroSection };

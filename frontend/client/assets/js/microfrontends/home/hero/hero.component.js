import { homeHeroTemplate } from './hero.template.js';
import { homeHeroStyles } from './hero.styles.js';

import { injectStyles } from '../../../utils/shadow-style-loader.js';

const templateCache = document.createElement('template');

class HomeHeroSection extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    await this.render();
  }

  async render() {
    if (!templateCache.innerHTML) {
      templateCache.innerHTML = `${homeHeroTemplate()}`;
    }

    this.root.innerHTML = '';
    await injectStyles(this.root, homeHeroStyles);
    this.root.appendChild(templateCache.content.cloneNode(true));
  }
}

customElements.define('home-hero-section', HomeHeroSection);

export default HomeHeroSection;
export { HomeHeroSection };

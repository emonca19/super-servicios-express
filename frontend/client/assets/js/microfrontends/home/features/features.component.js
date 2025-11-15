import '../../../components/feature-card/feature-card.js';
import { HOME_FEATURES } from './features.data.js';
import { homeFeaturesTemplate } from './features.template.js';
import { homeFeaturesStyles } from './features.styles.js';
import { injectStyles } from '../../../utils/shadow-style-loader.js';

const templateCache = document.createElement('template');

class HomeFeaturesGrid extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    await this.render();
  }

  async render() {
    if (!templateCache.innerHTML) {
      templateCache.innerHTML = `${homeFeaturesTemplate(HOME_FEATURES)}`;
    }

    this.root.innerHTML = '';
    await injectStyles(this.root, homeFeaturesStyles);
    this.root.appendChild(templateCache.content.cloneNode(true));
  }
}

customElements.define('home-features-grid', HomeFeaturesGrid);

export default HomeFeaturesGrid;
export { HomeFeaturesGrid };

import '../../../components/feature-card/feature-card.js';
import { HOME_FEATURES } from './features.data.js';
import { homeFeaturesTemplate } from './features.template.js';
import { homeFeaturesStyles } from './features.styles.js';

const templateCache = document.createElement('template');

class HomeFeaturesGrid extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    if (!templateCache.innerHTML) {
      templateCache.innerHTML = `
        <style>${homeFeaturesStyles}</style>
        ${homeFeaturesTemplate(HOME_FEATURES)}
      `;
    }

    this.innerHTML = '';
    this.appendChild(templateCache.content.cloneNode(true));
  }
}

customElements.define('home-features-grid', HomeFeaturesGrid);

export default HomeFeaturesGrid;
export { HomeFeaturesGrid };

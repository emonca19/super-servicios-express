// Template for FeatureCard component
const featureCardTemplate = ({ iconHTML, title, description }) => `
  <div class="feature-card-root">
    <div class="feature-icon">
      ${iconHTML}
    </div>
    <h3 class="feature-title">${title}</h3>
    <p class="feature-desc">${description}</p>
  </div>
`;

export { featureCardTemplate };

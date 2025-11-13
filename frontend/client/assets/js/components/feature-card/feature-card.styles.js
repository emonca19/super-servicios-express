// Styles for FeatureCard component (scoped via component insertion)
const featureCardStyles = `
  .feature-card-root {
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 8px 16px rgba(2,6,23,0.06);
    text-align: center;
    border: 1px solid #f1f5f9;
    transition: transform .25s ease, box-shadow .25s ease;
  }

  .feature-card-root:hover { transform: translateY(-6px); box-shadow: 0 20px 30px rgba(2,6,23,0.08); }

  .feature-icon { display: inline-flex; background: #eff6ff; border-radius: 9999px; padding: .75rem; margin-bottom: 1rem; }
  .feature-title { font-size: 1.375rem; font-weight: 600; color: #0f172a; margin-bottom: .5rem; }
  .feature-desc { color: #475569; line-height: 1.5; }

`;

export { featureCardStyles };

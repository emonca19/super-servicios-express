const popularServicesStyles = `
  :host { display:block; }
  .services-grid { display:grid; grid-template-columns:1fr; gap:1.25rem; }
  @media(min-width:768px) { .services-grid { grid-template-columns: repeat(3,1fr); } }
  .service-empty, .service-loading { text-align:center; padding:2rem; color:#64748b; }
`;

export default popularServicesStyles;
export { popularServicesStyles };

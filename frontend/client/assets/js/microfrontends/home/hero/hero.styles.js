const homeHeroStyles = `
  :host { display:block; }
  .hero { position:relative; overflow:hidden; border-radius: .5rem; }
  .hero .overlay { position:absolute; inset:0; background: rgba(0,0,0,0.15); }
  .hero .container { position:relative; z-index:1; }
`;

export default homeHeroStyles;
export { homeHeroStyles };

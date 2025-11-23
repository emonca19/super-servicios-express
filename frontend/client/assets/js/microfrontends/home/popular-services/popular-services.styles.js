const popularServicesStyles = `
  :host { display:block; }
  .service-empty, .service-loading { text-align:center; padding:2rem; color:#64748b; }

  /* Carousel layout */
  .carousel { overflow: hidden; position: relative; }
  .carousel-track {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    padding-bottom: 4px;
  }
  .carousel-track::-webkit-scrollbar { height: 8px; }
  .carousel-track::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.12); border-radius: 999px; }

  .carousel-item { flex: 0 0 100%; scroll-snap-align: start; }
  @media (min-width: 640px) { .carousel-item { flex: 0 0 50%; } }
  @media (min-width: 1024px) { .carousel-item { flex: 0 0 30%; } }

  .carousel-prev, .carousel-next {
    position: absolute; top: 50%; transform: translateY(-50%); z-index: 30;
    width: 44px; height: 44px; border-radius: 999px; border: none;
    background: rgba(255,255,255,0.9); color: #1f2937; font-size: 22px;
    display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(15,23,42,0.08);
  }
  .carousel-prev { left: 8px; }
  .carousel-next { right: 8px; }

  .carousel-dots { display:flex; justify-content:center; gap:0.5rem; }
  .carousel-dots button { width:10px; height:10px; border-radius:999px; border:none; background: #cbd5e1; }
  .carousel-dots button.active { background: #fb923c; }
`;

export default popularServicesStyles;
export { popularServicesStyles };

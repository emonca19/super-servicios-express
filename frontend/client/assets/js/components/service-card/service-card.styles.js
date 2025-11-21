const serviceCardStyles = `
  :host { 
    display: block; 
    width: 100%;
    max-width: 100%;
    height: 100%; /* Asegura que el componente web ocupe toda la altura de la celda de la grilla */
    box-sizing: border-box;
  }
  * { box-sizing: border-box; }

  .service-card {
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(2,6,23,0.06);
    transition: transform .3s ease, box-shadow .3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;       /* Ocupa toda la altura disponible */
    min-height: 450px;  /* Altura mínima para garantizar uniformidad */
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .service-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px rgba(2,6,23,0.08); }

  .service-image { width: 100%; height: 180px; overflow: hidden; flex-shrink: 0; }
  .service-image img { width: 100%; max-width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .3s ease; }
  .service-card:hover .service-image img { transform: scale(1.05); }

  .service-content { 
    padding: 1.25rem; 
    display: flex; 
    flex-direction: column; 
    flex: 1; /* Hace que este contenedor crezca para llenar el espacio */
  }
  
  .service-name { 
    font-size: 1.125rem; 
    font-weight: 700; 
    color: #1e293b; 
    margin-bottom: 0.5rem; 
    
    line-height: 1.4em;
    height: 2.8em; /* 1.4em * 2 líneas = 2.8em */
    
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .service-description {
    font-size: .875rem;
    color: #64748b;
    margin-bottom: 1rem;
    
    line-height: 1.5em;
    height: 4.5em; /* 1.5em * 3 líneas = 4.5em */
    
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  @media (max-width:720px) {
    .service-card { min-height: auto; }
    .service-image { height: 160px; }
  }

  .service-footer { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    padding-top: 1rem; 
    border-top: 1px solid #e2e8f0; 
    margin-top: auto; /* Esto es clave: empuja el footer al fondo de la tarjeta */
  }
  
  .service-price { font-size: 1.5rem; font-weight: 700; color: #10b981; }
  
  .btn-book { padding: .5rem 1.25rem; background: #4169e1; color: #fff; border: none; border-radius: .375rem; font-weight: 600; cursor: pointer; }
  .btn-book:hover { background: #2c54c7; transform: translateY(-2px); }

  .service-modal { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; z-index: 1200; padding: 1rem; }
  .service-modal.show { display: flex; }
  .service-modal .modal-backdrop { position: absolute; inset: 0; background: rgba(2,6,23,0.6); backdrop-filter: blur(2px); }

  .service-modal .modal-card { 
    position: relative; 
    z-index: 2; 
    background: #fff; 
    border-radius: 12px; 
    padding: 1.25rem; 
    max-width: 920px; 
    width: calc(100% - 2rem); 
    box-shadow: 0 18px 40px rgba(2,6,23,0.25); 
    display: flex; 
    gap: 1.25rem; 
    align-items: flex-start; 
    max-height: 90vh; 
  }

  .service-modal .modal-image { width: 44%; height: 260px; flex-shrink: 0; overflow: hidden; border-radius: 10px; }
  .service-modal .modal-image img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .service-modal .modal-content { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; overflow: hidden; }
  
  .service-modal .modal-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem; }
  .service-modal .modal-sub { color: #64748b; font-size: 0.95rem; margin-bottom: 0.5rem; }

  .service-modal .modal-desc { 
    color: #475569; 
    font-size: 1rem; 
    line-height: 1.6; 
    margin-bottom: 0.25rem;
    white-space: pre-wrap; 
    word-break: break-word;
    overflow-wrap: break-word;
    max-height: 300px; 
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .service-modal .meta-row { display: flex; gap: 0.75rem; align-items: center; color: #334155; font-weight: 600; margin-top: 4px; }
  .service-modal .modal-price { font-size: 1.4rem; font-weight: 900; color: #059669; margin-top: 6px; }
  
  .service-modal .modal-actions { display: flex; gap: 0.75rem; margin-top: auto; padding-top: 10px; }
  
  .service-modal .modal-close { position: absolute; top: 10px; right: 10px; background: transparent; border: none; font-size: 1.35rem; cursor: pointer; color: #374151; }
  
  .service-modal .btn-primary { padding: .6rem 1rem; background: #0f172a; color: #fff; border-radius: 8px; border: none; cursor: pointer; font-weight: 700; }
  .service-modal .btn-primary:hover { background: #182234; }
  
  .service-modal .btn-ghost { padding: .5rem .9rem; background: transparent; border: 1px solid #cbd5e1; color: #334155; border-radius: 8px; cursor: pointer; font-weight: 600; }

  @media (max-width:720px) {
    .service-modal .modal-card { flex-direction: column; padding: 1rem; overflow-y: auto; }
    .service-modal .modal-image { width: 100%; height: 180px; }
    .service-modal .modal-desc { max-height: 200px; }
  }
`;

export default serviceCardStyles;
export { serviceCardStyles };
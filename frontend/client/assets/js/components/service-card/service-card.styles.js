
const serviceCardStyles = `
  * { box-sizing: border-box; }
  .service-card {
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(2,6,23,0.06);
    transition: transform .3s ease, box-shadow .3s ease;
    display: flex;
    flex-direction: column;
  }
  .service-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px rgba(2,6,23,0.08); }
  .service-image { width: 100%; height: 200px; overflow: hidden; }
  .service-image img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s ease; }
  .service-card:hover .service-image img { transform: scale(1.05); }
  .service-content { padding: 1.5rem; display:flex; flex-direction:column; flex:1; }
  .service-name { font-size: 1.25rem; font-weight:700; color:#1e293b; margin-bottom:.75rem; }
  .service-description { font-size:.875rem; color:#64748b; line-height:1.6; margin-bottom:1.5rem; flex:1; }
  .service-footer { display:flex; justify-content:space-between; align-items:center; padding-top:1rem; border-top:1px solid #e2e8f0; }
  .service-price { font-size:1.5rem; font-weight:700; color:#10b981; }
  .btn-book { padding:.5rem 1.25rem; background:#4169e1; color:#fff; border:none; border-radius:.375rem; font-weight:600; cursor:pointer; }
  .btn-book:hover { background:#2c54c7; transform: translateY(-2px); }
`;

export { serviceCardStyles };

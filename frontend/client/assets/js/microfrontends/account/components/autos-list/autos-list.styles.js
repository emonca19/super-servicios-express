export const autosListStyles = `
    :host { display: block; }
    .list-controls { display:flex; flex-wrap:wrap; gap:0.6rem; align-items:center; margin-bottom:1rem; padding:0.6rem 0.75rem; border-radius:12px; border:1px solid rgba(226,232,240,0.9); background:transparent; box-shadow:none; }
    .search { position:relative; flex:1 1 240px; }
    .search input { width:100%; padding:0.65rem 1rem 0.65rem 2.4rem; border:1px solid rgba(226,232,240,0.9); border-radius:10px; background:#ffffff; font-weight:600; color:#0f172a; box-shadow:none; }
    .search svg { position:absolute; top:50%; left:1rem; transform:translateY(-50%); width:16px; height:16px; color:#94a3b8; }
    .page-indicator { color:#94a3b8; font-weight:600; font-size:0.95rem; }
    .pager { display:flex; gap:0.5rem; align-items:center; }
    .pager button { border:1px solid rgba(203,213,225,0.9); background:#fff; border-radius:999px; padding:0.45rem 0.95rem; font-weight:700; color:#0f172a; transition:all 150ms ease; }
    .pager button:disabled { opacity:0.35; cursor:not-allowed; }
    .pager button:not(:disabled):hover { color:#2563eb; border-color:#2563eb; }

    #autos-list > .autos-item { margin-bottom:0.75rem; }
    .auto-card { border:1px solid #e2e8f0; border-radius:8px; padding:1rem; background:#fafafa; transition:all 150ms ease; }
    .auto-card:hover { background:#fff; border-color:#cbd5e1; box-shadow:0 6px 16px rgba(0,0,0,0.06); transform:translateY(-2px); }
    .auto-header { display:flex; gap:0.75rem; justify-content:space-between; flex-wrap:wrap; align-items:center; }
    .auto-main { display:flex; gap:0.65rem; align-items:center; flex:1; }
    .auto-actions { display:flex; gap:0.5rem; }
    .car-chip { width:36px; height:36px; border-radius:6px; display:grid; place-items:center; background:#f1f5f9; color:#475569; flex-shrink:0; }
    .car-icon { width:20px; height:20px; }
    .auto-name { font-size:0.9375rem; font-weight:600; color:#0f172a; margin:0; }
    .auto-meta { display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.25rem; }
    .auto-badge { background:#f1f5f9; color:#475569; border-radius:4px; padding:0.2rem 0.5rem; font-weight:500; font-size:0.75rem; display:inline-flex; gap:0.25rem; align-items:center; }
    .fields { display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.5rem; margin-top:0.625rem; }
    .field-tile { border:1px solid #e2e8f0; border-radius:6px; padding:0.5rem 0.625rem; background:#fafafa; }
    .field-label { color:#94a3b8; font-weight:600; font-size:0.6875rem; text-transform:uppercase; letter-spacing:0.03em; margin-bottom:0.15rem; }
    .field-value { color:#0f172a; font-weight:600; font-size:0.875rem; }
    .btn-icon { background:transparent; border:1px solid #e2e8f0; border-radius:6px; padding:0.4rem; cursor:pointer; transition:all 150ms ease; display:inline-flex; align-items:center; justify-content:center; }
    .btn-icon:hover { background:#dbeafe; border-color:#93c5fd; color:#1e40af; }
    .btn-icon-danger:hover { background:#fee2e2; border-color:#fca5a5; color:#dc2626; }
    .btn-icon svg { width:16px; height:16px; }
`;

export const profileCardStyles = `
    :host { display: block; }
    .profile-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(360px,1fr)); gap:1.5rem; }
    .info-block { display:flex; gap:0.75rem; align-items:center; padding:0.75rem; border:1px solid #e2e8f0; border-radius:8px; background:#fafafa; transition:all 150ms ease; }
    .info-block:hover { background:#fff; border-color:#cbd5e1; }
    .soft-icon { width:32px; height:32px; border-radius:6px; display:grid; place-items:center; background:#f1f5f9; color:#64748b; flex-shrink:0; }
    .info-label { font-size:0.6875rem; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:0.03em; margin-bottom:0.15rem; }
    .info-value { font-size:0.875rem; font-weight:600; color:#0f172a; }
    button[data-action="edit"] { background:transparent; border:1px solid #e2e8f0; border-radius:6px; padding:0.4rem; cursor:pointer; transition:all 150ms ease; display:inline-flex; align-items:center; justify-content:center; color:#64748b; }
    button[data-action="edit"]:hover { background:#dbeafe; border-color:#93c5fd; color:#1e40af; }
    button[data-action="edit"] svg { width:16px; height:16px; }
`;

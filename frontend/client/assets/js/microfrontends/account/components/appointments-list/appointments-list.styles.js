export const appointmentsListStyles = `
    :host { display: block; }
    .cita-card { border:1px solid #e2e8f0; border-radius:8px; padding:0.875rem; background:#fafafa; margin-bottom:0.625rem; transition:all 150ms ease; }
    .cita-card:hover { background:#fff; border-color:#cbd5e1; }
    .cita-heading { display:flex; justify-content:space-between; gap:0.75rem; align-items:center; flex-wrap:wrap; }
    .card-icon { width:28px; height:28px; border-radius:6px; display:grid; place-items:center; background:#f1f5f9; color:#475569; flex-shrink:0; }
    .card-icon svg { width:18px; height:18px; }
    .badge { display:inline-flex; align-items:center; gap:0.25rem; padding:0.25rem 0.5rem; border-radius:4px; font-size:0.6875rem; font-weight:600; letter-spacing:0.02em; text-transform:uppercase; }
    .badge-pending { background-color:#fef3c7; color:#92400E; border:1px solid #fde68a; }
    .badge-confirmed { background-color:#dbeafe; color:#1e40af; border:1px solid #bfdbfe; }
    .badge-completed { background-color:#dcfce7; color:#15803d; border:1px solid #bbf7d0; }
    .badge-cancelled { background-color:#fee2e2; color:#991b1b; border:1px solid #fecaca; }
`;

export const autoFormModalStyles = `
    :host { display: block; }
    #auto-modal { 
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15,23,42,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 1000;
    }
    .modal-card { 
      background: #ffffff; 
      border: 1px solid rgba(226,232,240,0.9); 
      border-radius: 14px; 
      padding: 1.25rem; 
      box-shadow: none;
      max-height: 90vh;
      overflow-y: auto;
      width: 100%;
      max-width: 640px;
    }
    h3 { font-size:1.25rem; font-weight:700; margin-bottom:0.6rem; margin-top:0; }
    form input, form select { border:1px solid rgba(226,232,240,0.9); border-radius:10px; background:#fff; }
    
    .modal-actions { display:flex; gap:12px; justify-content:flex-end; padding-top:16px; }
    @media (max-width:640px) { .modal-actions { flex-direction:column-reverse; align-items:stretch; } .modal-actions .btn-primary, .modal-actions .btn-ghost { width:100%; } }

    .btn-primary { background:#0f172a; color:#ffffff; padding:0.5rem 0.875rem; border-radius:6px; font-weight:600; font-size:0.8125rem; border:none; cursor:pointer; transition: background 150ms ease; }
    .btn-primary:hover { background:#1e293b; }
    .btn-ghost { background:transparent; border:1px solid #cbd5e1; color:#475569; padding:0.4rem 0.75rem; border-radius:6px; font-weight:500; font-size:0.8125rem; cursor:pointer; transition: all 150ms ease; }
    .btn-ghost:hover { border-color:#94a3b8; color:#0f172a; background:#f8fafc; }
`;

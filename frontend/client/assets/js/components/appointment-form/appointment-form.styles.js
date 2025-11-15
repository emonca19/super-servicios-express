const appointmentFormStyles = `
  :host { display: block; }
  :host([hidden]) { display: none; }

  /* Wrapper fallback in case Tailwind isn't loaded in the shadow root */
  .appointment-form-wrapper { max-width: 900px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 1.25rem; box-shadow: 0 8px 20px rgba(2,6,23,0.05); }

  label { display:block; font-weight:600; margin-bottom:0.35rem; color: #0f172a; }
  input[type='text'], input[type='email'], select, textarea { width:100%; padding:.6rem .75rem; border:1px solid #e6edf3; border-radius: .5rem; background:#fff; color:#0f172a; }
  textarea { min-height: 110px; resize:vertical; }
  .form-row { display:grid; grid-template-columns: 1fr; gap: .75rem; }
  @media(min-width:768px) { .form-row.md-2 { grid-template-columns: repeat(2,1fr); } .form-row.md-3 { grid-template-columns: repeat(3,1fr); } }

  .form-actions { display:flex; gap:.75rem; justify-content:flex-end; margin-top:1rem; }
  .btn { background:#0ea5a4; color:white; padding:.6rem 1rem; border-radius:.5rem; border:none; cursor:pointer; font-weight:600; }
  .btn.secondary { background:#e2e8f0; color:#0f172a; }
`;

export default appointmentFormStyles;
export { appointmentFormStyles };


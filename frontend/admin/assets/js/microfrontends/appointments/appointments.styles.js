// assets/js/microfrontends/appointments/appointments.styles.js

export const appointmentsStyles = `
:host { display: block; width: 100%; height: 100%; }
.appointments { width: 100%; min-height: 100%; padding-bottom: 2rem; overflow-y: auto; overflow-x: hidden; }
.appointments::-webkit-scrollbar { width: 8px; }
.appointments::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.18); border-radius: 20px; }

.title { font-size: 26px; font-weight: 700; color: #2563eb; margin-bottom: .25rem; }
.subtitle { font-size: 14px; color: #6b7280; margin-bottom: 1.5rem; }

.filters { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.filter-pill { border-radius: 999px; padding: 0.45rem 1.2rem; background: #f3f4f6; color: #4b5563; font-size: 14px; border: none; cursor: pointer; transition: all .20s ease; }
.filter-pill:hover { background: #e5e7eb; }
.filter-pill.active { background: #ff8a00; color: white; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }

.new-appointment-btn { margin-left: auto; background: #2563eb; color: white; border: none; padding: .5rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 500; }
.new-appointment-btn:hover { background: #1d4ed8; }

/* --- MODAL STYLES --- */
.modal-backdrop { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.52); backdrop-filter: blur(4px); z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }
.modal-backdrop.is-open { opacity: 1; pointer-events: auto; }
.modal-card { background: white; border-radius: 16px; width: 100%; max-width: 600px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); transform: translateY(10px); transition: transform 0.2s ease; max-height: 90vh; overflow-y: auto; }
.modal-backdrop.is-open .modal-card { transform: translateY(0); }

.modal-header { padding: 1.2rem; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
.modal-title { font-size: 1.2rem; font-weight: 700; color: #1f2937; }
.modal-close { background: transparent; border: none; cursor: pointer; color: #6b7280; }
.modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }

.row-2-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.3rem; }
.field-label { font-size: 0.85rem; font-weight: 600; color: #374151; }
.field-input { padding: 0.6rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.9rem; background: #f9fafb; }
.field-input:focus { outline: none; border-color: #2563eb; background: white; }
.field-input[readonly] { color: #6b7280; cursor: default; }
.field-textarea { resize: vertical; min-height: 80px; }

.modal-footer { padding: 1.2rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 0.8rem; }
.btn-secondary { background: white; border: 1px solid #d1d5db; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; }
.btn-primary { background: #2563eb; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; font-weight: 500; }

/* Modal Danger */
.modal-card--danger { border-top: 4px solid #ef4444; }
.modal-title--danger { color: #b91c1c; }
.btn-delete-confirm { background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; }
`;
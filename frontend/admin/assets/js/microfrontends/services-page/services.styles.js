export const servicesStyles = `
:host { display: block; width: 100%; height: 100%; }
.services { height: 100%; min-height: 100%; padding-bottom: 2rem; overflow-y: auto; }
.services::-webkit-scrollbar { width: 8px; }
.services::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 20px; }
.services::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 20px; }

.title { font-size: 28px; font-weight: 700; margin-bottom: .25rem; color: #1f2937; }
.subtitle { font-size: 14px; color: #6b7280; margin-bottom: 1.5rem; }
.top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.3rem; gap: 1rem; }

.new-service-btn { background: #ff8a00; color: white; border: none; padding: .65rem 1.4rem; font-size: 14px; border-radius: 8px; cursor: pointer; transition: .25s; white-space: nowrap; font-weight: 500; }
.new-service-btn:hover { background: #e67a00; transform: translateY(-2px); box-shadow: 0 3px 6px rgba(0,0,0,0.15); }

@media (max-width: 768px) { .top-bar { flex-direction: column; align-items: stretch; } .new-service-btn { align-self: flex-end; } }

/* --- ESTILOS DE MODALES (Igual que Clientes/Vehículos) --- */
.modal-backdrop { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.52); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.25s ease; }
.modal-backdrop.is-open { opacity: 1; pointer-events: auto; }
.modal-card { background: #ffffff; border-radius: 18px; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.35); width: 100%; max-width: 520px; transform: translateY(8px) scale(0.96); transition: transform 0.25s ease, opacity 0.25s ease; opacity: 0; }
.modal-backdrop.is-open .modal-card { transform: translateY(0) scale(1); opacity: 1; }
.modal-card--small { max-width: 420px; }
.modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #edf2f7; display: flex; align-items: center; justify-content: space-between; }
.modal-title { font-size: 1.1rem; font-weight: 700; color: #111827; }
.modal-close { border: none; background: transparent; cursor: pointer; padding: 0.25rem; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; transition: background 0.15s ease, color 0.15s ease; }
.modal-close:hover { background: #f3f4f6; color: #111827; }
.modal-close-icon { width: 20px; height: 20px; }
.modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field-label { font-size: 0.85rem; font-weight: 500; color: #4b5563; }
.field-input { width: 100%; padding: 0.55rem 0.8rem; border-radius: 0.7rem; border: 1px solid #e5e7eb; font-size: 0.9rem; outline: none; background-color: #f9fafb; transition: all 0.15s ease; box-sizing: border-box; }
.field-input:focus { border-color: #2563eb; background-color: #ffffff; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12); }
.field-input[readonly] { background-color: #f9fafb; color: #4b5563; cursor: default; }
.field-textarea { resize: vertical; min-height: 80px; }
.modal-footer { padding-top: 0.75rem; display: flex; justify-content: flex-end; gap: 0.75rem; }
.btn-secondary, .btn-primary { border-radius: 999px; padding: 0.55rem 1.2rem; font-size: 0.9rem; font-weight: 500; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.15s ease; }
.btn-secondary { background: #f3f4f6; color: #374151; }
.btn-secondary:hover { background: #e5e7eb; transform: translateY(-1px); }
.btn-primary { background: #2563eb; color: #ffffff; box-shadow: 0 8px 18px rgba(37, 99, 235, 0.35); }
.btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 10px 24px rgba(37, 99, 235, 0.45); }
.btn-primary:disabled { opacity: 0.7; cursor: default; transform: none; box-shadow: none; }

/* Variante Peligro (Eliminar) */
.modal-backdrop--danger { background: rgba(15, 23, 42, 0.55); }
.modal-card--danger { border-radius: 18px; border: 1px solid rgba(248, 113, 113, 0.25); box-shadow: 0 18px 40px rgba(15, 23, 42, 0.45); }
.modal-header--danger { padding: 1.05rem 1.4rem 0.7rem; display: flex; align-items: center; gap: 0.85rem; border-bottom: 1px solid #fee2e2; background: #fff7f7; }
.modal-icon-wrapper { width: 34px; height: 34px; border-radius: 999px; display: flex; align-items: center; justify-content: center; background: rgba(248, 113, 113, 0.12); color: #ef4444; flex-shrink: 0; }
.modal-icon-wrapper svg { width: 19px; height: 19px; }
.modal-title--danger { font-size: 1rem; font-weight: 700; color: #b91c1c; }
.modal-subtitle { font-size: 0.8rem; color: #6b7280; margin-top: 0.1rem; }
.modal-body--danger { padding: 0.9rem 1.4rem 1.3rem; }
.delete-item-name { margin-top: 0.55rem; font-weight: 600; color: #111827; }
.modal-footer--danger { padding-top: 0.9rem; display: flex; justify-content: flex-end; gap: 0.6rem; }
.btn-delete-cancel { background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; border-radius: 999px; padding: 0.5rem 1.25rem; font-weight: 500; cursor: pointer; }
.btn-delete-cancel:hover { background: #e5e7eb; }
.btn-delete-confirm { background: #ef4444; color: #ffffff; border-radius: 999px; padding: 0.5rem 1.25rem; font-weight: 500; border: none; cursor: pointer; box-shadow: 0 8px 18px rgba(239, 68, 68, 0.45); }
.btn-delete-confirm:hover { background: #dc2626; transform: translateY(-1px); }
.btn-delete-confirm:disabled { opacity: 0.75; cursor: default; }
`;
// assets/js/microfrontends/users/main-clients.styles.js
export const clientsStyles = `
:host {
  display: block;
  width: 100%;
  height: 100%;
}

/* Contenedor general de la pagina */
.clients {
  height: 100%;
  min-height: 100%;
  padding-bottom: 2rem;
  overflow-y: auto;
}

/* Scrollbar */
.clients::-webkit-scrollbar { 
  width: 8px; 
}
.clients::-webkit-scrollbar-thumb { 
  background: #c1c1c1; 
  border-radius: 20px; 
}
.clients::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 20px;
}

/* Título */
.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: .25rem;
  color: #1f2937;
}

/* Subtítulo */
.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

/* Barra superior */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.3rem;
  gap: 1rem;
}

/* Botón nuevo cliente */
.new-client-btn {
  background: #ff8a00;
  color: white;
  border: none;
  padding: .65rem 1.4rem;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-weight: 500;
  white-space: nowrap;
}

.new-client-btn:hover {
  background: #e67a00;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 138, 0, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .new-client-btn {
    align-self: flex-end;
  }
}

/* =========================
   MODAL BASE (create / edit / view)
   ========================= */

.modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.52);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

/* visible */
.modal-backdrop.is-open {
  opacity: 1;
  pointer-events: auto;
}

.modal-card {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.35);
  width: 100%;
  max-width: 520px;
  transform: translateY(8px) scale(0.96);
  transition: transform 0.25s ease, opacity 0.25s ease;
  opacity: 0;
}

/* animación entrada */
.modal-backdrop.is-open .modal-card {
  transform: translateY(0) scale(1);
  opacity: 1;
}

/* Card más compacta para view / delete si se quiere */
.modal-card--small {
  max-width: 420px;
}

/* Header del modal */
.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #edf2f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
}

.modal-close {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #111827;
}

.modal-close-icon {
  width: 20px;
  height: 20px;
}

/* Cuerpo del modal */
.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Campos */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #4b5563;
}

.field-input {
  width: 100%;
  padding: 0.55rem 0.8rem;
  border-radius: 0.7rem;
  border: 1px solid #e5e7eb;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s ease,
              box-shadow 0.15s ease,
              background-color 0.15s ease;
  background-color: #f9fafb;
}

.field-input:focus {
  border-color: #2563eb;
  background-color: #ffffff;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12);
}

.field-input[readonly] {
  background-color: #f9fafb;
  color: #4b5563;
  cursor: default;
}

.field-textarea {
  resize: vertical;
  min-height: 70px;
}

/* Footer del modal */
.modal-footer {
  padding-top: 0.75rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Botones base (create / edit / view) */
.btn-secondary,
.btn-primary {
  border-radius: 999px;
  padding: 0.55rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: transform 0.12s ease,
              box-shadow 0.12s ease,
              background-color 0.15s ease,
              color 0.15s ease;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(55, 65, 81, 0.1);
}

.btn-primary {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.35);
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.45);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: default;
  transform: none;
  box-shadow: none;
}

/* =========================
   VARIANTE PELIGRO (ELIMINAR)
   ========================= */

/* Overlay casi igual al normal, sin drama */
.modal-backdrop--danger {
  background: rgba(15, 23, 42, 0.55);
}

/* Card con un ligero acento rojo, pero sobrio */
.modal-card--danger {
  border-radius: 18px;
  border: 1px solid rgba(248, 113, 113, 0.25);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.45);
}

/* Header con iconito y tono suave */
.modal-header--danger {
  padding: 1.05rem 1.4rem 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  border-bottom: 1px solid #fee2e2;
  background: #fff7f7;
}

.modal-icon-wrapper {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(248, 113, 113, 0.12);
  color: #ef4444;
  flex-shrink: 0;
}

.modal-icon-wrapper svg {
  width: 19px;
  height: 19px;
}

.modal-title--danger {
  font-size: 1rem;
  font-weight: 700;
  color: #b91c1c;
}

/* Subtítulo pequeño debajo del título */
.modal-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.1rem;
}

/* Cuerpo del modal de delete */
.modal-body--danger {
  padding: 0.9rem 1.4rem 1.3rem;
}

.modal-body--danger p {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.45;
}

.delete-client-name {
  margin-top: 0.55rem;
  font-weight: 600;
  color: #111827;
}

/* Footer del modal de delete */
.modal-footer--danger {
  padding-top: 0.9rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
}

/* Botones solo para el modal de eliminar */
.btn-delete-cancel,
.btn-delete-confirm {
  border-radius: 999px;
  padding: 0.5rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    transform 0.12s ease,
    box-shadow 0.12s ease;
}

/* Cancelar: estilo más neutral, alineado con btn-secondary */
.btn-delete-cancel {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.btn-delete-cancel:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(148, 163, 184, 0.28);
}

/* Confirmar: rojo, pero sin tanto glow loco */
.btn-delete-confirm {
  background: #ef4444;
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(239, 68, 68, 0.45);
}

.btn-delete-confirm:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(239, 68, 68, 0.6);
}

.btn-delete-confirm:disabled {
  opacity: 0.75;
  transform: none;
  box-shadow: none;
  cursor: default;
}
`;

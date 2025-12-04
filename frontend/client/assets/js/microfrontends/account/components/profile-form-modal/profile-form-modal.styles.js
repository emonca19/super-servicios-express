export const profileFormModalStyles = `
  :host {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  :host([open]) {
    pointer-events: auto;
    opacity: 1;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.95);
    background: #fff;
    width: 90%;
    max-width: 500px;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    transition: transform 0.2s ease;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
  }
  :host([open]) .modal {
    transform: translate(-50%, -50%) scale(1);
  }

  .modal-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8fafc;
  }
  .modal-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
  }
  .close-btn {
    background: transparent;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    display: grid;
    place-items: center;
  }
  .close-btn:hover {
    background: #e2e8f0;
    color: #0f172a;
  }

  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }
  .label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #334155;
    margin-bottom: 0.5rem;
  }
  .input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    font-size: 0.9375rem;
    color: #0f172a;
    transition: border-color 0.15s ease;
    background: #fff;
    box-sizing: border-box;
  }
  .input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .modal-footer {
    padding: 1.25rem 1.5rem;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }

  .btn {
    padding: 0.625rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid transparent;
  }
  .btn-secondary {
    background: #fff;
    border-color: #cbd5e1;
    color: #475569;
  }
  .btn-secondary:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
    color: #0f172a;
  }
  .btn-primary {
    background: #0f172a;
    color: #fff;
  }
  .btn-primary:hover {
    background: #1e293b;
  }
`;

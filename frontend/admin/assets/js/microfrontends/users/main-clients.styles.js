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
`;

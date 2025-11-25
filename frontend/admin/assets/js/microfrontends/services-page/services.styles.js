// Estilos de la pagina de servicios
// Este CSS se inyecta dentro del shadow DOM del componente

export const servicesStyles = `
:host {
  display: block;
  width: 100%;
  height: 100%;
}

/* Contenedor general de la pagina */
.services {
  height: 100%;
  min-height: 100%;
  padding-bottom: 2rem;
  overflow-y: auto;
}

/* Estilos del scrollbar */
.services::-webkit-scrollbar { width: 8px; }
.services::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 20px; }

/* Titulo principal */
.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: .25rem;
}

/* Subtitulo */
.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

/* Barra superior que contiene buscador y boton */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.3rem;
  gap: 1rem;
}

/* Boton para crear un nuevo servicio */
.new-service-btn {
  background: #ff8a00;
  color: white;
  border: none;
  padding: .65rem 1.4rem;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: .25s;
  white-space: nowrap;
}

/* Efecto al pasar el mouse sobre el boton */
.new-service-btn:hover {
  background: #e67a00;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0,0,0,0.15);
}
`;

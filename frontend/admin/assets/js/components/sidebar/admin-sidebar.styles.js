export const adminSidebarStyles = `
:host {
  display: block;
}

/* SIDEBAR */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: #1e3246;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255,255,255,.1);
  transition: width .25s ease;
  overflow: hidden;
}

.sidebar.slim {
  width: 70px !important;
}

/* RESIZE HANDLE */
#resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 100%;
  cursor: ew-resize;
  z-index: 50;
}

/* ========================= */
/* LOGO COMO NAV-ITEM        */
/* ========================= */

.logo-section {
  padding: 0;
  border-bottom: 1px solid rgba(255,255,255,.15);
  height: 90px;
  display: flex;
  align-items: center;
}

.logo-nav {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 1rem;
  gap: 1rem;
  width: 100%;
  text-decoration: none;
  color: white;
  border-radius: 8px;
}

.logo-nav:hover {
  background: rgba(255,255,255,.12);
}

/* Los iconos del logo y navegación permanecen fijos */
.logo-nav .icon,
.nav-item .icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-left: 0;
  transform: translateX(0) !important;
}

.label-group {
  display: flex;
  flex-direction: column;
  transition: 
    opacity 0.3s ease,
    transform 0.3s ease,
    width 0.3s ease;
  width: auto;
  overflow: hidden;
}

.label-group .main {
  font-size: 18px;
  font-weight: 600;
}

.label-group .sub {
  font-size: 9px;        /* más pequeño */
  opacity: .7;
  margin-top: -2px;      /* ajusta la alineación */
  line-height: 1.1;      /* compacta como la imagen */
  letter-spacing: 0.2px; /* mejora la lectura como el original */
  margin-left:5px;
}


/* SLIM MODE - solo ocultamos el texto del logo */
.sidebar.slim .label-group {
  opacity: 0;
  transform: translateX(-10px);
  width: 0;
}

.sidebar.slim .logo-nav {
  justify-content: flex-start;
  padding: 0 1rem;
}

/* ========================= */
/* NAV ITEMS                 */
/* ========================= */

.nav-container {
  padding-top: 1.5rem;
  overflow-y: auto;   /* ← scroll vertical SOLO aquí */
  overflow-x: hidden;
  flex: 1;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: .6rem;
}

.nav-item {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 1rem;
  gap: 1rem;
  border-radius: 8px;
  white-space: nowrap;
}

.nav-item:hover {
  background: rgba(255,255,255,.12);
}

/* Los iconos NO se mueven - posición fija */
.nav-item .icon {
  transition: none !important;
  transform: translateX(0) !important;
}

/* Labels con transición suave */
.nav-item .label {
  color: #dfe7ef;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.2px;
  transition: 
    opacity 0.3s ease,
    transform 0.3s ease,
    width 0.3s ease;
  width: auto;
  opacity: 1;
  transform: translateX(0);
}

.nav-item:hover .label {
  color: white;
}

/* Slim mode - solo ocultamos labels */
.sidebar.slim .nav-item {
  justify-content: flex-start;
  padding: 0 1rem;
}



.sidebar.slim .nav-item .label {
  opacity: 0;
  transform: translateX(-10px);
  width: 0;
  overflow: hidden;
}

/* ========================= */
/* FOOTER - MEJORADO         */
/* ========================= */

.footer {
  height: 110px;
  padding: 1rem;
  border-top: 1px solid rgba(255,255,255,.15);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: .3rem;
  position: relative;
  overflow: hidden;
}

/* Contenedor para textos del footer */
.footer-content {
  display: flex;
  flex-direction: column;
  gap: .3rem;
  transition: 
    opacity 0.3s ease,
    transform 0.3s ease;
  opacity: 1;
  transform: translateX(0);
}

/* Footer text styling */
.footer-text {
  display: block !important;
  color: #dfe7ef;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
}

.footer-name {
  color: white;
  font-size: 15px;
  font-weight: 600;
}

.footer-email {
  color: #dfe7ef;
  opacity: .8;
  font-size: 13px;
}

.footer-logout-text {
  color: #dfe7ef;
  opacity: .85;
  font-size: 14px;
  text-decoration: none;
}

.footer-logout-text:hover {
  color: #BB4E4E;
  opacity: 1;
}

/* ========================= */
/* LOGOUT WRAPPER - NUEVO    */
/* ========================= */

/* Wrapper para el logout en modo slim */
.logout-wrapper {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 0 1rem;
  box-sizing: border-box;
}
/* Icono logout */
.logout-icon {
  width: 24px;
  height: 24px;
  opacity: 0;
  visibility: hidden;
  transition: 
    opacity 0.4s ease 0.15s, /* Más lento y con delay */
    visibility 0.4s ease 0.15s; /* Mismo timing para visibilidad */
  flex-shrink: 0;
}

/* Hover effect igual que los nav-items */
.logout-wrapper:hover {
  background: rgba(255,255,255,.12);
}

.logout-wrapper:hover .logout-icon {
  opacity: 0.9;
}

/* Slim: mostramos icono logout y ocultamos textos */
.sidebar.slim .footer-content {
  opacity: 0 !important;
  transform: translateX(-5px);
  visibility: hidden;
  transition-delay: -1s;
}

/* SLIM: mostrar icono con un pequeño retraso suave */
.sidebar.slim .logout-icon {
  opacity: 1;
  visibility: visible;
  transition-delay: .2s;
}

/* NORMAL: mostrar texto con un pequeño retraso bonito */
.sidebar:not(.slim) .footer-content {
  opacity: 1;
  transform: translateX(0);
  visibility: visible;
  transition-delay: 0.12s;
}

/* NORMAL: ocultar icono logout suavemente */
.sidebar:not(.slim) .logout-wrapper {
  display: none;
}

.sidebar.slim .logout-wrapper {
  width: 100%;
  padding: 0 1rem; /* Mismo padding horizontal que los nav-items */
  justify-content: flex-start; /* Icono alineado a la izquierda */
}

.

.sidebar.slim .logout-wrapper:hover .logout-icon {
  opacity: 1;
}

/* ========================= */
/* ANIMACIONES MEJORADAS     */
/* ========================= */

.sidebar,
.logo-nav,
.nav-item,
.footer,
.label,
.label-group,
.footer-content {
  transition:
    width .3s ease,
    padding .3s ease,
    opacity .3s ease,
    transform .3s ease,
    visibility .3s ease;
}

/* Eliminamos transiciones de iconos */
.nav-item .icon,
.logo-nav .icon {
  transition: none;
}

.sidebar.slim .label,
.sidebar.slim .label-group {
  opacity: 0;
  transform: translateX(-10px);
}

.sidebar:not(.slim) .label,
.sidebar:not(.slim) .label-group {
  opacity: 1;
  transform: translateX(0);
}

/* === Scrollbar moderno === */
.nav-container::-webkit-scrollbar {
  width: 6px;               /* delgado y elegante */
}

.nav-container::-webkit-scrollbar-track {
  background: transparent;   /* sin fondo */
}

.nav-container::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.25);  /* color suave */
  border-radius: 20px;
}

.nav-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.35);  /* hover suave */
}

/* Firefox */
.nav-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.25) transparent;
}
`;
export const adminSidebarStyles = `
:host {
  display: block;
}

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

#resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 100%;
  cursor: ew-resize;
  z-index: 50;
}


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
  font-size: 9px;        
  opacity: .7;
  margin-top: -2px;      
  line-height: 1.1;      
  letter-spacing: 0.2px; 
  margin-left:5px;
}


.sidebar.slim .label-group {
  opacity: 0;
  transform: translateX(-10px);
  width: 0;
}

.sidebar.slim .logo-nav {
  justify-content: flex-start;
  padding: 0 1rem;
}


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
  position: relative;
}

.nav-item:hover {
  background: rgba(255,255,255,.12);
}

.nav-item.active {
  background: rgba(255, 152, 0, 0.15) !important;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: #FF9800;
  border-radius: 0 4px 4px 0;
}

.nav-item.active .label {
  color: #FF9800 !important;
  font-weight: 600;
}

.nav-item.active .icon {
  filter: brightness(0) saturate(100%) invert(67%) sepia(90%) saturate(1322%) hue-rotate(360deg) brightness(102%) contrast(105%);
}

.nav-item .icon {
  transition: none !important;
  transform: translateX(0) !important;
}

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

.sidebar.slim .nav-item.active::before {
  height: 40%;
  width: 3px;
}


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
  text-decoration: none;
}

.logout-icon {
  width: 24px;
  height: 24px;
  opacity: 0;
  visibility: hidden;
  transition: 
    opacity 0.4s ease 0.15s,
    visibility 0.4s ease 0.15s;
  flex-shrink: 0;
}

.logout-wrapper:hover {
  background: rgba(255,255,255,.12);
}

.logout-wrapper:hover .logout-icon {
  opacity: 0.9;
}

.sidebar.slim .logout-icon {
  opacity: 1;
  visibility: visible;
}

.sidebar:not(.slim) .logout-wrapper {
  display: none;
}

.sidebar.slim .logout-wrapper:hover .logout-icon {
  opacity: 1;
}

.sidebar.slim .footer-content {
  opacity: 0 !important;
  transform: translateX(-5px);
  visibility: hidden;
  transition: 
    opacity 0.00s ease 0.00s,  /* Desaparece rápido con poco delay */
    transform 0.25s ease 0s,
    visibility 0.25s ease 0s;
}

.sidebar:not(.slim) .footer-content {
  opacity: 1;
  transform: translateX(0);
  visibility: visible;
  transition: 
    opacity 0.3s ease 0.1s,
    transform 0.3s ease 0.1s,
    visibility 0.3s ease 0.1s;
}



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


.nav-container::-webkit-scrollbar {
  width: 6px;               
}

.nav-container::-webkit-scrollbar-track {
  background: transparent;   
}

.nav-container::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.25);  
  border-radius: 20px;
}

.nav-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.35); 
}

.nav-container {
  scrollbar-width: medium;
  scrollbar-color: rgba(255,255,255,0.25) transparent;
}
`;
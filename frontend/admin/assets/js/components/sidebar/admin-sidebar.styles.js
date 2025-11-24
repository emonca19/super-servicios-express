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

logo-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: .75rem;
  padding: 1.5rem 1rem;
  height: 90px;
  border-bottom: 1px solid rgba(255,255,255,.15);
  transition: all .25s ease;
}
.logo-box {
  min-width: 48px;
  width: 48px;
  height: 48px;
  background: rgba(255,255,255,.3);
  border-radius: 8px;
}

.logo-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: opacity .15s ease, width .25s ease;
}

.sidebar.slim .logo-text {
  opacity: 0;
  width: 0;
}
.sidebar.slim .logo-section {
  justify-content: flex-start !important;
  padding-left: 1rem !important;
}


.nav-container {
  padding-top: 1.5rem;
  flex: 1;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
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

.icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.sidebar.slim .nav-item {
  justify-content: center;
  padding: 0;
}

.label {
  transition: opacity .15s ease;
}

.sidebar.slim .label {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.footer {
  height: 110px;              
  padding: 1rem;
  border-top: 1px solid rgba(255,255,255,.15);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: .3rem;
}

.logout-icon {
  width: 26px;
  height: 26px;
  display: none;
}

.sidebar.slim .logout-icon {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.sidebar.slim .footer .label {
  opacity: 0;
  width: 0;
  overflow: hidden;
}
`;

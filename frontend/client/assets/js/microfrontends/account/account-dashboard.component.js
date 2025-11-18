import apiClient from '../../services/api-client.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    * { box-sizing: border-box; }
    :host { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display:block; color:#0f172a; }

    .page-shell { background:#f5f7fb; padding:clamp(1.25rem,2vw,2rem); border-radius:24px; }
    .page-head { display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.25rem; }
    @media (min-width:768px) { .page-head { flex-direction:row; justify-content:space-between; align-items:flex-end; } }
    .headline { font-size:1.1rem; letter-spacing:0.08em; text-transform:uppercase; color:#6b7280; font-weight:700; }
    .title { font-size:2rem; font-weight:800; color:#0f172a; line-height:1.2; }
    .sub { color:#6b7280; max-width:760px; }
    .head-actions { display:flex; flex-wrap:wrap; gap:0.5rem; }

    .btn-primary { background:#0f172a; color:#fff; padding:0.65rem 1.1rem; border-radius:12px; font-weight:700; font-size:0.95rem; border:1px solid #0f172a; transition:transform 150ms ease, box-shadow 150ms ease; }
    .btn-primary:hover { transform:translateY(-1px); box-shadow:0 10px 20px rgba(15,23,42,0.18); }
    .btn-ghost { background:#fff; border:1px solid #e5e7eb; color:#0f172a; padding:0.6rem 1rem; border-radius:10px; font-weight:700; font-size:0.95rem; }

    .stat-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.85rem; margin-bottom:1.5rem; }
    .stat-card { display:flex; align-items:center; gap:0.75rem; padding:0.9rem 1rem; background:#fff; border:1px solid #e5e7eb; border-radius:14px; box-shadow:0 12px 24px rgba(15,23,42,0.04); }
    .stat-icon { width:42px; height:42px; border-radius:12px; display:grid; place-items:center; color:#0f172a; background:#f3f4f6; }
    .stat-label { font-size:0.75rem; text-transform:uppercase; letter-spacing:0.08em; color:#6b7280; font-weight:700; }
    .stat-value { font-size:1.4rem; font-weight:800; color:#0f172a; line-height:1.1; }
    .stat-sub { color:#6b7280; font-size:0.9rem; }

    .dashboard-grid { display:grid; grid-template-columns:1fr; gap:1rem; }
    @media (min-width:1024px) { .dashboard-grid { grid-template-columns: 1fr 1.4fr; } }
    .card { background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:1.35rem; box-shadow:0 18px 35px rgba(15,23,42,0.06); }
    .card-header { display:flex; align-items:center; gap:0.7rem; margin-bottom:1rem; }
    .card-icon { width:40px; height:40px; border-radius:10px; display:grid; place-items:center; background:#f3f4f6; color:#0f172a; }
    .card-title { font-size:1.1rem; font-weight:800; color:#0f172a; }
    .card-kicker { font-size:0.85rem; color:#6b7280; }

    .profile-grid { display:grid; grid-template-columns:1fr; gap:0.75rem; }
    .info-block { display:flex; gap:0.75rem; align-items:center; padding:0.85rem 0.95rem; border:1px solid #e5e7eb; border-radius:12px; background:#f9fafb; }
    .soft-icon { width:40px; height:40px; border-radius:10px; display:grid; place-items:center; background:#e5e7eb; color:#0f172a; }
    .info-label { font-size:0.85rem; color:#6b7280; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; }
    .info-value { font-size:1rem; font-weight:700; color:#0f172a; }
    .id-chip { display:inline-block; margin-top:0.5rem; padding:0.4rem 0.75rem; border-radius:999px; background:#eef2ff; color:#312e81; font-weight:700; font-size:0.85rem; }

    .list-controls { display:flex; flex-wrap:wrap; gap:0.75rem; align-items:center; margin-bottom:1rem; }
    .search { position:relative; flex:1 1 240px; }
    .search input { width:100%; padding:0.7rem 0.9rem 0.7rem 2.4rem; border:1px solid #e5e7eb; border-radius:12px; background:#f9fafb; font-weight:600; color:#0f172a; }
    .search svg { position:absolute; top:50%; left:0.9rem; transform:translateY(-50%); width:16px; height:16px; color:#9ca3af; }
    .page-indicator { color:#6b7280; font-weight:600; font-size:0.95rem; }
    .pager { display:flex; gap:0.4rem; align-items:center; }
    .pager button { border:1px solid #e5e7eb; background:#fff; border-radius:10px; padding:0.5rem 0.8rem; font-weight:700; color:#0f172a; }
    .pager button:disabled { opacity:0.4; cursor:not-allowed; }

    #autos-list > .autos-item { margin-bottom:0.85rem; }
    .auto-card { border:1px solid #e5e7eb; border-radius:14px; padding:1rem; background:#fdfdfd; transition:box-shadow 150ms ease, transform 150ms ease; }
    .auto-card:hover { box-shadow:0 16px 32px rgba(15,23,42,0.07); transform:translateY(-2px); }
    .auto-header { display:flex; gap:0.85rem; justify-content:space-between; }
    .auto-main { display:flex; gap:0.75rem; align-items:flex-start; }
    .car-chip { width:36px; height:36px; border-radius:10px; display:grid; place-items:center; background:#e5e7eb; color:#0f172a; }
    .auto-name { font-size:1.05rem; font-weight:800; color:#0f172a; }
    .auto-meta { display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.15rem; }
    .auto-badge { background:#eef2ff; color:#312e81; border-radius:999px; padding:0.35rem 0.65rem; font-weight:700; font-size:0.85rem; display:inline-flex; gap:0.3rem; align-items:center; }
    .btn-del { border:1px solid #fee2e2; background:#fff5f5; color:#b91c1c; border-radius:10px; padding:0.45rem 0.6rem; }
    .fields { display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:0.65rem; margin-top:0.85rem; }
    .field-tile { border:1px solid #e5e7eb; border-radius:10px; padding:0.7rem 0.85rem; background:#f9fafb; }
    .field-label { color:#6b7280; font-weight:700; font-size:0.85rem; }
    .field-value { color:#0f172a; font-weight:800; font-size:0.98rem; }
    .vin { margin-top:0.75rem; padding:0.75rem 0.85rem; border-radius:10px; background:#eef2ff; color:#1f2937; font-family:monospace; font-size:0.9rem; word-break:break-all; }

    .cita-card { border:1px solid #e5e7eb; border-radius:14px; padding:1rem; background:#fdfdfd; }
    .cita-heading { display:flex; justify-content:space-between; gap:1rem; align-items:flex-start; }
    .cita-card .card-icon, .cita-card .card-icon svg { width:32px; height:32px; }
    .cita-card svg { width:20px; height:20px; }
    .badge { display:inline-block; padding:0.25rem 0.75rem; border-radius:9999px; font-size:0.75rem; font-weight:700; letter-spacing:0.02em; }
    .badge-pending { background-color:#FEF3C7; color:#92400E; }
    .badge-confirmed { background-color:#DBEAFE; color:#1E40AF; }
    .badge-completed { background-color:#D1FAE5; color:#065F46; }
    .badge-cancelled { background-color:#FEE2E2; color:#991B1B; }

    #auto-modal { 
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 1000;
    }
    #auto-modal .modal-card { 
      background: #fff; 
      border: 1px solid #e5e7eb; 
      border-radius: 16px; 
      padding: 1.5rem; 
      box-shadow: 0 30px 70px rgba(15,23,42,0.25);
      max-height: 90vh;
      overflow-y: auto;
      width: 100%;
      max-width: 600px;
    }
    #auto-modal h3 { font-size:1.35rem; font-weight:800; margin-bottom:0.75rem; }
    #auto-modal form input, #auto-modal form select { border:1px solid #e5e7eb; }

    .car-chip svg, .small-auto-icon svg { width:1rem; height:1rem; }
    .tiny-icon svg { width:0.75rem; height:0.75rem; }
  </style>

  <section class="page-shell">
    <div class="page-head">
      <div>
        <p class="headline">Panel</p>
        <h1 class="title">Mi cuenta</h1>
        <p class="sub">Vista limpia y compacta de tus datos, autos y citas. Busca o pagina tus vehículos sin perder el estilo.</p>
      </div>
      <div class="head-actions">
        <a href="agendar-cita.html" class="btn-ghost">Agendar cita</a>
        <button id="btn-add-auto-top" class="btn-primary">Registrar auto</button>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <div>
          <p class="stat-label">Autos</p>
          <p id="stat-autos-value" class="stat-value">--</p>
          <p id="stat-autos-sub" class="stat-sub">Estado del garaje</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p class="stat-label">Citas</p>
          <p id="stat-citas-value" class="stat-value">--</p>
          <p id="stat-citas-sub" class="stat-sub">Servicios recientes</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 11-4 0 2 2 0 014 0zM12 14a5 5 0 00-5 5h10a5 5 0 00-5-5z" />
          </svg>
        </div>
        <div>
          <p class="stat-label">Pr&oacute;xima</p>
          <p id="stat-next-value" class="stat-value">--</p>
          <p id="stat-next-sub" class="stat-sub">A&uacute;n sin programar</p>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p class="card-kicker">Perfil</p>
            <h2 class="card-title">Datos del cliente</h2>
          </div>
        </div>
        <div id="profile" class="profile-grid"></div>
      </div>

      <div class="card">
        <div class="card-header" style="align-items:flex-start;">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div style="flex:1">
            <p class="card-kicker">Garaje</p>
            <h2 class="card-title">Autom&oacute;viles</h2>
          </div>
          <button id="btn-add-auto" class="btn-primary" style="padding:0.5rem 0.8rem;">+ Nuevo</button>
        </div>

        <div class="list-controls">
          <div class="search">
            <input id="autos-search" type="search" placeholder="Buscar por marca, modelo o placas" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 5a6 6 0 100 12 6 6 0 000-12z" />
            </svg>
          </div>
          <div class="pager">
            <span id="autos-page-info" class="page-indicator">Página 1</span>
            <button id="autos-prev">←</button>
            <button id="autos-next">→</button>
          </div>
        </div>

        <div id="autos-list"></div>
      </div>

      <div class="card" style="grid-column:1 / -1;">
        <div class="card-header">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="card-kicker">Agenda</p>
            <h2 class="card-title">Citas</h2>
          </div>
        </div>
        <div id="citas-list" class="space-y-4"></div>
      </div>
    </div>
  </section>

  <div id="auto-modal" class="fixed inset-0 hidden items-center justify-center z-50">
    <div class="modal-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h3>Agregar autom&oacute;vil</h3>
        <button id="auto-cancel" class="btn-ghost" type="button">Cerrar</button>
      </div>
      
      <form id="auto-form" class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Marca *</label>
            <select name="marca" required class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none">
              <option value="">Selecciona marca</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
              <option value="Chevrolet">Chevrolet</option>
              <option value="Nissan">Nissan</option>
              <option value="Volkswagen">Volkswagen</option>
              <option value="Mazda">Mazda</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Audi">Audi</option>
              <option value="Hyundai">Hyundai</option>
              <option value="Kia">Kia</option>
              <option value="Otra">Otra</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Modelo *</label>
            <input name="modelo" placeholder="Ej. Corolla, Civic, etc." class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" required />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">A&ntilde;o *</label>
            <input name="anio" type="number" placeholder="2020" min="1950" max="2025" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" required />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Color</label>
            <input name="color" placeholder="Color del veh&iacute;culo" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Placas *</label>
            <input name="placas" placeholder="XXX-123" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" required />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">N&uacute;mero de serie *</label>
            <input name="numero_serie" placeholder="VIN del veh&iacute;culo" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" required />
          </div>
        </div>
        
        <div class="flex justify-end gap-3 pt-4">
          <button type="button" id="auto-cancel-footer" class="btn-ghost">Cancelar</button>
          <button type="submit" id="auto-save" class="btn-primary">Guardar autom&oacute;vil</button>
        </div>
      </form>
    </div>
  </div>
`;

class AccountDashboard extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.autosData = [];
    this.pageSize = 3;
    this.currentPage = 1;
  }

  async connectedCallback() {
    console.debug('[account-dashboard] connectedCallback starting');
    await this.render();
    this.profileEl = this.root.querySelector('#profile');
    this.autosList = this.root.querySelector('#autos-list');
    this.citasList = this.root.querySelector('#citas-list');
    this.modal = this.root.querySelector('#auto-modal');
    this.form = this.root.querySelector('#auto-form');
    this.btnAdd = this.root.querySelector('#btn-add-auto');
    this.btnAddTop = this.root.querySelector('#btn-add-auto-top');
    this.btnCancel = this.root.querySelector('#auto-cancel');
    this.btnCancelFooter = this.root.querySelector('#auto-cancel-footer');
    this.searchInput = this.root.querySelector('#autos-search');
    this.pageInfo = this.root.querySelector('#autos-page-info');
    this.btnPrev = this.root.querySelector('#autos-prev');
    this.btnNext = this.root.querySelector('#autos-next');
    this.statAutosValue = this.root.querySelector('#stat-autos-value');
    this.statAutosSub = this.root.querySelector('#stat-autos-sub');
    this.statCitasValue = this.root.querySelector('#stat-citas-value');
    this.statCitasSub = this.root.querySelector('#stat-citas-sub');
    this.statNextValue = this.root.querySelector('#stat-next-value');
    this.statNextSub = this.root.querySelector('#stat-next-sub');

    // IMPORTANTE: Verificar que el modal esté oculto por defecto
    if (this.modal) {
      this.modal.classList.add('hidden');
      this.modal.style.display = 'none';
      console.debug('[account-dashboard] Modal explicitly set to hidden');
    }

    this.registerEvents();
    this.loadData();
    
    // Manejar hash URL para navegar a secciones específicas
    this.handleUrlHash();
    console.debug('[account-dashboard] connectedCallback completed');
  }

  handleUrlHash() {
    try {
      const hash = window.location.hash;
      console.debug('[account-dashboard] Handling URL hash:', hash);
      
      if (hash === '#autos') {
        // SOLO scrollear a la sección de autos, NUNCA abrir el modal
        const autosSection = this.root.querySelector('.card:nth-of-type(2)');
        if (autosSection) {
          setTimeout(() => {
            autosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.debug('[account-dashboard] Scrolled to autos section');
          }, 500);
        }
      }
      
      // IMPORTANTE: No hay código aquí que deba abrir modales automáticamente
      // Solo navegación por hash URL
      
    } catch (e) {
      console.warn('[account-dashboard] Error handling URL hash:', e);
    }
  }

  async render() {
    this.root.innerHTML = '';
    const tw = await this._loadTailwindCss();
    const styleEl = document.createElement('style');
    styleEl.textContent = tw;
    this.root.appendChild(styleEl);
    this.root.appendChild(template.content.cloneNode(true));
  }

  async _loadTailwindCss() {
    if (this.constructor._tailwindCss) return this.constructor._tailwindCss;
    try {
      const res = await fetch('/assets/css/tailwind.css');
      if (!res.ok) throw new Error('tailwind.css not found');
      const txt = await res.text();
      this.constructor._tailwindCss = txt;
      return txt;
    } catch (e) {
      console.warn('[account-dashboard] Could not load compiled tailwind.css:', e);
      this.constructor._tailwindCss = '';
      return '';
    }
  }

  registerEvents() {
    // Solo agregar event listeners a los botones específicos de agregar
    [this.btnAdd, this.btnAddTop].forEach((btn) => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          console.debug('[account-dashboard] Add auto button clicked explicitly');
          this.showModal();
        });
      }
    });
    [this.btnCancel, this.btnCancelFooter].forEach((btn) => {
      if (btn) btn.addEventListener('click', () => this.hideModal());
    });
    if (this.form) this.form.addEventListener('submit', (e) => this.handleSaveAuto(e));
    if (this.modal) this.modal.addEventListener('click', (ev) => { if (ev.target === this.modal) this.hideModal(); });
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => { this.currentPage = 1; this.renderAutosList(); });
    }
    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', () => { this.currentPage = Math.max(1, this.currentPage - 1); this.renderAutosList(); });
    }
    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => { this.currentPage = this.currentPage + 1; this.renderAutosList(true); });
    }
  }

  getClient() {
    return (typeof window !== 'undefined' && window.apiClient) ? window.apiClient : apiClient;
  }

  handleAuthError(e, targetEl) {
    const status = e && e.status;
    if (status === 401 || status === 403) {
      if (targetEl) targetEl.innerHTML = '<p class="text-sm text-red-600">Debes iniciar sesión para ver esta sección. <a href="#" id="open-login" class="underline">Iniciar sesión</a></p>';
      try { window.dispatchEvent(new Event('open-auth')); } catch (err) {}
      setTimeout(() => {
        const link = (this.root && this.root.querySelector('#open-login'));
        if (link) link.addEventListener('click', (ev) => { ev.preventDefault(); window.dispatchEvent(new Event('open-auth')); });
      }, 50);
      return true;
    }
    return false;
  }

  async loadData() {
    await Promise.all([this.loadProfile(), this.loadAutos(), this.loadCitas()]);
  }

  async loadProfile() {
    try {
      const client = this.getClient();
      const res = await client.get('/clientes/me');
      const profile = res?.data || res;
      this.currentProfile = profile;
      
      this.profileEl.innerHTML = `
        <div class="profile-grid">
          <div class="info-block">
            <div class="soft-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p class="info-label">Nombre completo</p>
              <p class="info-value">${profile.nombre || 'Sin nombre'}</p>
            </div>
            <button id="edit-nombre" class="text-blue-600 hover:text-blue-800 text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
          </div>
          <div class="info-block">
            <div class="soft-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14v7" />
              </svg>
            </div>
            <div>
              <p class="info-label">Correo electr&oacute;nico</p>
              <p class="info-value">${profile.email || 'Agrega tu correo'}</p>
            </div>
            <button id="edit-email" class="text-blue-600 hover:text-blue-800 text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
          </div>
          <div class="info-block">
            <div class="soft-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5h2l3 7-1.35 2.7a1 1 0 00.9 1.45H17" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11a1 1 0 100-2 1 1 0 000 2zM7 20a1 1 0 110-2 1 1 0 010 2zM15 20a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </div>
            <div>
              <p class="info-label">Tel&eacute;fono</p>
              <p class="info-value">${profile.telefono || 'Agrega tu tel&eacute;fono'}</p>
            </div>
            <button id="edit-telefono" class="text-blue-600 hover:text-blue-800 text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
          </div>
          <div class="info-block">
            <div class="soft-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p class="info-label">Direcci&oacute;n</p>
              <p class="info-value">${profile.direccion || 'Comparte una direcci&oacute;n para recordatorios'}</p>
            </div>
            <button id="edit-direccion" class="text-blue-600 hover:text-blue-800 text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex justify-between items-center mt-4">
          <span class="id-chip">ID cliente: ${profile.id_cliente || '---'}</span>
          <button id="edit-profile-btn" class="btn-primary text-sm px-4 py-2">Editar Perfil Completo</button>
        </div>
      `;
      
      this.setupProfileEditListeners();
      
    } catch (e) {
      if (!this.handleAuthError(e, this.profileEl)) {
        this.profileEl.innerHTML = `
          <div class="text-center py-6">
            <p class="text-gray-600 font-medium mb-2">No autenticado</p>
            <p class="text-sm text-gray-500">Inicia sesión para ver tu perfil</p>
          </div>
        `;
      }
    }
  }

  async loadAutos() {
    try {
      const client = this.getClient();
      const res = await client.get('/automoviles/mine');
      const autos = (res?.data || res || []).slice().sort((a, b) => {
        const aId = Number(a.id_auto || a.id || 0);
        const bId = Number(b.id_auto || b.id || 0);
        return bId - aId;
      });
      this.autosData = autos;
      if (this.statAutosValue) this.statAutosValue.textContent = autos.length || 0;
      if (this.statAutosSub) this.statAutosSub.textContent = autos.length ? 'Vehículos listos para tus servicios' : 'Registra tu primer auto para agendar';
      this.currentPage = 1;
      this.renderAutosList();
    } catch (e) {
      if (!this.handleAuthError(e, this.autosList)) {
        this.autosList.innerHTML = '<p class="text-sm text-red-600">Error cargando automóviles.</p>';
      }
    }
  }

  renderAutosList(force = false) {
    const autos = this.autosData || [];
    const query = (this.searchInput?.value || '').trim().toLowerCase();
    const filtered = query
      ? autos.filter((a) => {
          const parts = [a.marca, a.modelo, a.placas, a.color].filter(Boolean).map((x) => String(x).toLowerCase());
          return parts.some((p) => p.includes(query));
        })
      : autos;

    const totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    if (force && this.currentPage > totalPages) this.currentPage = totalPages;

    const start = (this.currentPage - 1) * this.pageSize;
    const pageItems = filtered.slice(start, start + this.pageSize);

    if (this.pageInfo) {
      this.pageInfo.textContent = filtered.length ? `Página ${this.currentPage} de ${totalPages}` : 'Sin resultados';
    }
    if (this.btnPrev) this.btnPrev.disabled = this.currentPage <= 1 || !filtered.length;
    if (this.btnNext) this.btnNext.disabled = this.currentPage >= totalPages || !filtered.length;

    if (!filtered.length) {
      this.autosList.innerHTML = `
        <div class="text-center py-10 px-4 bg-white border border-dashed border-gray-200 rounded-2xl">
          <p class="text-gray-800 font-bold mb-2">No hay autos que coincidan</p>
          <p class="text-sm text-gray-600">Ajusta tu búsqueda o agrega un nuevo vehículo.</p>
        </div>
      `;
      return;
    }

    this.autosList.innerHTML = '';
    pageItems.forEach((a) => {
      const el = document.createElement('div');
      el.className = 'autos-item auto-card';
      el.innerHTML = `
        <div class="auto-header">
          <div class="auto-main">
            <div class="car-chip">
              <svg xmlns="http://www.w3.org/2000/svg" class="car-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p class="auto-name">${a.marca} ${a.modelo}</p>
              <div class="auto-meta">
                <span class="auto-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" class="tiny-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  ${a.anio || 'Sin año'}
                </span>
                ${a.color ? `<span class="auto-badge bg-gray-100 text-gray-800">${a.color}</span>` : ''}
              </div>
            </div>
          </div>
          <button data-id="${a.id_auto}" class="btn-del">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div class="fields">
          <div class="field-tile">
            <p class="field-label">Placas</p>
            <p class="field-value">${a.placas}</p>
          </div>
          <div class="field-tile">
            <p class="field-label">Color</p>
            <p class="field-value">${a.color || 'No especificado'}</p>
          </div>
        </div>

        <div class="vin">VIN: ${a.numero_serie}</div>
      `;
      this.autosList.appendChild(el);
    });

    this.autosList.querySelectorAll('.btn-del').forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleDeleteAuto(e));
    });
  }

  async loadCitas() {
    try {
      const client = this.getClient();
      const res = await client.get('/citas/mine');
      const citas = res?.data || res || [];
      const count = citas.length || 0;
      if (this.statCitasValue) this.statCitasValue.textContent = count;
      if (this.statCitasSub) this.statCitasSub.textContent = count ? 'Últimos servicios y citas activas' : 'Agenda tu primera visita al taller';

      let nextText = 'Sin próxima cita';
      let nextSub = 'Programa una fecha';
      if (count) {
        const now = Date.now();
        const upcoming = [...citas]
          .map((c) => ({ ...c, _start: new Date(c.inicio) }))
          .filter((c) => c._start && !Number.isNaN(c._start.getTime()))
          .sort((a, b) => a._start - b._start)
          .find((c) => c._start.getTime() >= now);
        if (upcoming) {
          const dateStr = upcoming._start.toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: 'numeric' });
          const timeStr = upcoming._start.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
          nextText = `${dateStr} ${timeStr}`;
          nextSub = upcoming.motivo || 'Servicio agendado';
        }
      }
      if (this.statNextValue) this.statNextValue.textContent = nextText;
      if (this.statNextSub) this.statNextSub.textContent = nextSub;
      if (!citas.length) {
        this.citasList.innerHTML = `
          <div class="text-center py-12 px-6 bg-white border border-dashed border-gray-200 rounded-2xl">
            <p class="text-gray-800 font-bold mb-2">A&uacute;n no tienes citas</p>
            <p class="text-sm text-gray-600">Agenda tu primera visita para mantener tu auto impecable</p>
          </div>
        `;
        return;
      }
      this.citasList.innerHTML = '';
      citas.forEach((c) => {
        const el = document.createElement('div');
        el.className = 'cita-card';

        const estadoNorm = (c.estado || 'PENDIENTE').toUpperCase();
        let badgeClass = 'badge badge-pending';
        if (estadoNorm === 'CONFIRMADA' || estadoNorm === 'CONFIRMED') badgeClass = 'badge badge-confirmed';
        else if (estadoNorm === 'COMPLETADA' || estadoNorm === 'COMPLETED') badgeClass = 'badge badge-completed';
        else if (estadoNorm === 'CANCELADA' || estadoNorm === 'CANCELLED') badgeClass = 'badge badge-cancelled';

        const fechaInicio = new Date(c.inicio);
        const fechaFin = new Date(c.fin);
        const fechaStr = fechaInicio.toLocaleDateString('es-MX', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const horaInicioStr = fechaInicio.toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit'
        });
        const horaFinStr = fechaFin.toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit'
        });

        el.innerHTML = `
          <div class="cita-heading mb-4">
            <div class="flex items-center gap-3">
              <div class="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">ID: ${c.id_cita}</p>
                <h3 class="text-lg font-black text-gray-900">${c.motivo || 'Servicio'}</h3>
              </div>
            </div>
            <span class="${badgeClass}">${estadoNorm}</span>
          </div>
          
          <div class="fields">
            <div class="field-tile">
              <p class="field-label">Fecha</p>
              <p class="field-value capitalize">${fechaStr}</p>
            </div>
            <div class="field-tile">
              <p class="field-label">Horario</p>
              <p class="field-value">${horaInicioStr} - ${horaFinStr}</p>
            </div>
          </div>
          
          ${c.observaciones ? `
          <div class="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p class="text-sm text-blue-700 font-semibold mb-1">Observaciones</p>
            <p class="text-base text-gray-700">${c.observaciones}</p>
          </div>
          ` : ''}
          
          ${c.automovil ? `
          <div class="mt-4 flex items-center text-base text-gray-700 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="small-auto-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span>${c.automovil.marca} ${c.automovil.modelo} (${c.automovil.placas})</span>
          </div>
          ` : c.id_auto ? `
          <div class="mt-4 flex items-center text-base text-gray-700 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span>Auto ID: ${c.id_auto}</span>
          </div>
          ` : ''}
        `;
        this.citasList.appendChild(el);
      });
    } catch (e) {
      if (!this.handleAuthError(e, this.citasList)) {
        this.citasList.innerHTML = '<p class="text-sm text-red-600">Error cargando citas.</p>';
      }
    }
  }

  showModal() {
    console.debug('[account-dashboard] showModal called explicitly by user action');
    this.modal.classList.remove('hidden');
    this.modal.style.display = 'flex';
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  hideModal() {
    this.modal.classList.add('hidden');
    this.modal.style.display = 'none';
    this.form.reset();
    // Restore body scrolling
    document.body.style.overflow = '';
  }

  setupProfileEditListeners() {
    // Event listeners para botones de edición individual
    ['nombre', 'email', 'telefono', 'direccion'].forEach(field => {
      const btn = this.profileEl.querySelector(`#edit-${field}`);
      if (btn) {
        btn.addEventListener('click', () => this.showFieldEditModal(field));
      }
    });
    
    // Event listener para edición completa del perfil
    const editBtn = this.profileEl.querySelector('#edit-profile-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => this.showProfileEditModal());
    }
  }

  showFieldEditModal(field) {
    const fieldLabels = {
      nombre: 'Nombre completo',
      email: 'Correo electrónico', 
      telefono: 'Teléfono',
      direccion: 'Dirección'
    };
    
    const fieldTypes = {
      nombre: 'text',
      email: 'email',
      telefono: 'tel', 
      direccion: 'text'
    };
    
    const currentValue = this.currentProfile[field] || '';
    
    this.showCustomModal(
      `Editar ${fieldLabels[field]}`,
      `
        <form id="edit-field-form" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">${fieldLabels[field]}</label>
            <input 
              type="${fieldTypes[field]}" 
              name="${field}" 
              value="${currentValue}"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              ${field === 'nombre' || field === 'email' ? 'required' : ''}
            />
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" id="cancel-field-edit" class="btn-ghost">Cancelar</button>
            <button type="submit" id="save-field-edit" class="btn-primary">Guardar</button>
          </div>
        </form>
      `,
      (modal) => {
        const form = modal.querySelector('#edit-field-form');
        const cancelBtn = modal.querySelector('#cancel-field-edit');
        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => this.hideCustomModal());
        }
        if (form) {
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
              const formData = new FormData(form);
              const value = formData.get(field);
              await this.updateProfileField(field, value);
            } catch (err) {
              console.error('[account-dashboard] Error submitting field edit form', err);
            }
          });
        }
      }
    );
  }

  showProfileEditModal() {
    const profile = this.currentProfile;
    this.showCustomModal(
      'Editar Perfil Completo',
      `
        <form id="edit-profile-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre completo *</label>
              <input type="text" name="nombre" value="${profile.nombre || ''}" required
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input type="email" name="email" value="${profile.email || ''}" required
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
              <input type="tel" name="telefono" value="${profile.telefono || ''}"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
              <input type="text" name="direccion" value="${profile.direccion || ''}"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" id="cancel-profile-edit" class="btn-ghost">Cancelar</button>
            <button type="submit" id="save-profile-edit" class="btn-primary">Guardar Cambios</button>
          </div>
        </form>
      `,
      (modal) => {
        const form = modal.querySelector('#edit-profile-form');
        const cancelBtn = modal.querySelector('#cancel-profile-edit');
        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => this.hideCustomModal());
        }
        if (form) {
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
              const formData = new FormData(form);
              const data = Object.fromEntries(formData.entries());
              await this.updateProfileComplete(data);
            } catch (err) {
              console.error('[account-dashboard] Error submitting profile edit form', err);
            }
          });
        }
      }
    );
  }

  async updateProfileField(field, value) {
    try {
      const client = this.getClient();
      const updateData = { [field]: value };
      
      await client.put(`/clientes/${this.currentProfile.id_cliente}`, updateData);
      
      // Actualizar perfil local
      this.currentProfile[field] = value;
      
      // Recargar vista del perfil
      await this.loadProfile();
      
      this.hideCustomModal();
      
      // Mostrar mensaje de éxito
      this.showSuccessMessage(`${field} actualizado correctamente`);
      
    } catch (error) {
      console.error('Error updating profile field:', error);
      this.showErrorMessage(`Error al actualizar ${field}: ` + (error.message || 'Error desconocido'));
    }
  }

  async updateProfileComplete(data) {
    try {
      const client = this.getClient();
      
      await client.put(`/clientes/${this.currentProfile.id_cliente}`, data);
      
      // Actualizar perfil local
      Object.assign(this.currentProfile, data);
      
      // Recargar vista del perfil
      await this.loadProfile();
      
      this.hideCustomModal();
      
      // Mostrar mensaje de éxito
      this.showSuccessMessage('Perfil actualizado correctamente');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      this.showErrorMessage('Error al actualizar perfil: ' + (error.message || 'Error desconocido'));
    }
  }

  showCustomModal(title, content, setupFn) {
    // Crear modal personalizado para edición
    let customModal = this.root.querySelector('#profile-edit-modal');
    if (!customModal) {
      customModal = document.createElement('div');
      customModal.id = 'profile-edit-modal';
      customModal.className = 'fixed inset-0 hidden items-center justify-center z-50';
      customModal.style.background = 'rgba(0,0,0,0.55)';
      this.root.appendChild(customModal);
    }
    
    customModal.innerHTML = `
      <div class="modal-card w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">${title}</h3>
          <button id="close-custom-modal" class="btn-ghost" type="button">×</button>
        </div>
        ${content}
      </div>
    `;
    
    customModal.classList.remove('hidden');
    customModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Setup event listeners (guard against missing elements)
    try {
      const closeBtn = customModal.querySelector('#close-custom-modal');
      if (closeBtn) closeBtn.addEventListener('click', () => this.hideCustomModal());

      customModal.addEventListener('click', (e) => {
        if (e.target === customModal) this.hideCustomModal();
      });

      if (typeof setupFn === 'function') {
        try { setupFn(customModal); } catch (err) { console.warn('[account-dashboard] setupFn error', err); }
      }
    } catch (err) {
      console.warn('[account-dashboard] Error setting up custom modal listeners:', err);
    }
  }

  hideCustomModal() {
    const customModal = this.root.querySelector('#profile-edit-modal');
    if (customModal) {
      customModal.classList.add('hidden');
      customModal.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  showSuccessMessage(message) {
    this.showNotification(message, 'success');
  }

  showErrorMessage(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
    }`;
    notification.textContent = message;
    
    this.root.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  async handleSaveAuto(e) {
    e.preventDefault();
    const fd = new FormData(this.form);
    const body = Object.fromEntries(fd.entries());
    try {
      const client = this.getClient();
      const res = await client.post('/automoviles', body);
      const newAuto = (res?.data || res);
      this.hideModal();
      await this.loadAutos();
      if (this.autosList) {
        try { this.autosList.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (err) {}
      }
      try { window.dispatchEvent(new CustomEvent('auto-saved', { detail: newAuto })); } catch (evErr) {}
    } catch (err) {
      if (!this.handleAuthError(err, this.autosList)) {
        alert('Error guardando automovil: ' + (err.message || JSON.stringify(err.body) || err));
      }
    }
  }

  async handleDeleteAuto(e) {
    const id = e.currentTarget.getAttribute('data-id');
    if (!confirm('Eliminar este automóvil?')) return;
    try {
      const client = this.getClient();
      await client.delete(`/automoviles/${id}`);
      await this.loadAutos();
    } catch (err) {
      if (!this.handleAuthError(err, this.autosList)) {
        alert('Error eliminando automovil: ' + (err.message || JSON.stringify(err.body) || err));
      }
    }
  }

}

customElements.define('account-dashboard', AccountDashboard);
export default AccountDashboard;

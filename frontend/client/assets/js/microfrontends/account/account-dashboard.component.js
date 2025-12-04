import apiClient from '../../services/api-client.js';
import { injectStyles } from '../../utils/shadow-style-loader.js';

// Import sub-components
import './components/profile-card/index.js';
import './components/autos-list/index.js';
import './components/appointments-list/index.js';
import './components/auto-form-modal/index.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    * { box-sizing: border-box; }
    :host { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display:block; color:#1e293b; background:transparent; font-size:14px; }

    .page-shell { background:#ffffff; padding:1.5rem; border-radius:12px; border:1px solid #e2e8f0; box-shadow:0 1px 2px rgba(0,0,0,0.02); max-width:1400px; margin:0 auto; }
    .page-head { display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem; padding-bottom:0.75rem; border-bottom:1px solid #e2e8f0; }
    @media (min-width:768px) { .page-head { flex-direction:row; justify-content:space-between; align-items:center; } }
    .headline { font-size:0.7rem; letter-spacing:0.12em; text-transform:uppercase; color:#94a3b8; font-weight:600; }
    .title { font-size:1.5rem; font-weight:700; color:#0f172a; line-height:1.3; margin:0; }
    .sub { color:#64748b; max-width:760px; font-weight:400; font-size:0.875rem; }
    .head-actions { display:flex; flex-wrap:wrap; gap:0.6rem; align-items:center; }

    .tabs { display:flex; gap:0.5rem; margin-top:0.75rem; border-bottom:1px solid #e2e8f0; }
    .tab { background:transparent; border:none; padding:0.5rem 0.75rem; border-radius:6px 6px 0 0; font-weight:500; font-size:0.8125rem; color:#64748b; cursor:pointer; position:relative; transition: all 150ms ease; }
    .tab:hover { color:#0f172a; background:#f8fafc; }
    .tab[aria-selected="true"] { color:#0f172a; background:#fff; border:1px solid #e2e8f0; border-bottom-color:#fff; margin-bottom:-1px; font-weight:600; }
    .tab-badge { display:inline-flex; align-items:center; justify-content:center; margin-left:0.35rem; min-width:1.25rem; height:1.25rem; padding:0 0.3rem; border-radius:4px; background:#f1f5f9; color:#475569; font-size:0.7rem; font-weight:600; }
    .tab[aria-selected="true"] .tab-badge { background:#e0e7ff; color:#4f46e5; }

    .btn-primary { background:#0f172a; color:#ffffff; padding:0.5rem 0.875rem; border-radius:6px; font-weight:600; font-size:0.8125rem; border:none; cursor:pointer; transition: background 150ms ease; }
    .btn-primary:hover { background:#1e293b; }
    .btn-ghost { background:transparent; border:1px solid #cbd5e1; color:#475569; padding:0.4rem 0.75rem; border-radius:6px; font-weight:500; font-size:0.8125rem; cursor:pointer; transition: all 150ms ease; }
    .btn-ghost:hover { border-color:#94a3b8; color:#0f172a; background:#f8fafc; }

    .stat-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; margin-bottom:1rem; }
    .stat-card { position:relative; display:flex; align-items:center; gap:0.75rem; padding:0.875rem; background:#fafafa; border:1px solid #e2e8f0; border-radius:8px; transition:all 150ms ease; }
    .stat-card:hover { background:#fff; border-color:#cbd5e1; }
    .stat-card:nth-child(1) { --stat-accent:#dbeafe; --stat-color:#1e40af; }
    .stat-card:nth-child(2) { --stat-accent:#dcfce7; --stat-color:#15803d; }
    .stat-card:nth-child(3) { --stat-accent:#fef3c7; --stat-color:#b45309; }
    .stat-icon { width:36px; height:36px; border-radius:6px; display:grid; place-items:center; color:var(--stat-color); background:var(--stat-accent); }
    .stat-label { font-size:0.6875rem; text-transform:uppercase; letter-spacing:0.05em; color:#94a3b8; font-weight:600; margin-bottom:0.15rem; }
    .stat-value { font-size:1.25rem; font-weight:700; color:#0f172a; line-height:1; }
    .stat-sub { color:#64748b; font-size:0.75rem; font-weight:400; margin-top:0.15rem; }

    .section-container { opacity:1; transition: opacity 250ms ease; }
    .section-container.hidden { display:none; opacity:0; }
    .card { position:relative; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:1.5rem; box-shadow:0 1px 2px rgba(0,0,0,0.03); margin-bottom:1rem; }
    .card-header { display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem; flex-wrap:wrap; }
    .card-icon { width:36px; height:36px; border-radius:6px; display:grid; place-items:center; background:#f1f5f9; color:#475569; flex-shrink:0; }
    .card-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0; }
    .card-kicker { font-size:0.6875rem; text-transform:uppercase; letter-spacing:0.05em; background:#f1f5f9; color:#64748b; padding:0.15rem 0.5rem; border-radius:4px; font-weight:600; }
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

      <div class="tabs" role="tablist" aria-label="Dashboard tabs">
        <button role="tab" class="tab" data-tab="general" aria-selected="true">
          General
        </button>
        <button role="tab" class="tab" data-tab="perfil" aria-selected="false">
          Perfil
        </button>
        <button role="tab" class="tab" data-tab="autos" aria-selected="false">
          Autos<span class="tab-badge" id="tab-autos-count">0</span>
        </button>
        <button role="tab" class="tab" data-tab="citas" aria-selected="false">
          Citas<span class="tab-badge" id="tab-citas-count">0</span>
        </button>
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
          <p class="stat-label">Próxima</p>
          <p id="stat-next-value" class="stat-value">--</p>
          <p id="stat-next-sub" class="stat-sub">Aún sin programar</p>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- GENERAL SECTION -->
      <div class="section-container" id="general-section">
        <div style="display:grid;grid-template-columns:1fr;gap:1.25rem;">
          
          <!-- Profile Summary -->
          <div class="card">
            <div class="card-header">
              <div style="display:flex;align-items:center;gap:0.8rem;">
                <div class="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p class="card-kicker">Tu Perfil</p>
                  <h2 class="card-title">Información Personal</h2>
                </div>
              </div>
              <button class="btn-ghost" style="padding:0.4rem 0.8rem;font-size:0.85rem;" data-goto="perfil">Ver detalles →</button>
            </div>
            <profile-card id="general-profile"></profile-card>
          </div>

          <!-- Autos Summary -->
          <div class="card">
            <div class="card-header">
              <div style="display:flex;align-items:center;gap:0.8rem;">
                <div class="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div>
                  <p class="card-kicker">Garaje</p>
                  <h2 class="card-title">Mis Vehículos</h2>
                </div>
              </div>
              <div style="display:flex;gap:0.5rem;">
                <button class="btn-ghost" style="padding:0.4rem 0.8rem;font-size:0.85rem;" data-goto="autos">Ver todos →</button>
                <button id="btn-add-auto-general" class="btn-primary" style="padding:0.4rem 0.8rem;font-size:0.85rem;">+ Nuevo</button>
              </div>
            </div>
            <autos-list id="general-autos"></autos-list>
          </div>

          <!-- Appointments Summary -->
          <div class="card">
            <div class="card-header">
              <div style="display:flex;align-items:center;gap:0.8rem;">
                <div class="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="card-kicker">Agenda</p>
                  <h2 class="card-title">Citas y Servicios</h2>
                </div>
              </div>
              <button class="btn-ghost" style="padding:0.4rem 0.8rem;font-size:0.85rem;" data-goto="citas">Ver todas →</button>
            </div>
            <appointments-list id="general-citas"></appointments-list>
          </div>

        </div>
      </div>

      <!-- PERFIL SECTION -->
      <div class="section-container hidden" id="perfil-section">
        <div class="card">
          <div class="card-header" style="justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:0.75rem;">
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
          </div>
          <profile-card id="profile-full"></profile-card>
        </div>
      </div>

      <!-- AUTOS SECTION -->
      <div class="section-container hidden" id="autos-section">
        <div class="card">
          <div class="card-header" style="justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:0.75rem;">
              <div class="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <p class="card-kicker">Garaje</p>
                <h2 class="card-title">Automóviles</h2>
              </div>
            </div>
            <button id="btn-add-auto" class="btn-primary" style="padding:0.5rem 0.8rem;">+ Nuevo</button>
          </div>
          <autos-list id="autos-full"></autos-list>
        </div>
      </div>

      <!-- CITAS SECTION -->
      <div class="section-container hidden" id="citas-section">
        <div class="card">
          <div class="card-header card-header--stacked">
            <div style="display:flex;align-items:center;gap:0.75rem;">
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
          </div>
          <appointments-list id="citas-full"></appointments-list>
        </div>
      </div>
    </div>
  </section>

  <auto-form-modal></auto-form-modal>
`;

class AccountDashboard extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this._autosData = [];
    this._appointmentsData = [];
    this._profileData = null;
  }

  async connectedCallback() {
    await this.render();
    this.setupReferences();
    this.setupEventListeners();
    this.loadData();
    this.handleUrlHash();
  }

  async render() {
    this.root.innerHTML = '';
    await injectStyles(this.root, '');
    this.root.appendChild(template.content.cloneNode(true));
  }

  setupReferences() {
    this.tabButtons = Array.from(this.root.querySelectorAll('.tab'));
    this.modal = this.root.querySelector('auto-form-modal');

    // Profile Cards
    this.profileGeneral = this.root.querySelector('#general-profile');
    this.profileFull = this.root.querySelector('#profile-full');

    // Autos Lists
    this.autosGeneral = this.root.querySelector('#general-autos');
    this.autosFull = this.root.querySelector('#autos-full');

    // Appointments Lists
    this.citasGeneral = this.root.querySelector('#general-citas');
    this.citasFull = this.root.querySelector('#citas-full');

    // Stats
    this.statAutosValue = this.root.querySelector('#stat-autos-value');
    this.statAutosSub = this.root.querySelector('#stat-autos-sub');
    this.statCitasValue = this.root.querySelector('#stat-citas-value');
    this.statCitasSub = this.root.querySelector('#stat-citas-sub');
    this.statNextValue = this.root.querySelector('#stat-next-value');
    this.statNextSub = this.root.querySelector('#stat-next-sub');
  }

  setupEventListeners() {
    // Tabs
    this.tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showTab(btn.getAttribute('data-tab'));
      });
    });

    // Navigation Buttons
    this.root.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showTab(e.currentTarget.dataset.goto);
      });
    });

    // Add Auto Buttons
    const addAutoBtns = this.root.querySelectorAll('#btn-add-auto, #btn-add-auto-top, #btn-add-auto-general');
    addAutoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.modal) this.modal.open = true;
      });
    });

    // Modal Events
    if (this.modal) {
      this.modal.addEventListener('save-auto', (e) => this.handleSaveAuto(e.detail));
      this.modal.addEventListener('close-modal', () => {
        this.modal.open = false;
      });
    }

    // Profile Edit Events (bubbled from profile-card)
    this.root.addEventListener('edit-profile', (e) => {
      console.log('Edit profile requested:', e.detail);
      // Implement edit profile logic here (e.g., open another modal)
      alert('Funcionalidad de editar perfil en desarrollo');
    });

    // Auto Edit/Delete Events
    this.root.addEventListener('edit-auto', (e) => {
      console.log('Edit auto requested:', e.detail);
      alert('Funcionalidad de editar auto en desarrollo');
    });

    this.root.addEventListener('delete-auto', async (e) => {
      const { id } = e.detail;
      try {
        await this.getClient().delete(`/automoviles/${id}`);
        alert('Auto eliminado correctamente');
        await this.loadAutos();
      } catch (error) {
        console.error('Error deleting auto:', error);
        alert('Error al eliminar el auto');
      }
    });

    // Appointment Cancel Event
    this.root.addEventListener('cancel-appointment', async (e) => {
      const { id } = e.detail;
      try {
        await this.getClient().put(`/citas/${id}`, { estado: 'CANCELADA' });
        alert('Cita cancelada correctamente');
        // Recargar citas y actualizar stats
        await this.loadCitas();
        this.updateStats();
      } catch (error) {
        console.error('Error canceling appointment:', error);
        alert('Error al cancelar la cita');
      }
    });
  }

  showTab(tabName) {
    if (!tabName) return;

    this.tabButtons.forEach(b => {
      const isActive = b.getAttribute('data-tab') === tabName;
      b.setAttribute('aria-selected', isActive);
    });

    const sections = [
      { name: 'general', el: this.root.querySelector('#general-section') },
      { name: 'perfil', el: this.root.querySelector('#perfil-section') },
      { name: 'autos', el: this.root.querySelector('#autos-section') },
      { name: 'citas', el: this.root.querySelector('#citas-section') }
    ];

    sections.forEach(({ name, el }) => {
      if (!el) return;
      if (name === tabName) {
        el.classList.remove('hidden');
        requestAnimationFrame(() => { el.style.opacity = '1'; });
      } else {
        el.style.opacity = '0';
        setTimeout(() => { el.classList.add('hidden'); }, 250);
      }
    });

    localStorage.setItem('dashboard.activeTab', tabName);
  }

  handleUrlHash() {
    const hash = window.location.hash.replace('#', '');
    const last = localStorage.getItem('dashboard.activeTab') || 'general';
    this.showTab(hash || last);
  }

  getClient() {
    return (typeof window !== 'undefined' && window.apiClient) ? window.apiClient : apiClient;
  }

  async loadData() {
    try {
      await Promise.all([
        this.loadProfile(),
        this.loadAutos(),
        this.loadCitas()
      ]);
      this.updateStats();
    } catch (e) {
      console.error('[account-dashboard] Error loading data', e);
      this.handleAuthError(e);
    }
  }

  async loadProfile() {
    try {
      const res = await this.getClient().get('/clientes/me');
      this._profileData = res?.data || res;

      const json = JSON.stringify(this._profileData);
      if (this.profileGeneral) this.profileGeneral.setAttribute('profile-data', json);
      if (this.profileFull) this.profileFull.setAttribute('profile-data', json);
    } catch (e) {
      console.warn('Error loading profile', e);
    }
  }

  async loadAutos() {
    try {
      const res = await this.getClient().get('/automoviles/mine');
      const raw = res?.data || res || [];
      this._autosData = Array.isArray(raw) ? raw : [];

      const json = JSON.stringify(this._autosData);
      if (this.autosGeneral) this.autosGeneral.setAttribute('autos-data', json);
      if (this.autosFull) this.autosFull.setAttribute('autos-data', json);

      // Update badge
      const badge = this.root.querySelector('#tab-autos-count');
      if (badge) badge.textContent = this._autosData.length;
    } catch (e) {
      console.warn('Error loading autos', e);
    }
  }

  async loadCitas() {
    try {
      const res = await this.getClient().get('/citas/mine');
      const raw = res?.data || res || [];
      this._appointmentsData = Array.isArray(raw) ? raw : [];

      const json = JSON.stringify(this._appointmentsData);
      if (this.citasGeneral) this.citasGeneral.setAttribute('appointments-data', json);
      if (this.citasFull) this.citasFull.setAttribute('appointments-data', json);

      // Update badge - solo contar citas activas (no canceladas)
      const activeCitas = this._appointmentsData.filter(c => {
        const status = (c.estado || 'PENDIENTE').toUpperCase();
        return status !== 'CANCELADA' && status !== 'CANCELLED';
      });
      const badge = this.root.querySelector('#tab-citas-count');
      if (badge) badge.textContent = activeCitas.length;
    } catch (e) {
      console.warn('Error loading citas', e);
    }
  }

  updateStats() {
    if (this.statAutosValue) this.statAutosValue.textContent = this._autosData.length;
    
    // Contar solo citas activas (no canceladas)
    const activeCitas = this._appointmentsData.filter(c => {
      const status = (c.estado || 'PENDIENTE').toUpperCase();
      return status !== 'CANCELADA' && status !== 'CANCELLED';
    });
    if (this.statCitasValue) this.statCitasValue.textContent = activeCitas.length;

    // Next appointment logic - usar 'inicio' en lugar de 'fecha'
    const pending = this._appointmentsData
      .filter(c => ['PENDIENTE', 'CONFIRMADA'].includes((c.estado || '').toUpperCase()))
      .filter(c => c.inicio) // Filtrar solo citas con fecha
      .sort((a, b) => new Date(a.inicio) - new Date(b.inicio));

    if (pending.length > 0 && this.statNextValue) {
      const next = pending[0];
      const fecha = new Date(next.inicio);
      this.statNextValue.textContent = fecha.toLocaleDateString('es-PE', { month: 'short', day: 'numeric' });
      if (this.statNextSub) {
        this.statNextSub.textContent = fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
      }
    } else {
      // Si no hay citas pendientes
      if (this.statNextValue) this.statNextValue.textContent = '--';
      if (this.statNextSub) this.statNextSub.textContent = 'Aún sin programar';
    }
  }

  async handleSaveAuto(data) {
    try {
      // Basic validation
      if (!data.marca || !data.modelo || !data.placas) {
        alert('Por favor completa los campos obligatorios');
        return;
      }

      await this.getClient().post('/automoviles', data);

      // Refresh data
      await this.loadAutos();

      // Close modal
      if (this.modal) this.modal.open = false;

      // Show success (simple alert for now, could be a toast)
      alert('Automóvil guardado correctamente');
    } catch (e) {
      console.error('Error saving auto', e);
      alert('Error al guardar el automóvil. Intenta de nuevo.');
    }
  }

  handleAuthError(e) {
    if (e?.status === 401 || e?.status === 403) {
      // Dispatch event to open login modal
      window.dispatchEvent(new CustomEvent('open-auth', { detail: 'login' }));
    }
  }
}

customElements.define('account-dashboard', AccountDashboard);

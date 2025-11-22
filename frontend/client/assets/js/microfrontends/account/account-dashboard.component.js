import apiClient from '../../services/api-client.js';

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
    .stat-card::after { display:none; }
    .stat-card:nth-child(1) { --stat-accent:#dbeafe; --stat-color:#1e40af; }
    .stat-card:nth-child(2) { --stat-accent:#dcfce7; --stat-color:#15803d; }
    .stat-card:nth-child(3) { --stat-accent:#fef3c7; --stat-color:#b45309; }
    .stat-icon { width:36px; height:36px; border-radius:6px; display:grid; place-items:center; color:var(--stat-color); background:var(--stat-accent); }
    .stat-label { font-size:0.6875rem; text-transform:uppercase; letter-spacing:0.05em; color:#94a3b8; font-weight:600; margin-bottom:0.15rem; }
    .stat-value { font-size:1.25rem; font-weight:700; color:#0f172a; line-height:1; }
    .stat-sub { color:#64748b; font-size:0.75rem; font-weight:400; margin-top:0.15rem; }

    .dashboard-grid { display:block; }
    .section-container { opacity:1; transition: opacity 250ms ease; }
    .section-container.hidden { display:none; opacity:0; }
    .card { position:relative; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:1.5rem; box-shadow:0 1px 2px rgba(0,0,0,0.03); margin-bottom:1rem; }
    .card::after { display:none; }
    .card > * { position:relative; z-index:1; }
    .card-header { display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem; flex-wrap:wrap; }
    .card-header.card-header--stacked { align-items:flex-start; }
    .card-icon { width:36px; height:36px; border-radius:6px; display:grid; place-items:center; background:#f1f5f9; color:#475569; flex-shrink:0; }
    .card-title { font-size:1rem; font-weight:700; color:#0f172a; margin:0; }
    .card-kicker { font-size:0.6875rem; text-transform:uppercase; letter-spacing:0.05em; background:#f1f5f9; color:#64748b; padding:0.15rem 0.5rem; border-radius:4px; font-weight:600; }

    .profile-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(360px,1fr)); gap:1.5rem; }
    .info-block { display:flex; gap:0.75rem; align-items:center; padding:0.75rem; border:1px solid #e2e8f0; border-radius:8px; background:#fafafa; transition:all 150ms ease; }
    .info-block:hover { background:#fff; border-color:#cbd5e1; }
    .soft-icon { width:32px; height:32px; border-radius:6px; display:grid; place-items:center; background:#f1f5f9; color:#64748b; flex-shrink:0; }
    .info-label { font-size:0.6875rem; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:0.03em; margin-bottom:0.15rem; }
    .info-value { font-size:0.875rem; font-weight:600; color:#0f172a; }
    .id-chip { display:inline-block; margin-top:0.5rem; padding:0.35rem 0.65rem; border-radius:999px; background:rgba(243,244,246,0.6); color:#374151; font-weight:700; font-size:0.85rem; }

    .list-controls { display:flex; flex-wrap:wrap; gap:0.6rem; align-items:center; margin-bottom:1rem; padding:0.6rem 0.75rem; border-radius:12px; border:1px solid rgba(226,232,240,0.9); background:transparent; box-shadow:none; }
    .search { position:relative; flex:1 1 240px; }
    .search input { width:100%; padding:0.65rem 1rem 0.65rem 2.4rem; border:1px solid rgba(226,232,240,0.9); border-radius:10px; background:#ffffff; font-weight:600; color:#0f172a; box-shadow:none; }
    .search svg { position:absolute; top:50%; left:1rem; transform:translateY(-50%); width:16px; height:16px; color:#94a3b8; }
    .page-indicator { color:#94a3b8; font-weight:600; font-size:0.95rem; }
    .pager { display:flex; gap:0.5rem; align-items:center; }
    .pager button { border:1px solid rgba(203,213,225,0.9); background:#fff; border-radius:999px; padding:0.45rem 0.95rem; font-weight:700; color:#0f172a; transition:all 150ms ease; }
    .pager button:disabled { opacity:0.35; cursor:not-allowed; }
    .pager button:not(:disabled):hover { color:#2563eb; border-color:#2563eb; }

    #autos-list > .autos-item { margin-bottom:0.75rem; }
    .auto-card { border:1px solid #e2e8f0; border-radius:8px; padding:1rem; background:#fafafa; transition:all 150ms ease; }
    .auto-card:hover { background:#fff; border-color:#cbd5e1; box-shadow:0 6px 16px rgba(0,0,0,0.06); transform:translateY(-2px); }
    .auto-header { display:flex; gap:0.75rem; justify-content:space-between; flex-wrap:wrap; align-items:center; }
    .auto-main { display:flex; gap:0.65rem; align-items:center; flex:1; }
    .car-chip { width:36px; height:36px; border-radius:6px; display:grid; place-items:center; background:#f1f5f9; color:#475569; flex-shrink:0; }
    .auto-name { font-size:0.9375rem; font-weight:600; color:#0f172a; margin:0; }
    .auto-meta { display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.25rem; }
    .auto-badge { background:#f1f5f9; color:#475569; border-radius:4px; padding:0.2rem 0.5rem; font-weight:500; font-size:0.75rem; display:inline-flex; gap:0.25rem; align-items:center; }
    .btn-edit { border:1px solid #bfdbfe; background:#eff6ff; color:#1e40af; border-radius:6px; padding:0.375rem 0.625rem; font-weight:500; font-size:0.8125rem; margin-right:0.4rem; cursor:pointer; transition:all 150ms ease; }
    .btn-edit:hover { background:#dbeafe; border-color:#60a5fa; }
    .btn-del { border:1px solid #fecdd3; background:#fff1f2; color:#be123c; border-radius:6px; padding:0.375rem 0.625rem; font-weight:500; font-size:0.8125rem; cursor:pointer; transition:all 150ms ease; }
    .btn-del:hover { background:#fee2e2; border-color:#f87171; }
    .fields { display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.5rem; margin-top:0.625rem; }
    .field-tile { border:1px solid #e2e8f0; border-radius:6px; padding:0.5rem 0.625rem; background:#fafafa; }
    .field-label { color:#94a3b8; font-weight:600; font-size:0.6875rem; text-transform:uppercase; letter-spacing:0.03em; margin-bottom:0.15rem; }
    .field-value { color:#0f172a; font-weight:600; font-size:0.875rem; }
    .vin { margin-top:0.625rem; padding:0.5rem 0.625rem; border-radius:6px; background:#f8fafc; color:#475569; font-family:monospace; font-size:0.75rem; word-break:break-all; border:1px solid #e2e8f0; }

    .cita-card { border:1px solid #e2e8f0; border-radius:8px; padding:0.875rem; background:#fafafa; margin-bottom:0.625rem; transition:all 150ms ease; }
    .cita-card:hover { background:#fff; border-color:#cbd5e1; }
    .cita-heading { display:flex; justify-content:space-between; gap:0.75rem; align-items:center; flex-wrap:wrap; }
    .cita-card .card-icon, .cita-card .card-icon svg { width:28px; height:28px; }
    .cita-card svg { width:18px; height:18px; }
    .badge { display:inline-flex; align-items:center; gap:0.25rem; padding:0.25rem 0.5rem; border-radius:4px; font-size:0.6875rem; font-weight:600; letter-spacing:0.02em; text-transform:uppercase; }
    .badge-pending { background-color:#fef3c7; color:#92400E; border:1px solid #fde68a; }
    .badge-confirmed { background-color:#dbeafe; color:#1e40af; border:1px solid #bfdbfe; }
    .badge-completed { background-color:#dcfce7; color:#15803d; border:1px solid #bbf7d0; }
    .badge-cancelled { background-color:#fee2e2; color:#991b1b; border:1px solid #fecaca; }

    #auto-modal { 
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15,23,42,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 1000;
    }
    #auto-modal .modal-card { 
      background: #ffffff; 
      border: 1px solid rgba(226,232,240,0.9); 
      border-radius: 14px; 
      padding: 1.25rem; 
      box-shadow: none;
      max-height: 90vh;
      overflow-y: auto;
      width: 100%;
      max-width: 640px;
    }
    #auto-modal h3 { font-size:1.25rem; font-weight:700; margin-bottom:0.6rem; }
    #auto-modal form input, #auto-modal form select { border:1px solid rgba(226,232,240,0.9); border-radius:10px; background:#fff; }
    
    .modal-card { 
      background: #ffffff; 
      border: 1px solid rgba(226,232,240,0.9); 
      border-radius: 14px; 
      padding: 1.25rem; 
      box-shadow: none;
      max-height: 90vh;
      overflow-y: auto;
      width: 100%;
      max-width: 640px;
    }
    .modal-card h3 { font-size:1.25rem; font-weight:700; margin-bottom:0.6rem; }
    .modal-card form input, .modal-card form select { border:1px solid rgba(226,232,240,0.9); border-radius:10px; background:#fff; }

    .car-chip svg, .small-auto-icon svg { width:1rem; height:1rem; }
    .tiny-icon svg { width:0.75rem; height:0.75rem; }

    .modal-actions { display:flex; gap:12px; justify-content:flex-end; padding-top:16px; }
    @media (max-width:640px) { .modal-actions { flex-direction:column-reverse; align-items:stretch; } .modal-actions .btn-primary, .modal-actions .btn-ghost { width:100%; } }
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
          <svg style="width:16px;height:16px;display:inline-block;vertical-align:middle;margin-right:4px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
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
          <p class="stat-label">Pr&oacute;xima</p>
          <p id="stat-next-value" class="stat-value">--</p>
          <p id="stat-next-sub" class="stat-sub">A&uacute;n sin programar</p>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="section-container" id="general-section">
        <div style="display:grid;grid-template-columns:1fr;gap:1.25rem;">
          
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
              <button class="btn-ghost" style="padding:0.4rem 0.8rem;font-size:0.85rem;" onclick="this.getRootNode().host.showTab('perfil')">Ver detalles →</button>
            </div>
            <div id="general-profile" class="profile-grid" style="grid-template-columns:repeat(auto-fit,minmax(360px,1fr));"></div>
          </div>

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
                <button class="btn-ghost" style="padding:0.4rem 0.8rem;font-size:0.85rem;" onclick="this.getRootNode().host.showTab('autos')">Ver todos →</button>
                <button id="btn-add-auto-general" class="btn-primary" style="padding:0.4rem 0.8rem;font-size:0.85rem;">+ Nuevo</button>
              </div>
            </div>
            <div id="general-autos" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:1.5rem;"></div>
          </div>

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
              <button class="btn-ghost" style="padding:0.4rem 0.8rem;font-size:0.85rem;" onclick="this.getRootNode().host.showTab('citas')">Ver todas →</button>
            </div>
            <div id="general-citas" class="space-y-4"></div>
          </div>

        </div>
      </div>

      <div class="section-container hidden" id="perfil-section">
        <div class="card" data-section="perfil" id="perfil">
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
            <div style="display:flex;align-items:center;gap:0.5rem;">
              <button id="edit-profile-btn-mini" class="btn-primary" title="Editar perfil completo" style="padding:0.5rem 0.8rem;font-size:0.8125rem;">Editar perfil</button>
            </div>
          </div>
          <div id="profile" class="profile-grid"></div>
        </div>
      </div>

      <div class="section-container" id="autos-section">
        <div class="card" data-section="autos" id="autos">
        <div class="card-header" style="justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <div class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p class="card-kicker">Garaje</p>
              <h2 class="card-title">Autom&oacute;viles</h2>
            </div>
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
      </div>

      <div class="section-container" id="citas-section">
        <div class="card" data-section="citas" id="citas">
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
          <div id="citas-list" class="space-y-4"></div>
        </div>
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
            <label for="auto-marca" class="block text-sm font-semibold text-gray-700 mb-1">Marca *</label>
            <select id="auto-marca" name="marca" required autocomplete="off" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none">
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
            <label for="auto-modelo" class="block text-sm font-semibold text-gray-700 mb-1">Modelo *</label>
            <input id="auto-modelo" name="modelo" placeholder="Ej. Corolla, Civic, etc." autocomplete="off" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" required />
          </div>
          
          <div>
            <label for="auto-anio" class="block text-sm font-semibold text-gray-700 mb-1">A&ntilde;o *</label>
            <input id="auto-anio" name="anio" type="number" placeholder="2020" min="1950" max="2025" autocomplete="off" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" required />
          </div>
          
          <div>
            <label for="auto-color" class="block text-sm font-semibold text-gray-700 mb-1">Color</label>
            <input id="auto-color" name="color" placeholder="Color del veh&iacute;culo" autocomplete="off" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" />
          </div>
          
          <div>
            <label for="auto-placas" class="block text-sm font-semibold text-gray-700 mb-1">Placas *</label>
            <input id="auto-placas" name="placas" placeholder="XXX-123" autocomplete="off" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" required />
          </div>
          
          <div>
            <label for="auto-numero_serie" class="block text-sm font-semibold text-gray-700 mb-1">N&uacute;mero de serie *</label>
            <input id="auto-numero_serie" name="numero_serie" placeholder="VIN del veh&iacute;culo" autocomplete="off" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" required />
          </div>
        </div>
        
        <div class="modal-actions">
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
    this.tabButtons = Array.from(this.root.querySelectorAll('.tab'));
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

    if (this.modal) {
      this.modal.classList.add('hidden');
      this.modal.style.display = 'none';
      console.debug('[account-dashboard] Modal explicitly set to hidden');
    }

    try {
      if (this.tabButtons && this.tabButtons.length) {
        this.tabButtons.forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = btn.getAttribute('data-tab');
            this.showTab(tab);
          });
        });
        const hash = (typeof window !== 'undefined' && window.location && window.location.hash) ? String(window.location.hash).replace('#', '') : '';
        const last = localStorage.getItem('dashboard.activeTab') || 'general';
        const initialTab = (hash && hash.length) ? hash : last;
        this.showTab(initialTab);
      }
    } catch (e) {
      console.warn('[account-dashboard] tabs setup error', e);
    }

    this.registerEvents();
    this.loadData();
    
    this.handleUrlHash();
    console.debug('[account-dashboard] connectedCallback completed');
  }

  showTab(tabName) {
    try {
      if (!tabName) return;
      // update buttons
      (this.tabButtons || []).forEach((b) => {
        const name = b.getAttribute('data-tab');
        const sel = name === tabName ? 'true' : 'false';
        b.setAttribute('aria-selected', sel);
      });

      // show/hide full-width sections with fade
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

      if (tabName === 'general') {
        this.renderGeneralOverview();
      }

      localStorage.setItem('dashboard.activeTab', tabName);
    } catch (e) {
      console.warn('[account-dashboard] showTab error', e);
    }
  }

  updateTabCounts() {
    try {
      const autosCount = this.autosData ? this.autosData.length : 0;
      const autosBadge = this.root.querySelector('#tab-autos-count');
      if (autosBadge) autosBadge.textContent = autosCount;

      const citasCount = this.root.querySelector('#citas-list')?.children?.length || 0;
      const citasBadge = this.root.querySelector('#tab-citas-count');
      if (citasBadge) citasBadge.textContent = citasCount;
    } catch (e) {
      console.warn('[account-dashboard] updateTabCounts error', e);
    }
  }

  handleUrlHash() {
    try {
      const hash = window.location.hash;
      console.debug('[account-dashboard] Handling URL hash:', hash);
      
      if (hash === '#autos') {
        const autosSection = this.root.querySelector('.card:nth-of-type(2)');
        if (autosSection) {
          setTimeout(() => {
            autosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.debug('[account-dashboard] Scrolled to autos section');
          }, 500);
        }
      }
      
      
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
    [this.btnAdd, this.btnAddTop].forEach((btn) => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          console.debug('[account-dashboard] Add auto button clicked explicitly');
          this.showModal();
        });
      }
    });
    
    const btnAddGeneral = this.root.querySelector('#btn-add-auto-general');
    if (btnAddGeneral) {
      btnAddGeneral.addEventListener('click', (e) => {
        e.preventDefault();
        this.showModal();
      });
    }
    
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
    this.updateTabCounts();
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
        <!-- full profile edit footer removed for compact layout -->
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
      this.updateTabCounts();
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
          <div style="display:flex;gap:0.5rem;">
            <button data-id="${a.id_auto}" class="btn-edit">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:16px;height:16px;display:inline-block;vertical-align:middle;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </button>
            <button data-id="${a.id_auto}" class="btn-del">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:16px;height:16px;display:inline-block;vertical-align:middle;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar
            </button>
          </div>
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

    this.autosList.querySelectorAll('.btn-edit').forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleEditAuto(e));
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
      this.citasData = Array.isArray(citas) ? citas : (Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []));

      const count = this.citasData.length || 0;
      if (this.statCitasValue) this.statCitasValue.textContent = count;
      if (this.statCitasSub) this.statCitasSub.textContent = count ? 'Últimos servicios y citas activas' : 'Agenda tu primera visita al taller';

      try {
        const now = Date.now();
        for (let i = 0; i < this.citasData.length; i += 1) {
          const c = this.citasData[i];
          try {
            const fin = c.fin ? new Date(c.fin).getTime() : null;
            const estadoNorm = (c.estado || 'PENDIENTE').toUpperCase();
            if (fin && !Number.isNaN(fin) && fin < now && estadoNorm !== 'COMPLETADA' && estadoNorm !== 'COMPLETED') {
              try {
                await client.put(`/citas/${c.id_cita || c.id}`, { estado: 'COMPLETADA' });
                c.estado = 'COMPLETADA';
              } catch (e) {
                c.estado = 'COMPLETADA';
              }
            }
          } catch (e) {}
        }
      } catch (e) {}

      this.citasPage = this.citasPage || 1;
      this.citasPageSize = this.citasPageSize || 3;
      this.citasFilter = this.citasFilter || { search: '', from: '', to: '' };

      try { this.setupCitasFilters(); } catch (e) {}

      this.renderCitasList();

      this.updateTabCounts();
    } catch (e) {
      if (!this.handleAuthError(e, this.citasList)) {
        this.citasList.innerHTML = '<p class="text-sm text-red-600">Error cargando citas.</p>';
      }
    }
  }

  setupCitasFilters() {
    try {
      if (this._citasFiltersSetup) return;
      this._citasFiltersSetup = true;
      const container = this.root.querySelector('#citas-list');
      if (!container) return;

      const controls = document.createElement('div');
      controls.className = 'list-controls mb-4';
      controls.innerHTML = `
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;width:100%">
          <div class="search" style="display:flex;align-items:center;gap:8px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:18px;height:18px;color:#94a3b8;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 5a6 6 0 100 12 6 6 0 000-12z" />
            </svg>
            <span style="color:#475569;font-weight:600">Filtrar por fecha:</span>
          </div>
          <label style="display:flex;align-items:center;gap:6px">Desde <input id="citas-from" type="date" class="px-2 py-2 border rounded" /></label>
          <label style="display:flex;align-items:center;gap:6px">Hasta <input id="citas-to" type="date" class="px-2 py-2 border rounded" /></label>
          <button id="citas-filter-apply" class="btn-ghost">Aplicar</button>
          <button id="citas-filter-clear" class="btn-ghost">Limpiar</button>
        </div>
      `;
      container.insertAdjacentElement('beforebegin', controls);

      const f = controls.querySelector('#citas-from');
      const t = controls.querySelector('#citas-to');
      const apply = controls.querySelector('#citas-filter-apply');
      const clear = controls.querySelector('#citas-filter-clear');

      if (apply) apply.addEventListener('click', () => { this.citasFilter.from = f.value || ''; this.citasFilter.to = t.value || ''; this.citasPage = 1; this.renderCitasList(); });
      if (clear) clear.addEventListener('click', () => { if (f) f.value = ''; if (t) t.value = ''; this.citasFilter = { from: '', to: '' }; this.citasPage = 1; this.renderCitasList(); });
    } catch (e) {
      console.warn('[account-dashboard] setupCitasFilters error', e);
    }
  }

  renderCitasList() {
    try {
      const all = this.citasData || [];
      let filtered = all.slice();
      const flt = this.citasFilter || { search: '', from: '', to: '' };


      if (flt.from) {
        const fromTs = new Date(flt.from + 'T00:00:00').getTime();
        filtered = filtered.filter(c => (c.inicio && new Date(c.inicio).getTime() >= fromTs));
      }
      if (flt.to) {
        const toTs = new Date(flt.to + 'T23:59:59').getTime();
        filtered = filtered.filter(c => (c.inicio && new Date(c.inicio).getTime() <= toTs));
      }

      filtered = filtered.filter((c) => {
        try {
          const st = (c.estado || '').toString().toUpperCase();
          return st !== 'CANCELADA' && st !== 'CANCELLED';
        } catch (e) { return true; }
      });

      const total = filtered.length;
      const pageSize = this.citasPageSize || 3;
      const page = this.citasPage || 1;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const start = (page - 1) * pageSize;
      const pageItems = filtered.slice(start, start + pageSize);

      const citasBadge = this.root.querySelector('#tab-citas-count');
      if (citasBadge) citasBadge.textContent = total;

      this.citasList.innerHTML = '';
      if (!pageItems.length) {
        this.citasList.innerHTML = `<div class="text-center py-6">No hay citas que coincidan</div>`;
      } else {
        pageItems.forEach((c) => {
          const el = document.createElement('div');
          el.className = 'cita-card';

          const estadoNorm = (c.estado || 'PENDIENTE').toUpperCase();
          let badgeClass = 'badge badge-pending';
          if (estadoNorm === 'CONFIRMADA' || estadoNorm === 'CONFIRMED') badgeClass = 'badge badge-confirmed';
          else if (estadoNorm === 'COMPLETADA' || estadoNorm === 'COMPLETED') badgeClass = 'badge badge-completed';
          else if (estadoNorm === 'CANCELADA' || estadoNorm === 'CANCELLED') badgeClass = 'badge badge-cancelled';

          const fechaInicio = new Date(c.inicio);
          const fechaFin = new Date(c.fin);
          const fechaStr = fechaInicio.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          const horaInicioStr = fechaInicio.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
          const horaFinStr = fechaFin.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

          el.innerHTML = `
            <div class="cita-heading mb-4">
              <div class="flex items-center gap-3">
                <div class="card-icon">...</div>
                <div>
                  <p class="text-sm text-gray-500">ID: ${c.id_cita || c.id}</p>
                  <h3 class="text-lg font-black text-gray-900">${c.motivo || 'Servicio'}</h3>
                </div>
              </div>
              <span class="${badgeClass}">${estadoNorm}</span>
            </div>
            <div class="fields">
              <div class="field-tile"><p class="field-label">Fecha</p><p class="field-value capitalize">${fechaStr}</p></div>
              <div class="field-tile"><p class="field-label">Horario</p><p class="field-value">${horaInicioStr} - ${horaFinStr}</p></div>
            </div>
            ${c.observaciones ? `<div class="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100"><p class="text-sm text-blue-700 font-semibold mb-1">Observaciones</p><p class="text-base text-gray-700">${c.observaciones}</p></div>` : ''}
            ${c.automovil ? `<div class="mt-4 flex items-center text-base text-gray-700 gap-2"><span>${c.automovil.marca} ${c.automovil.modelo} (${c.automovil.placas})</span></div>` : (c.id_auto ? `<div class="mt-4 flex items-center text-base text-gray-700 gap-2"><span>Auto ID: ${c.id_auto}</span></div>` : '')}
          `;

          // actions
          const actions = document.createElement('div');
          actions.style.display = 'flex';
          actions.style.gap = '0.5rem';
          actions.style.justifyContent = 'flex-end';
          actions.style.marginTop = '12px';

          const startTs = fechaInicio.getTime();
          const nowTs = Date.now();
          const msDiff = startTs - nowTs;
          const allowCancel = !isNaN(msDiff) && msDiff >= (24 * 60 * 60 * 1000);

          if (allowCancel && estadoNorm !== 'CANCELADA') {
            const btn = document.createElement('button');
            btn.className = 'btn-del cancel-cita';
            btn.textContent = 'Cancelar cita';
            btn.dataset.id = c.id_cita || c.id;
            btn.addEventListener('click', async () => {
              if (!confirm('¿Deseas cancelar esta cita? Se marcará como CANCELADA y dejará disponible el horario para otras personas.')) return;
              try {
                await this.getClient().put(`/citas/${btn.dataset.id}`, { estado: 'CANCELADA' });
                this.showSuccessMessage('Cita cancelada correctamente');
                await this.loadCitas();
              } catch (err) {
                if (!this.handleAuthError(err, this.citasList)) this.showErrorMessage('Error cancelando cita');
              }
            });
            actions.appendChild(btn);
          }

          el.appendChild(actions);
          this.citasList.appendChild(el);
        });
      }

      this.renderCitasPagination(total, page, Math.max(1, Math.ceil(total / pageSize)));
    } catch (e) {
      console.error('[account-dashboard] renderCitasList error', e);
    }
  }

  renderCitasPagination(total, currentPage, totalPages) {
    try {
      const existing = this.root.querySelector('#citas-pager');
      if (existing) existing.remove();
      if (totalPages <= 1) return;
      const pager = document.createElement('div');
      pager.id = 'citas-pager';
      pager.className = 'pager';
      pager.style.display = 'flex';
      pager.style.gap = '8px';
      pager.style.marginTop = '12px';
      pager.style.justifyContent = 'center';

      const prev = document.createElement('button');
      prev.textContent = '←';
      prev.disabled = currentPage <= 1;
      prev.addEventListener('click', () => { this.citasPage = Math.max(1, this.citasPage - 1); this.renderCitasList(); });
      pager.appendChild(prev);

      const info = document.createElement('span');
      info.textContent = `Página ${currentPage} de ${totalPages}`;
      pager.appendChild(info);

      const next = document.createElement('button');
      next.textContent = '→';
      next.disabled = currentPage >= totalPages;
      next.addEventListener('click', () => { this.citasPage = Math.min(totalPages, this.citasPage + 1); this.renderCitasList(); });
      pager.appendChild(next);

      const container = this.root.querySelector('#citas-list');
      if (container) container.insertAdjacentElement('afterend', pager);
    } catch (e) {
      console.warn('[account-dashboard] renderCitasPagination error', e);
    }
  }

  showModal() {
    console.debug('[account-dashboard] showModal called explicitly by user action');
    
    const modalTitle = this.modal.querySelector('h3');
    if (modalTitle && !this.editingAutoId) {
      modalTitle.textContent = 'Agregar automóvil';
    }
    
    this.modal.classList.remove('hidden');
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  hideModal() {
    this.modal.classList.add('hidden');
    this.modal.style.display = 'none';
    this.form.reset();
    this.editingAutoId = null;
    document.body.style.overflow = '';
  }

  setupProfileEditListeners() {
    ['nombre', 'email', 'telefono', 'direccion'].forEach(field => {
      const btn = this.profileEl.querySelector(`#edit-${field}`);
      if (btn) {
        btn.addEventListener('click', () => this.showFieldEditModal(field));
      }
    });
    
    try {
      const fullBtn = this.root.querySelector('#edit-profile-btn-mini');
      if (fullBtn) {
        fullBtn.addEventListener('click', (ev) => {
          ev.preventDefault();
          try { this.showProfileEditModal(); } catch (err) { console.warn('[account-dashboard] showProfileEditModal error', err); }
        });
      }
    } catch (err) {
      console.debug('[account-dashboard] No mini profile edit button found to bind', err);
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
            <label for="edit-field-${field}" class="block text-sm font-semibold text-gray-700 mb-2">${fieldLabels[field]}</label>
            <input 
              id="edit-field-${field}"
              type="${fieldTypes[field]}" 
              name="${field}" 
              value="${currentValue}"
              autocomplete="${field === 'nombre' ? 'name' : field === 'email' ? 'email' : field === 'telefono' ? 'tel' : 'street-address'}"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              ${field === 'nombre' || field === 'email' ? 'required' : ''}
            />
          </div>
          <div class="modal-actions">
            <button type="button" id="cancel-field-edit" class="btn-ghost">Cancelar</button>
            <button type="submit" id="save-field-edit" class="btn-primary">Guardar</button>
          </div>
        </form>
      `,
      (modal) => {
        console.debug('[account-dashboard] setupFn for edit-field modal, modal element:', modal);
        const form = modal.querySelector('#edit-field-form');
        const cancelBtn = modal.querySelector('#cancel-field-edit');
        console.debug('[account-dashboard] edit-field form found:', !!form, 'cancelBtn found:', !!cancelBtn);
        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => this.hideCustomModal());
        }
        if (form) {
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
              const formData = new FormData(form);
              const value = formData.get(field);
              console.debug('[account-dashboard] submitting edit-field form', field, value);
              await this.updateProfileField(field, value);
            } catch (err) {
              console.error('[account-dashboard] Error submitting field edit form', err);
              this.showErrorMessage('Error al guardar: ' + (err && err.message));
            }
          });
        }
      }
    );
  }

  showProfileEditModal() {
    const profile = this.currentProfile;
    if (!profile) {
      console.warn('[account-dashboard] showProfileEditModal called but currentProfile is missing');
      this.showErrorMessage('No se pudo cargar tu perfil. Intenta recargar la página e intenta de nuevo.');
      return;
    }

    console.debug('[account-dashboard] Opening full profile edit modal', profile && profile.id_cliente);

    this.showCustomModal(
      'Editar Perfil Completo',
      `
        <form id="edit-profile-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="edit-profile-nombre" class="block text-sm font-semibold text-gray-700 mb-2">Nombre completo *</label>
              <input id="edit-profile-nombre" type="text" name="nombre" value="${profile.nombre || ''}" autocomplete="name" required
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label for="edit-profile-email" class="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input id="edit-profile-email" type="email" name="email" value="${profile.email || ''}" autocomplete="email" required
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label for="edit-profile-telefono" class="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
              <input id="edit-profile-telefono" type="tel" name="telefono" value="${profile.telefono || ''}" autocomplete="tel"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label for="edit-profile-direccion" class="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
              <input id="edit-profile-direccion" type="text" name="direccion" value="${profile.direccion || ''}" autocomplete="street-address"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" id="cancel-profile-edit" class="btn-ghost">Cancelar</button>
            <button type="submit" id="save-profile-edit" class="btn-primary">Guardar Cambios</button>
          </div>
        </form>
      `,
      (modal) => {
        console.debug('[account-dashboard] setupFn for full-profile modal, modal element:', modal);
        const form = modal.querySelector('#edit-profile-form');
        const cancelBtn = modal.querySelector('#cancel-profile-edit');
        console.debug('[account-dashboard] edit-profile form found:', !!form, 'cancelBtn found:', !!cancelBtn);
        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => this.hideCustomModal());
        }
        if (form) {
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
              const formData = new FormData(form);
              const data = Object.fromEntries(formData.entries());
              console.debug('[account-dashboard] submitting full profile form', data);
              await this.updateProfileComplete(data);
            } catch (err) {
              console.error('[account-dashboard] Error submitting profile edit form', err);
              this.showErrorMessage('Error al guardar perfil: ' + (err && err.message));
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
      
      this.currentProfile[field] = value;
      
      await this.loadProfile();
      
      this.hideCustomModal();
      
      this.showSuccessMessage(`${field} actualizado correctamente`);
      
      try {
        const profile = this.currentProfile;
        try { sessionStorage.setItem('pendingCliente', JSON.stringify(profile)); } catch (e) {}
        try { window.dispatchEvent(new CustomEvent('user-logged-in', { detail: profile })); } catch (e) {}
      } catch (e) {}
      
    } catch (error) {
      console.error('Error updating profile field:', error);
      this.showErrorMessage(`Error al actualizar ${field}: ` + (error.message || 'Error desconocido'));
    }
  }

  async updateProfileComplete(data) {
    try {
      const client = this.getClient();
      
      await client.put(`/clientes/${this.currentProfile.id_cliente}`, data);
      
      Object.assign(this.currentProfile, data);
      
      await this.loadProfile();
      
      this.hideCustomModal();
      
      this.showSuccessMessage('Perfil actualizado correctamente');
      
      try {
        const profile = this.currentProfile;
        try { sessionStorage.setItem('pendingCliente', JSON.stringify(profile)); } catch (e) {}
        try { window.dispatchEvent(new CustomEvent('user-logged-in', { detail: profile })); } catch (e) {}
      } catch (e) {}
      
    } catch (error) {
      console.error('Error updating profile:', error);
      this.showErrorMessage('Error al actualizar perfil: ' + (error.message || 'Error desconocido'));
    }
  }

  showCustomModal(title, content, setupFn) {
    if (!document.getElementById('profile-modal-global-styles')) {
      const globalStyle = document.createElement('style');
      globalStyle.id = 'profile-modal-global-styles';
      globalStyle.textContent = `
        #profile-edit-modal .modal-card { 
          background: #ffffff; 
          border: 1px solid rgba(226,232,240,0.9); 
          border-radius: 14px; 
          padding: 1.25rem; 
          box-shadow: none;
          max-height: 90vh;
          overflow-y: auto;
          width: 100%;
          max-width: 640px;
        }
        #profile-edit-modal h3 { font-size:1.25rem; font-weight:700; margin-bottom:0.6rem; }
        #profile-edit-modal form input, #profile-edit-modal form select, #profile-edit-modal form textarea { 
          border:1px solid rgba(226,232,240,0.9); 
          border-radius:10px; 
          background:#fff; 
          font-size: 0.875rem;
          padding: 0.65rem 1rem;
        }
        #profile-edit-modal label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }
        #profile-edit-modal .modal-actions { 
          display:flex; 
          gap:12px; 
          justify-content:flex-end; 
          padding-top:16px; 
        }
        #profile-edit-modal .btn-primary, #profile-edit-modal .btn-ghost {
          padding: 0.5rem 0.875rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.8125rem;
          border: none;
          cursor: pointer;
          transition: all 150ms ease;
        }
        #profile-edit-modal .btn-primary {
          background: #0f172a;
          color: #ffffff;
        }
        #profile-edit-modal .btn-primary:hover {
          background: #1e293b;
        }
        #profile-edit-modal .btn-ghost {
          background: transparent;
          border: 1px solid #cbd5e1;
          color: #475569;
        }
        #profile-edit-modal .btn-ghost:hover {
          border-color: #94a3b8;
          color: #0f172a;
          background: #f8fafc;
        }
        @media (max-width:640px) { 
          #profile-edit-modal .modal-actions { 
            flex-direction:column-reverse; 
            align-items:stretch; 
          } 
          #profile-edit-modal .modal-actions .btn-primary, 
          #profile-edit-modal .modal-actions .btn-ghost { 
            width:100%; 
          } 
        }
      `;
      document.head.appendChild(globalStyle);
    }
    
    let customModal = document.getElementById('profile-edit-modal') || this.root.querySelector('#profile-edit-modal');
    if (!customModal) {
      customModal = document.createElement('div');
      customModal.id = 'profile-edit-modal';
      customModal.className = 'fixed inset-0 hidden items-center justify-center z-50';
      customModal.style.position = 'fixed';
      customModal.style.top = '0';
      customModal.style.left = '0';
      customModal.style.width = '100%';
      customModal.style.height = '100%';
      customModal.style.display = 'none';
      customModal.style.alignItems = 'center';
      customModal.style.justifyContent = 'center';
      customModal.style.padding = '1rem';
      customModal.style.background = 'rgba(0,0,0,0.55)';
      customModal.style.zIndex = '2147483647';
      document.body.appendChild(customModal);
      console.debug('[account-dashboard] profile-edit-modal appended to document.body');
    } else {
      console.debug('[account-dashboard] Reusing existing profile-edit-modal element');
    }
    
    customModal.innerHTML = `
      <div class="modal-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3>${title}</h3>
          <button id="close-custom-modal" class="btn-ghost" type="button">Cerrar</button>
        </div>
        ${content}
      </div>
    `;
    try {
      const footers = customModal.querySelectorAll('.modal-actions');
      footers.forEach(f => {
        f.style.gap = f.style.gap || '12px';
        f.style.paddingTop = f.style.paddingTop || '16px';
        f.style.justifyContent = f.style.justifyContent || 'flex-end';
      });
    } catch (err) {
      console.debug('[account-dashboard] no modal-actions elements to style inline', err);
    }

    customModal.classList.remove('hidden');
    customModal.style.display = 'flex';
    customModal.style.alignItems = 'center';
    customModal.style.justifyContent = 'center';
    document.body.style.overflow = 'hidden';

    customModal.onclick = (e) => { if (e.target === customModal) { this.hideCustomModal(); } };
    
    try {
      const closeBtn = customModal.querySelector('#close-custom-modal');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.hideCustomModal());
      } else {
        console.debug('[account-dashboard] close button not found in custom modal');
      }


      if (typeof setupFn === 'function') {
        try {
          setupFn(customModal);
        } catch (err) {
          console.warn('[account-dashboard] setupFn error', err);
        }
      } else {
        console.debug('[account-dashboard] No setupFn provided for custom modal');
      }
    } catch (err) {
      console.warn('[account-dashboard] Error setting up custom modal listeners:', err);
    }
  }

  hideCustomModal() {
    const customModal = document.getElementById('profile-edit-modal') || (this.root && this.root.querySelector('#profile-edit-modal'));
    if (customModal) {
      try { customModal.remove(); } catch (e) { customModal.classList.add('hidden'); customModal.style.display = 'none'; }
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
      
      if (this.editingAutoId) {
        await client.put(`/automoviles/${this.editingAutoId}`, body);
        this.showSuccessMessage('Auto actualizado correctamente');
      } else {
        await client.post('/automoviles', body);
        this.showSuccessMessage('Auto agregado correctamente');
      }
      
      this.hideModal();
      this.editingAutoId = null;
      await this.loadAutos();
      
      if (this.autosList) {
        try { this.autosList.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (err) {}
      }
    } catch (err) {
      if (!this.handleAuthError(err, this.autosList)) {
        this.showErrorMessage('Error guardando automovil: ' + (err.message || JSON.stringify(err.body) || err));
      }
    }
  }

  async handleEditAuto(e) {
    const id = e.currentTarget.getAttribute('data-id');
    const auto = this.autosData.find(a => a.id_auto == id);
    
    if (!auto) {
      this.showErrorMessage('No se encontró el auto');
      return;
    }
    
    this.editingAutoId = id;
    
    const modalTitle = this.modal.querySelector('h3');
    if (modalTitle) modalTitle.textContent = 'Editar Automóvil';
    
    if (this.form) {
      this.form.marca.value = auto.marca || '';
      this.form.modelo.value = auto.modelo || '';
      this.form.anio.value = auto.anio || '';
      this.form.color.value = auto.color || '';
      this.form.placas.value = auto.placas || '';
      this.form.numero_serie.value = auto.numero_serie || '';
    }
    
    this.showModal();
  }

  async handleDeleteAuto(e) {
    const id = e.currentTarget.getAttribute('data-id');
    if (!confirm('¿Eliminar este automóvil?')) return;
    try {
      const client = this.getClient();
      await client.delete(`/automoviles/${id}`);
      this.showSuccessMessage('Auto eliminado correctamente');
      await this.loadAutos();
    } catch (err) {
      if (!this.handleAuthError(err, this.autosList)) {
        this.showErrorMessage('Error eliminando automovil: ' + (err.message || JSON.stringify(err.body) || err));
      }
    }
  }

  renderGeneralOverview() {
    const generalProfile = this.root.querySelector('#general-profile');
    if (generalProfile && this.currentProfile) {
      const p = this.currentProfile;
      generalProfile.innerHTML = `
        <div class="info-block">
          <div class="soft-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p class="info-label">Nombre completo</p>
            <p class="info-value">${p.nombre || 'Sin nombre'}</p>
          </div>
        </div>
        <div class="info-block">
          <div class="soft-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="info-label">Email</p>
            <p class="info-value">${p.email || 'Agrega tu correo'}</p>
          </div>
        </div>
        <div class="info-block">
          <div class="soft-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <p class="info-label">Teléfono</p>
            <p class="info-value">${p.telefono || 'Agrega tu teléfono'}</p>
          </div>
        </div>
        <div class="info-block">
          <div class="soft-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p class="info-label">Dirección</p>
            <p class="info-value">${p.direccion || 'Sin dirección'}</p>
          </div>
        </div>
      `;
    }

    const generalAutos = this.root.querySelector('#general-autos');
    if (generalAutos) {
      const recentAutos = (this.autosData || []).slice(0, 3);
      if (recentAutos.length) {
        generalAutos.innerHTML = recentAutos.map(a => `
          <div class="auto-card">
            <div class="auto-header">
              <div class="auto-main">
                <div class="car-chip">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div>
                  <p class="auto-name">${a.marca} ${a.modelo}</p>
                  <div class="auto-meta">
                    <span class="auto-badge">${a.anio || 'Sin año'}</span>
                    ${a.color ? `<span class="auto-badge">${a.color}</span>` : ''}
                  </div>
                </div>
              </div>
            </div>
            <div class="fields">
              <div class="field-tile">
                <p class="field-label">Placas</p>
                <p class="field-value">${a.placas}</p>
              </div>
              <div class="field-tile">
                <p class="field-label">Color</p>
                <p class="field-value">${a.color || 'N/A'}</p>
              </div>
            </div>
            <div class="vin">VIN: ${a.numero_serie}</div>
          </div>
        `).join('');
      } else {
        generalAutos.innerHTML = `
          <div style="text-align:center;padding:2rem;color:#94a3b8;">
            <svg style="width:48px;height:48px;margin:0 auto 1rem;opacity:0.5;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <p style="font-weight:600;color:#64748b;">No hay vehículos registrados</p>
            <p style="font-size:0.9rem;">Agrega tu primer auto para comenzar</p>
          </div>
        `;
      }
    }

    const generalCitas = this.root.querySelector('#general-citas');
    if (generalCitas) {
      this.getClient().get('/citas/mine').then(res => {
        const allCitas = res?.data || res || [];
        const activeCitas = (Array.isArray(allCitas) ? allCitas : []).filter(c => {
          try { const s = (c.estado || '').toString().toUpperCase(); return s !== 'CANCELADA' && s !== 'CANCELLED'; } catch (e) { return true; }
        });
        const recentCitas = activeCitas.slice(0, 4);
        
        if (recentCitas.length) {
          generalCitas.innerHTML = recentCitas.map(c => {
            const estadoNorm = (c.estado || 'PENDIENTE').toUpperCase();
            let badgeClass = 'badge badge-pending';
            if (estadoNorm === 'CONFIRMADA' || estadoNorm === 'CONFIRMED') badgeClass = 'badge badge-confirmed';
            else if (estadoNorm === 'COMPLETADA' || estadoNorm === 'COMPLETED') badgeClass = 'badge badge-completed';
            else if (estadoNorm === 'CANCELADA' || estadoNorm === 'CANCELLED') badgeClass = 'badge badge-cancelled';

            const fechaInicio = new Date(c.inicio);
            const fechaStr = fechaInicio.toLocaleDateString('es-MX', {
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            });
            const horaStr = fechaInicio.toLocaleTimeString('es-MX', {
              hour: '2-digit',
              minute: '2-digit'
            });

            return `
              <div class="cita-card">
                <div class="cita-heading">
                  <div style="display:flex;align-items:center;gap:0.75rem;">
                    <div class="card-icon" style="width:36px;height:36px;">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 style="font-size:1rem;font-weight:700;margin:0;color:#0f172a;">${c.motivo || 'Servicio'}</h3>
                      <p style="font-size:0.85rem;color:#64748b;margin:0.25rem 0 0 0;">${fechaStr} • ${horaStr}</p>
                    </div>
                  </div>
                  <span class="${badgeClass}">${estadoNorm}</span>
                </div>
              </div>
            `;
          }).join('');
        } else {
          generalCitas.innerHTML = `
            <div style="text-align:center;padding:2rem;color:#94a3b8;">
              <svg style="width:48px;height:48px;margin:0 auto 1rem;opacity:0.5;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p style="font-weight:600;color:#64748b;">No hay citas registradas</p>
              <p style="font-size:0.9rem;">Agenda tu primera cita de servicio</p>
            </div>
          `;
        }
      }).catch(err => {
        console.error('Error loading citas for general view:', err);
        generalCitas.innerHTML = '<div style="padding:1rem;color:#ef4444;">Error cargando citas</div>';
      });
    }
  }

}

customElements.define('account-dashboard', AccountDashboard);
export default AccountDashboard;

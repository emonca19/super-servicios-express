// assets/js/components/admin-sidebar/admin-sidebar.template.js

const adminSidebarTemplate = () => `
  <aside
    class="h-screen w-64 flex flex-col flex-shrink-0 text-white"
    style="background-color:#1b2838;"
  >
    <!-- LOGO -->
    <header class="h-20 px-5 flex items-center border-b border-white/10">
      <div class="flex items-center gap-3">
        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center bg-white shadow-md shrink-0"
        >
          <span class="text-[11px] font-semibold tracking-tight text-slate-900 leading-none">
            Auto<br />Servicios
          </span>
        </div>
        <div class="flex flex-col leading-tight">
          <span class="text-[15px] font-semibold">Auto Servicios Express</span>
          <span class="text-[11px] text-slate-300">
            Calidad y Rapidez Garantizada
          </span>
        </div>
      </div>
    </header>

    <!-- MENÚ -->
    <nav class="flex-1 px-3 py-5 text-[15px]">
      <ul class="space-y-1">
        <!-- Activo -->
        <li>
          <button
            class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold"
            style="background-color:#ff6800;"
          >
            <span
              class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-black/10 text-[14px]"
              aria-hidden="true"
            >
              🏠
            </span>
            <span>Dashboard</span>
          </button>
        </li>

        <li>
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-100 hover:bg-white/5 transition-colors"
          >
            <span
              class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/5 text-[14px]"
              aria-hidden="true"
            >
              📅
            </span>
            <span>Citas</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-100 hover:bg-white/5 transition-colors"
          >
            <span
              class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/5 text-[14px]"
              aria-hidden="true"
            >
              👥
            </span>
            <span>Clientes</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-100 hover:bg-white/5 transition-colors"
          >
            <span
              class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/5 text-[14px]"
              aria-hidden="true"
            >
              🚗
            </span>
            <span>Vehículos</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-100 hover:bg-white/5 transition-colors"
          >
            <span
              class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/5 text-[14px]"
              aria-hidden="true"
            >
              🛠️
            </span>
            <span>Servicios</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-100 hover:bg-white/5 transition-colors"
          >
            <span
              class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/5 text-[14px]"
              aria-hidden="true"
            >
              📊
            </span>
            <span>Reportes</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-100 hover:bg-white/5 transition-colors"
          >
            <span
              class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/5 text-[14px]"
              aria-hidden="true"
            >
              ⚙️
            </span>
            <span>Configuración</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- USUARIO / LOGOUT (siempre abajo) -->
    <footer class="border-t border-white/10 px-5 py-4">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold"
        >
          CM
        </div>
        <div class="flex-1">
          <p class="text-[14px] font-semibold leading-tight">Carlos Mendoza</p>
          <p class="text-[11px] text-slate-300 leading-tight">
            admin@autoservicios.com
          </p>
          <button
            class="mt-1 text-[11px] font-semibold"
            style="color:#ff6800;"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </footer>
  </aside>
`;

export { adminSidebarTemplate };
export default adminSidebarTemplate;

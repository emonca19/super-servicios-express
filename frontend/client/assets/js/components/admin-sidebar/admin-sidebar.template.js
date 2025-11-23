// assets/js/components/admin-sidebar/admin-sidebar.template.js

const adminSidebarTemplate = () => `
  <aside
    class="h-screen flex flex-col text-slate-50"
    style="background-color:#101828;"
  >
    <!-- Logo / Marca -->
    <header class="flex items-center gap-3 px-5 h-20 border-b border-slate-800/60">
      <div
        class="w-11 h-11 rounded-xl flex items-center justify-center shadow-md shrink-0"
        style="background-color:#305DE9;"
      >
        <span class="font-semibold text-sm">SS</span>
      </div>
      <div class="flex flex-col leading-tight">
        <span class="font-semibold text-[13px]">Auto Servicios Express</span>
        <span class="text-[11px] text-slate-300">
          Calidad y Rapidez Garantizada
        </span>
      </div>
    </header>

    <!-- Navegación -->
    <nav
      class="flex-1 overflow-y-auto px-3 pt-4 pb-6"
      aria-label="Menú principal de administración"
    >
      <ul class="space-y-1 text-[13px]">
        <!-- Opción activa -->
        <li>
          <button
            class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium shadow-sm"
            style="background-color:#FF6800;"
          >
            <span
              class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-black/10 text-[13px]"
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
              class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-white/5 text-[13px]"
              aria-hidden="true"
            >📅</span>
            <span>Citas</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-100 hover:bg-white/5 transition-colors"
          >
            <span
              class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-white/5 text-[13px]"
              aria-hidden="true"
            >👤</span>
            <span>Clientes</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-100 hover:bg-white/5 transition-colors"
          >
            <span
              class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-white/5 text-[13px]"
              aria-hidden="true"
            >🚗</span>
            <span>Vehículos</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-100 hover:bg-white/5 transition-colors"
          >
            <span
              class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-white/5 text-[13px]"
              aria-hidden="true"
            >🛠️</span>
            <span>Servicios</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-100 hover:bg-white/5 transition-colors"
          >
            <span
              class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-white/5 text-[13px]"
              aria-hidden="true"
            >📊</span>
            <span>Reportes</span>
          </a>
        </li>

        <li>
          <a
            href="#"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-100 hover:bg-white/5 transition-colors"
          >
            <span
              class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-white/5 text-[13px]"
              aria-hidden="true"
            >⚙️</span>
            <span>Configuración</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Usuario -->
    <footer class="border-t border-slate-800/70 px-4 py-4">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold"
            style="background-color:#305DE9;"
          >
            CM
          </div>
        </div>
        <div class="flex flex-col text-[11px] leading-tight">
          <span class="font-semibold text-slate-50">Carlos Mendoza</span>
          <span style="color:#4A5A65;">admin@autoservicios.com</span>
          <button
            class="mt-1 text-[11px] font-medium"
            style="color:#F54A00;"
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

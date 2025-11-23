// assets/js/microfrontends/admin-dashboard/dashboard.template.js

const dashboardTemplate = (state = {}) => {
  const {
    loading = false,
    error = null,
    summary = {},
    appointments = [],
  } = state;

  const citas = summary.appointmentsToday ?? 12;
  const diff = summary.appointmentsDiff ?? 2;
  const income = summary.incomeToday ?? 2450;
  const incomeVar = summary.incomeVariation ?? 15;
  const newClients = summary.newClients ?? 8;
  const occupancy = summary.occupancy ?? 85;
  const occupancyLabel = summary.occupancyLabel ?? "Capacidad actual";

  const diffLabel = diff >= 0 ? `+${diff} desde ayer` : `${diff} vs ayer`;
  const incomeVarLabel =
    incomeVar >= 0 ? `+${incomeVar}% vs ayer` : `${incomeVar}% vs ayer`;

  const statusBadge = (estado) => {
    const st = (estado || "").toLowerCase();
    if (st.includes("complet")) {
      return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Completada</span>`;
    }
    if (st.includes("proceso") || st.includes("progress")) {
      return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">En Proceso</span>`;
    }
    if (st.includes("cancel")) {
      return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Cancelada</span>`;
    }
    return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">${estado ||
      "Pendiente"}</span>`;
  };

  const rows =
    appointments.length === 0 && !loading
      ? `<tr>
          <td colspan="6" class="px-6 py-6 text-center text-sm text-slate-500">
            No hay citas registradas para hoy.
          </td>
        </tr>`
      : appointments
          .map((cita, index) => {
            const hora =
              cita.hora ||
              (index === 0
                ? "09:00 AM"
                : index === 1
                ? "10:30 AM"
                : index === 2
                ? "12:00 PM"
                : "02:30 PM");
            return `
          <tr class="border-t border-slate-100 hover:bg-slate-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-xs font-semibold text-blue-600">${hora}</span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-800">${cita.cliente ||
              "Cliente"}</td>
            <td class="px-6 py-4 text-sm text-slate-600">${cita.vehiculo ||
              "Vehículo"}</td>
            <td class="px-6 py-4 text-sm text-slate-600">${cita.servicio ||
              "Servicio"}</td>
            <td class="px-6 py-4">
              ${statusBadge(cita.estado)}
            </td>
            <td class="px-6 py-4 space-x-2 whitespace-nowrap">
              <button class="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100">Editar</button>
              <button class="px-3 py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700">Detalles</button>
              <button class="px-3 py-1.5 text-xs rounded-lg bg-rose-500 text-white hover:bg-rose-600">Cancelar</button>
            </td>
          </tr>
        `;
          })
          .join("");

  return `
    <div class="min-h-screen flex flex-col">
      <!-- Top bar -->
      <header class="h-16 flex items-center justify-between px-6 lg:px-10 border-b border-slate-200 bg-white">
        <div>
          <h1 class="text-lg lg:text-xl font-semibold text-slate-900">Dashboard</h1>
          <p class="text-xs lg:text-sm text-slate-500">Resumen de la operación del día</p>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-xs text-slate-500">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Hoy es ${new Date().toLocaleDateString("es-MX", {
              weekday: "long",
              day: "2-digit",
              month: "short",
            })}</span>
          </div>

          <button class="relative p-2 rounded-full hover:bg-slate-100">
            <span class="sr-only">Notificaciones</span>
            <span class="w-5 h-5 inline-flex items-center justify-center text-slate-500">🔔</span>
            <span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 border border-white"></span>
          </button>

          <div class="flex items-center gap-2">
            <span class="hidden sm:block text-xs text-right">
              <span class="block font-medium text-slate-800">Carlos Mendoza</span>
              <span class="block text-slate-400">Administrador</span>
            </span>
            <img
              src="/assets/images/photo.png"
              alt="Administrador"
              class="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
          </div>
        </div>
      </header>

      <!-- Contenido -->
      <section class="flex-1 px-4 lg:px-10 py-6 space-y-6">
        <!-- Tarjetas resumen -->
        <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6" aria-label="Resumen del día">
          <!-- Citas hoy -->
          <article class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 lg:p-5 flex flex-col justify-between">
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Citas hoy</p>
                <p class="text-2xl font-semibold text-slate-900 mt-2" data-field="citas-hoy">${citas}</p>
                <p class="text-[11px] text-emerald-600 mt-1" data-field="citas-diff">${diffLabel}</p>
              </div>
              <div class="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 text-lg">
                📅
              </div>
            </div>
          </article>

          <!-- Ingresos hoy -->
          <article class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 lg:p-5 flex flex-col justify-between">
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Ingresos hoy</p>
                <p class="text-2xl font-semibold text-slate-900 mt-2" data-field="ingresos-hoy">$${income.toLocaleString("es-MX")}</p>
                <p class="text-[11px] text-emerald-600 mt-1" data-field="ingresos-var">${incomeVarLabel}</p>
              </div>
              <div class="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-lg">
                💲
              </div>
            </div>
          </article>

          <!-- Clientes nuevos -->
          <article class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 lg:p-5 flex flex-col justify-between">
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Clientes nuevos</p>
                <p class="text-2xl font-semibold text-slate-900 mt-2" data-field="clientes-nuevos">${newClients}</p>
                <p class="text-[11px] text-slate-500 mt-1">Esta semana</p>
              </div>
              <div class="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-lg">
                👤
              </div>
            </div>
          </article>

          <!-- Ocupación -->
          <article class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 lg:p-5 flex flex-col justify-between">
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Ocupación</p>
                <p class="text-2xl font-semibold text-slate-900 mt-2" data-field="ocupacion">${occupancy}%</p>
                <p class="text-[11px] text-slate-500 mt-1">${occupancyLabel}</p>
              </div>
              <div class="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 text-lg">
                📈
              </div>
            </div>
          </article>
        </section>

        <!-- Citas Programadas -->
        <section class="space-y-4" aria-label="Citas programadas hoy">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h2 class="text-base lg:text-lg font-semibold text-slate-900">Citas Programadas Hoy</h2>
              <p class="text-xs lg:text-sm text-slate-500">Gestiona las citas del día</p>
            </div>
            <button class="px-4 py-2 text-xs font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600">
              + Nueva cita
            </button>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full text-left text-sm">
                <thead class="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th class="px-6 py-3 font-medium">Hora</th>
                    <th class="px-6 py-3 font-medium">Cliente</th>
                    <th class="px-6 py-3 font-medium">Vehículo</th>
                    <th class="px-6 py-3 font-medium">Servicio</th>
                    <th class="px-6 py-3 font-medium">Estado</th>
                    <th class="px-6 py-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody data-field="appointments-body">
                  ${loading
                    ? `<tr>
                        <td colspan="6" class="px-6 py-6 text-center text-sm text-slate-500">
                          <span class="inline-flex items-center gap-2">
                            <span class="w-4 h-4 rounded-full border-2 border-slate-300 border-t-transparent animate-spin"></span>
                            Cargando citas...
                          </span>
                        </td>
                      </tr>`
                    : rows}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Multimedia / banner -->
        <section class="mt-4">
          <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-50 p-5 lg:p-6 flex flex-col md:flex-row gap-4 md:items-center">
            <div class="flex-1">
              <h3 class="text-sm lg:text-base font-semibold mb-1">
                Tip rápido: mantén informados a tus clientes
              </h3>
              <p class="text-xs lg:text-sm text-slate-300">
                Puedes enviar recordatorios de cita por WhatsApp o correo para reducir cancelaciones de última hora.
              </p>
            </div>
            <video
              class="w-full md:w-48 rounded-xl border border-slate-700"
              autoplay
              muted
              loop
              playsinline
            >
              <source src="" type="video/mp4" />
              Tu navegador no soporta la reproducción de video.
            </video>
          </div>
        </section>
      </section>

      ${error
        ? `<div class="px-4 lg:px-10 pb-6">
            <p class="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 inline-flex items-center gap-2">
              <span>⚠️</span>
              <span>Error cargando datos del dashboard: ${error}</span>
            </p>
          </div>`
        : ""}
    </div>
  `;
};

export { dashboardTemplate };
export default dashboardTemplate;

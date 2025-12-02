// admin/assets/js/admin-entry.js

const globalModulesPromise = Promise.all([
  import("../components/sidebar/index.js"),
  import("../components/navbar/index.js"),
  import("../components/table/index.js"),
]);

const pageLoaders = {
  dashboard: () => import("../microfrontends/dashboard/index.js"),
  appointments: () => import("../microfrontends/appointments/index.js"),
  clients: () => import("../microfrontends/users/index.js"),
  services: () => import("../microfrontends/services-page/index.js"),
  vehicles: () => import("../microfrontends/vehicles/index.js"),
};

// Animación de entrada del contenido actual del <main>
function runPageTransition() {
  const main = document.querySelector("main[data-page]");
  if (!main) return;

  const content = main.firstElementChild;
  if (!content) return;

  // le aplicamos la clase que dispara la animación
  content.classList.add("page-transition-enter");

  // cuando termina la animación, limpiamos la clase
  content.addEventListener(
    "animationend",
    () => {
      content.classList.remove("page-transition-enter");
    },
    { once: true }
  );
}

(async () => {
  try {
    // Esperar a los componentes globales
    await globalModulesPromise;

    const main = document.querySelector("main[data-page]");
    const page = main?.dataset.page;

    if (page && pageLoaders[page]) {
      await pageLoaders[page]();
      console.log(`[admin] Microfront '${page}' cargado`);

      // disparar animación de entrada
      runPageTransition();
    } else {
      console.warn("[admin] No loader definido para la página:", page);
    }
  } catch (error) {
    console.error("[admin] Error cargando admin:", error);
  }

  // Listener global del modo slim
  document.addEventListener("sidebar:modechange", (e) => {
    const slim = e.detail.slim;
    document.body.classList.toggle("slim", slim);
    console.log("Sidebar mode changed:", slim ? "slim" : "normal");
  });
})();

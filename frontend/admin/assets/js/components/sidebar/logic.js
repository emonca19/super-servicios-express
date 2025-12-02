// assets/js/components/sidebar/logic.js
export class AdminSidebarLogic {

  static highlightCurrentPage(root) {
    let currentKey = "";

    const main = document.querySelector("main[data-page]");
    if (main && main.dataset.page) {
      currentKey = main.dataset.page.toLowerCase(); 
    } else {
      try {
        const path = window.location.pathname;            
        const file = path.split("/").pop() || "";          
        currentKey = file.replace(".html", "").toLowerCase();
      } catch (e) {
        console.warn("[sidebar] no se pudo leer window.location", e);
      }
    }

    if (!currentKey) {
      currentKey = "dashboard";
    }

    console.log("[sidebar] currentKey:", currentKey);

    const navItems = root.querySelectorAll(".nav-list .nav-item");
    navItems.forEach((item) => item.classList.remove("active"));

    let found = false;

    navItems.forEach((item) => {
      const dataPage = (item.dataset.page || "").toLowerCase();  
      const href = (item.getAttribute("href") || "").toLowerCase(); 
      const keyFromHref = href.replace(".html", "");             

      if (dataPage === currentKey || keyFromHref === currentKey) {
        item.classList.add("active");
        found = true;
        console.log("[sidebar] activando item:", href || dataPage);
      }
    });

    if (!found) {
      console.warn("[sidebar] ninguna opción coincidió, usando dashboard por defecto");
      const dashboardItem =
        root.querySelector('.nav-item[data-page="dashboard"]') ||
        root.querySelector('.nav-item[href="dashboard.html"]');

      if (dashboardItem) {
        dashboardItem.classList.add("active");
      }
    }
  }
}

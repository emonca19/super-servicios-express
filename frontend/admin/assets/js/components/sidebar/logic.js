export const AdminSidebarLogic = {
  highlightCurrentPage(root) {
    const links = root.querySelectorAll(".nav-item");
    const current = location.pathname.split("/").pop();

    links.forEach(link => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === current);
    });
  }
};

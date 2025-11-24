export const AdminTableLogic = {
 
  normalizeColumns(columns) {
    if (!Array.isArray(columns)) return [];
    return columns.map(col => ({
      type: "text",
      ...col,
    }));
  },

 
  getBadgeClass(value = "") {
    const v = String(value).toLowerCase().trim();

    if (v.includes("complet")) return "badge--completed";
    if (v.includes("proceso") || v.includes("process")) return "badge--in-process";
    if (v.includes("pend")) return "badge--pending";

    return "badge--default";
  },

 
  getActionsForColumn(column) {
    if (Array.isArray(column.actions) && column.actions.length > 0) {
      return column.actions;
    }

    return [
      { key: "edit", label: "Editar", variant: "primary" },
      { key: "details", label: "Detalles", variant: "dark" },
      { key: "cancel", label: "Cancelar", variant: "danger" },
    ];
  }
};

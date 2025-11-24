import { AdminTableLogic } from "./logic.js";

const escapeHtml = (value) => {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

const renderCell = (col, row, rowIndex) => {
  const key = col.key;
  const value = row[key];

  switch (col.type) {
    case "badge": {
      const badgeClass = AdminTableLogic.getBadgeClass(value);
      return `
        <td>
          <span class="badge ${badgeClass}">
            ${escapeHtml(value)}
          </span>
        </td>
      `;
    }

    case "switch": {
      const checked = Boolean(value);
      return `
        <td>
          <label class="switch">
            <input 
              type="checkbox" 
              data-type="switch" 
              data-key="${key}" 
              data-row="${rowIndex}"
              ${checked ? "checked" : ""} />
            <span class="slider"></span>
          </label>
        </td>
      `;
    }

    case "actions": {
      const actions = AdminTableLogic.getActionsForColumn(col);
      return `
        <td class="actions-cell">
          ${actions
            .map(
              (a) => `
            <button
              class="btn btn--${a.variant}"
              data-type="action"
              data-action="${a.key}"
              data-row="${rowIndex}"
            >
              ${escapeHtml(a.label)}
            </button>
          `
            )
            .join("")}
        </td>
      `;
    }

    case "text":
    default: {
      return `
        <td>${escapeHtml(value)}</td>
      `;
    }
  }
};

export const adminTableTemplate = (columns = [], rows = []) => {
  const normalizedCols = AdminTableLogic.normalizeColumns(columns);

  return `
    <div class="table-shell">
      <table class="admin-table">
        <thead>
          <tr>
            ${normalizedCols
              .map(
                (col) => `
              <th>${escapeHtml(col.label ?? col.key ?? "")}</th>
            `
              )
              .join("")}
          </tr>
        </thead>

        <tbody>
          ${rows
            .map(
              (row, rowIndex) => `
            <tr>
              ${normalizedCols
                .map((col) => renderCell(col, row, rowIndex))
                .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
};

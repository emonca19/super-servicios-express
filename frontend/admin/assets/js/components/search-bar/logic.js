export const AdminSearchLogic = {
  normalize(q) {
    if (!q) return "";
    return q.trim().toLowerCase();
  }
};

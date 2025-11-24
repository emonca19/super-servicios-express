export const AdminNavbarLogic = {

  onNotificationClick(callback) {
    try {
      callback?.();
    } catch (error) {
      console.error("[AdminNavbarLogic] Error en callback de notificaciones:", error);
    }
  }

};

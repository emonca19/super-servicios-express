/**
 * Helpers para LocalStorage y SessionStorage
 */

export const storage = {
  // LocalStorage
  local: {
    set(key, value) {
      try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
      }
    },

    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
      }
    },

    remove(key) {
      localStorage.removeItem(key);
    },

    clear() {
      localStorage.clear();
    },
  },

  // SessionStorage
  session: {
    set(key, value) {
      try {
        const serialized = JSON.stringify(value);
        sessionStorage.setItem(key, serialized);
        return true;
      } catch (error) {
        console.error('Error saving to sessionStorage:', error);
        return false;
      }
    },

    get(key, defaultValue = null) {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error reading from sessionStorage:', error);
        return defaultValue;
      }
    },

    remove(key) {
      sessionStorage.removeItem(key);
    },

    clear() {
      sessionStorage.clear();
    },
  },
};

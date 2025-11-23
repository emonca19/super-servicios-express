/**
 * Funciones de validación reutilizables
 */

export const validators = {
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPhone(phone) {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  },

  isValidName(name) {
    return name.trim().length >= 3;
  },

  isValidPlates(plates) {
    return plates.trim().length >= 3 && plates.trim().length <= 10;
  },

  isValidDate(date) {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return selectedDate >= today;
  },

  isValidYear(year) {
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    return yearNum >= currentYear - 30 && yearNum <= currentYear;
  },
};

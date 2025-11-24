import './auth-modal.js';

// Initialize auth module
console.log('[Auth Microfrontend] Loaded');

// Helper to open auth modal programmatically if needed
export const openAuth = (mode = 'login') => {
    window.dispatchEvent(new CustomEvent('open-auth', { detail: mode }));
};

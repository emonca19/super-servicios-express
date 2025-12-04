import './auth-modal.js';


export const openAuth = (mode = 'login') => {
    window.dispatchEvent(new CustomEvent('open-auth', { detail: mode }));
};

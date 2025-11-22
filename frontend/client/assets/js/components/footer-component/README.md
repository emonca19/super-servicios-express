footer-component

- `footer-component.js` — componente con DOM.
- `logic.js` — utilidades puras (fecha, sanitización) para testeo.
- `index.js` — barrel para exportaciones.

Mover funciones puras a `logic.js` reduce la superficie que necesita un DOM real en tests.

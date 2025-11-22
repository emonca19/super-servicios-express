Appointment Shell

- `appointment-shell.component.js` — Shell del microfrontend de citas (composición de componentes y UI flow).
- `logic.js` — utilidades puras relacionadas con slots y formateo.
- `index.js` — barrel del shell (ya existe).

Mover funciones puras a `logic.js` permite unit testing sin DOM.

Popular Services

- `popular-services.component.js` — muestra los servicios más populares.
- `popular-services.defaults.js` — valores por defecto.
- `logic.js` — utilidades para normalizar y seleccionar los top N servicios.
- `index.js` — barrel (ya existe).

Beneficio: mover la normalización a `logic.js` facilita pruebas sin montar el componente.

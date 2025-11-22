assets/js

Estructura y flujo:

- `assets/js/components` — componentes UI (cada uno en su carpeta con `component.js`, `template.js`, `styles.js`, `logic.js` y `index.js`).
- `assets/js/services` — capa de servicios (API clients, wrappers, servicios por dominio).
- `assets/js/microfrontends` — agrupaciones por flujo de producto (home, appointments, account). Cada microfrontend debe exportar su API pública desde `index.js`.
- `assets/js/utils` — utilidades de bajo nivel (ej: `shadow-style-loader.js`).

Reglas sencillas (para principiantes):
- Si es UI, va dentro de `components/<nombre>`.
- Si es lógica de negocio o llamadas a API, va dentro de `services`.
- Si agrupa pages o flows, crea `microfrontends/<flow>`.

Importación recomendada:
```js
import { AppointmentForm } from '/assets/js/components/index.js';
import { apiClient } from '/assets/js/services/index.js';
import { AppointmentShell } from '/assets/js/microfrontends/index.js';
```

Si quieres, puedo ahora reescribir las importaciones existentes para que apunten a estos barrels (operación automática).
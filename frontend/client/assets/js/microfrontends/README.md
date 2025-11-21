Microfrontends

Descripción:
- Cada microfrontend agrupa componentes, vistas y shell relacionados por un flujo (ej: `appointments`, `home`, `account`).
- Usa el `index.js` en cada carpeta para exportar lo necesario.

Estructura recomendada:
- `microfrontends/<name>/index.js` — barrel del microfrontend.
- `microfrontends/<name>/*` — componentes y subcarpetas (shell, widgets, etc.).

Importación:
```js
import { /* whatever */ } from '/assets/js/microfrontends/index.js';
```

Beneficios:
- Organización por flujo de producto (fácil de entender para principiantes).
- Reusabilidad y aislamiento.

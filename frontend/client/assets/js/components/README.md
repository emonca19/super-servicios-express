Estructura de `assets/js/components`

Descripción:
- Cada componente está en su propia carpeta con: `*.component.js`, `*.template.js`, `*.styles.js`.
- `index.js` actúa como punto de acceso (barrel) para importar los componentes desde un solo lugar.

Ejemplo de uso en HTML (módulos ES):

```html
<script type="module">
  import { AppointmentForm, HeaderComponent } from '/assets/js/components/index.js';

  // Si los componentes se registran automáticamente (customElements.define en su fichero), puedes
  // simplemente añadir las etiquetas al DOM:
  document.body.insertAdjacentHTML('beforeend', '<header-component></header-component>');
  document.body.insertAdjacentHTML('beforeend', '<appointment-form></appointment-form>');
</script>
```

Buenas prácticas:
- Mantén la lógica del componente en `*.component.js` y la plantilla/estilos separados.
- Usa `index.js` para centralizar re-exports y facilitar refactors.
- Si agregas nuevos componentes, crea una carpeta con nombre claro y añade la exportación al `index.js`.

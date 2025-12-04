appointment-form

Estructura propuesta:
- `appointment-form.component.js` — Componente Web (DOM + lifecycle).
- `appointment-form.template.js` — HTML template puro.
- `appointment-form.styles.js` — CSS / estilos encapsulados.
- `logic.js` — Funciones puras y utilitarias (formateo, validaciones sin DOM).
- `index.js` — Barrel (ya existe) para exportar el componente.

Uso:
- Mantén la lógica que necesita DOM dentro del componente.
- Mueve funciones puras o de transformación al archivo `logic.js`.
- Esto facilita cubrir la lógica con pruebas unitarias sin montar el componente.

Notas para principiantes:
- Para usar el componente en una página HTML solo inserta: `<appointment-form></appointment-form>`.
- Si quieres modificar la apariencia, edita `appointment-form.styles.js`.
- Si necesitas cambiar lógica (por ejemplo cómo se filtran horarios), modifica `logic.js`.
- Evita mezclar lógica DOM con funciones puras: mantiene el código más fácil de probar.

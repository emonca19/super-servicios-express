Estructura de `assets/js/services`

- `api-client.js`: Cliente HTTP pequeño que encapsula `fetch`, manejo de tokens y errores.
- `appointments.service.js`: Lógica para crear y validar citas.
- `services.service.js`: Lógica para obtener servicios y cache simple.
- `index.js`: "barrel" que exporta las piezas principales para importar desde un solo lugar.

Uso (módulos ES):

```html
<script type="module">
  import { apiClient, AppointmentsService, ServicesService } from '/assets/js/services/index.js';

  const svc = new ServicesService();
  svc.getAll().then(console.log).catch(console.error);
</script>
```

Consejos:
- Mantén las importaciones desde `assets/js/services/index.js` para simplificar referencias.
- Si usas bundler, apunta al fichero `index.js` del directorio `services`.

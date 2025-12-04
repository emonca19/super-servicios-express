import { safeJsonParse } from './logic.js';

export class VehicleManager {
    constructor(componentRoot, apiClient) {
        this.root = componentRoot;
        this.apiClient = apiClient;
        this.vehiclesLoaded = false;
    }

    async loadSavedVehicles(force = false) {
        if (this.vehiclesLoaded && !force) return;

        try {
            const list = await this.apiClient.get('/automoviles/mine');
            const possibleArrays = list && (list.data || list.result || list.rows || list.vehicles || list.autos);
            const raw = Array.isArray(possibleArrays) ? possibleArrays : (Array.isArray(list) ? list : (Array.isArray(list?.data) ? list.data : []));
            const autos = raw.filter(x => x && typeof x === 'object');

            if (autos.length === 0) {
                this.vehiclesLoaded = true;
                return;
            }

            // Remove existing if any
            const existing = this.root.querySelector('#saved-vehicles-container');
            if (existing) existing.remove();

            const uniqueId = 'saved-vehicles-container';
            const container = document.createElement('div');
            container.id = uniqueId;
            container.className = 'mb-6 vehicle-selector-unique p-4 bg-blue-50 rounded-lg border border-blue-100';
            container.dataset.vehicleContainer = 'true';

            const label = document.createElement('label');
            label.className = 'block text-sm font-semibold text-blue-800 mb-2';
            label.textContent = 'Mis vehículos guardados';

            const sel = document.createElement('select');
            sel.className = 'w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white';
            sel.innerHTML = `<option value="">Selecciona un vehículo guardado</option>`;

            autos.forEach((a) => {
                const opt = document.createElement('option');
                opt.value = a.id_auto || a.id || a._id;
                opt.textContent = `${(a.placas || '--').toUpperCase()} — ${a.marca || ''} ${a.modelo || ''} ${a.anio || ''}`;
                opt.dataset.auto = JSON.stringify(a);
                sel.appendChild(opt);
            });

            sel.addEventListener('change', (ev) => {
                const v = ev.target.value;
                if (!v) return;
                const opt = ev.target.options[ev.target.selectedIndex];
                try {
                    const auto = safeJsonParse(opt.dataset.auto, null);
                    if (auto) this.applyVehicleToForm(auto);
                } catch (e) { }
            });

            container.appendChild(label);
            container.appendChild(sel);

            // Insert after the legend of the second fieldset (Vehicle Info)
            const vehicleSection = this.root.querySelector('fieldset:nth-of-type(2)');
            if (vehicleSection) {
                const legend = vehicleSection.querySelector('legend');
                if (legend) {
                    legend.insertAdjacentElement('afterend', container);
                } else {
                    vehicleSection.insertBefore(container, vehicleSection.firstChild);
                }
            }

            this.vehiclesLoaded = true;
        } catch (e) {
            console.error('[VehicleManager] Error loading saved vehicles:', e);
        }
    }

    applyVehicleToForm(auto) {
        try {
            const mapping = {
                marca: auto.marca,
                modelo: auto.modelo,
                ano: auto.anio || auto.anio,
                color: auto.color,
                placas: auto.placas,
            };

            // Special handling for select elements (marca, ano)
            const marcaSelect = this.root.querySelector('#appointment-marca');
            if (marcaSelect && mapping.marca) {
                marcaSelect.value = mapping.marca;
                // If value not in options (e.g. "Otra"), try to set it or leave as is
                if (marcaSelect.value !== mapping.marca) {
                    // Logic for custom brands could go here
                }
            }

            // Special handling for year select
            const yearSelect = this.root.querySelector('#ano-select');
            if (yearSelect && mapping.ano) {
                yearSelect.value = mapping.ano;
            }

            Object.entries(mapping).forEach(([k, v]) => {
                if (v === undefined || v === null) return;
                // Skip selects as we handled them manually or they might be inputs in some versions
                if (k === 'marca' || k === 'ano') return;

                const el = this.root.querySelector(`[name="${k}"]`);
                if (el) {
                    try { el.value = String(v); } catch (e) { }
                }
            });

            if (auto.id_auto || auto.id) this.setHiddenAutoId(auto.id_auto || auto.id);
        } catch (e) {
            console.error('[VehicleManager] Error applying vehicle:', e);
        }
    }

    setHiddenAutoId(id) {
        try {
            const form = this.root.querySelector('#appointment-form');
            if (!form) return;
            let hid = form.querySelector('input[name="id_auto"][type="hidden"]');
            if (!hid) {
                hid = document.createElement('input');
                hid.type = 'hidden';
                hid.name = 'id_auto';
                form.appendChild(hid);
            }
            hid.value = String(id);
        } catch (e) { }
    }
}

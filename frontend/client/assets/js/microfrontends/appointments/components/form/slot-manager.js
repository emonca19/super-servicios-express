import {
    formatDisplayHour,
    getDefaultSlots,
    filterSaturdaySlots,
    isSunday,
    isSaturday
} from './logic.js';

export class SlotManager {
    constructor(componentRoot, appointmentsService, apiClient) {
        this.root = componentRoot;
        this.appointmentsService = appointmentsService;
        this.apiClient = apiClient;
    }

    async updateAvailableSlots() {
        try {
            const dateEl = this.root.querySelector('#appointment-fecha');
            const horaEl = this.root.querySelector('#appointment-hora');
            const serviceEl = this.root.querySelector('#servicio-select') || this.root.querySelector('#appointment-servicio');

            if (!horaEl) return;
            const date = dateEl ? dateEl.value : null;
            const serviceId = serviceEl ? serviceEl.value : null;

            this.resetTimeSelect(horaEl);

            if (!date) {
                this.addOption(horaEl, '', 'Selecciona una fecha primero', true);
                return;
            }

            if (this.handleSunday(date, dateEl, horaEl)) return;

            // Get slots
            let slots = await this.fetchSlots(date, serviceId);

            // Filter Saturday
            if (isSaturday(date)) {
                slots = filterSaturdaySlots(slots);
            }

            // Filter conflicts and past times
            const existingCitas = await this.fetchExistingAppointments();
            const durationMin = Number(this.root.querySelector('#appointment-duracion')?.value) || 60;

            this.renderSlots(horaEl, slots, date, existingCitas, durationMin);

        } catch (error) {
            console.error('[SlotManager] Error updating slots:', error);
        }
    }

    resetTimeSelect(select) {
        select.innerHTML = '';
        this.addOption(select, '', 'Selecciona hora');
    }

    addOption(select, value, text, disabled = false) {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = text;
        if (disabled) opt.disabled = true;
        select.appendChild(opt);
        return opt;
    }

    handleSunday(date, dateEl, horaEl) {
        if (isSunday(date)) {
            if (dateEl) {
                dateEl.value = '';
                dateEl.classList.add('border-red-500');
                setTimeout(() => dateEl.classList.remove('border-red-500'), 2500);
            }
            horaEl.innerHTML = '';
            this.addOption(horaEl, '', 'No se pueden agendar citas los domingos', true);
            return true;
        }
        return false;
    }

    async fetchSlots(date, serviceId) {
        try {
            return await this.appointmentsService.getAvailableSlots(date, serviceId);
        } catch (err) {
            console.warn('[SlotManager] getAvailableSlots failed, using defaults', err);
            return getDefaultSlots();
        }
    }

    async fetchExistingAppointments() {
        try {
            const resp = await this.apiClient.get('/citas/mine');
            const raw = resp?.data || resp || [];
            const list = Array.isArray(raw) ? raw : (Array.isArray(resp) ? resp : []);
            return list.filter(c => {
                const st = (c.estado || '').toString().toUpperCase();
                return st !== 'CANCELADA' && st !== 'CANCELLED';
            });
        } catch (err) {
            return [];
        }
    }

    renderSlots(select, slots, date, existingCitas, durationMin) {
        const now = new Date();
        const marginMs = 30 * 60000;
        const isToday = this.checkIsToday(date, now);

        slots.forEach((slot) => {
            const slotDate = new Date(`${date}T${slot}:00`);
            const slotEnd = new Date(slotDate.getTime() + durationMin * 60000);
            const option = this.addOption(select, slot, formatDisplayHour(slot));

            // Check past time if today
            if (isToday && slotDate.getTime() <= (now.getTime() + marginMs)) {
                option.disabled = true;
                option.className = 'opacity-50 bg-gray-100';
                option.textContent += ' (No disponible)';
            }

            // Check conflicts
            for (const c of existingCitas) {
                const cInicio = c.inicio ? new Date(c.inicio) : null;
                const cFin = c.fin ? new Date(c.fin) : null;
                if (!cInicio || !cFin) continue;

                if (slotDate.getTime() < cFin.getTime() && slotEnd.getTime() > cInicio.getTime()) {
                    option.disabled = true;
                    option.className = 'opacity-50 bg-red-50';
                    option.textContent += ' (Ocupado)';
                    break;
                }
            }
        });
    }

    checkIsToday(dateStr, now) {
        try {
            const [y, m, d] = dateStr.split('-').map(Number);
            return y === now.getFullYear() && m === (now.getMonth() + 1) && d === now.getDate();
        } catch (e) { return false; }
    }
}

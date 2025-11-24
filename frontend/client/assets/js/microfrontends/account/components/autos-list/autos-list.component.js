import { injectStyles } from '../../../../utils/shadow-style-loader.js';
import { autosListTemplate } from './autos-list.template.js';
import { autosListStyles } from './autos-list.styles.js';

class AutosList extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this._autos = [];
        this._currentPage = 1;
        this._pageSize = 3;
        this._filter = '';
    }

    static get observedAttributes() {
        return ['autos-data'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'autos-data' && oldValue !== newValue) {
            try {
                this._autos = JSON.parse(newValue) || [];
                this.render();
            } catch (e) {
                console.warn('[autos-list] Invalid autos data', e);
            }
        }
    }

    set autos(data) {
        this._autos = data || [];
        this.render();
    }

    get autos() {
        return this._autos;
    }

    async connectedCallback() {
        await this.render();
    }

    getFilteredAutos() {
        let filtered = this._autos;
        if (this._filter) {
            const q = this._filter.toLowerCase();
            filtered = filtered.filter(a => {
                const parts = [a.marca, a.modelo, a.placas, a.color].filter(Boolean).map(x => String(x).toLowerCase());
                return parts.some(p => p.includes(q));
            });
        }
        return filtered;
    }

    getPaginatedAutos(filtered) {
        const start = (this._currentPage - 1) * this._pageSize;
        return filtered.slice(start, start + this._pageSize);
    }

    async render() {
        this.root.innerHTML = '';
        await injectStyles(this.root, autosListStyles);

        const filtered = this.getFilteredAutos();
        const totalPages = Math.max(1, Math.ceil(filtered.length / this._pageSize));

        if (this._currentPage > totalPages) this._currentPage = totalPages;

        const paginated = this.getPaginatedAutos(filtered);

        const container = document.createElement('div');
        container.innerHTML = autosListTemplate(paginated, this._currentPage, totalPages, this._filter);
        this.root.appendChild(container);

        this.setupEventListeners();
    }

    setupEventListeners() {
        const searchInput = this.root.querySelector('#autos-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this._filter = e.target.value;
                this._currentPage = 1;
                this.render();
            });
            searchInput.focus();
            // Restore cursor position logic if needed, but simple re-render might lose focus/cursor
            // For a better UX in a real app, we'd update DOM diffs, but here we just re-render.
            // To keep focus:
            setTimeout(() => {
                const newInput = this.root.querySelector('#autos-search');
                if (newInput) {
                    newInput.focus();
                    newInput.setSelectionRange(newInput.value.length, newInput.value.length);
                }
            }, 0);
        }

        const prevBtn = this.root.querySelector('#autos-prev');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this._currentPage > 1) {
                    this._currentPage--;
                    this.render();
                }
            });
        }

        const nextBtn = this.root.querySelector('#autos-next');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const filtered = this.getFilteredAutos();
                const totalPages = Math.max(1, Math.ceil(filtered.length / this._pageSize));
                if (this._currentPage < totalPages) {
                    this._currentPage++;
                    this.render();
                }
            });
        }

        // Add Auto Button (if present in this component, or we can leave it to parent)
        // The parent usually has the "Add New" button in the header, but we might have one in empty state.
    }
}

customElements.define('autos-list', AutosList);
export { AutosList };

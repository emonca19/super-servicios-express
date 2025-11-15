# Frontend Client - Build & Styles

This folder holds the static client for the project. By default the project used Tailwind via CDN in the HTML pages, but to follow microfrontend best practices and enable per-component encapsulation we provide a local Tailwind build you can use.

Quick setup (Windows / PowerShell):

1. Install dependencies:

```powershell
cd frontend\client
npm install
```

2. Build Tailwind once:

```powershell
npm run build:css
```

3. Development (auto rebuild CSS + serve):

```powershell
npm run watch:css
npm run dev
```

Notes:
- The compiled CSS will be generated at `assets/css/tailwind.css`.
- Components that use Shadow DOM can fetch and inject that file into their shadow root for encapsulated utilities.
- After building Tailwind you can remove the CDN `<script src="https://cdn.tailwindcss.com"></script>` from `index.html` and `agendar-cita.html` to avoid duplicate rules.

Component pattern (recommended)
---------------------------------
Create a folder per component with these files:

- `my-component.component.js` - defines the custom element. Must attach shadow root:

```js
import { injectStyles } from '../utils/shadow-style-loader.js';
import { myComponentTemplate } from './my-component.template.js';
import { myComponentStyles } from './my-component.styles.js';

class MyComponent extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: 'open' });
	}

	async connectedCallback() {
		this.root.innerHTML = '';
		await injectStyles(this.root, myComponentStyles);
		this.root.appendChild(document.createRange().createContextualFragment(myComponentTemplate()));
	}
}

customElements.define('my-component', MyComponent);
```

- `my-component.template.js` - returns HTML string. Prefer a template function that accepts data.
- `my-component.styles.js` - export `default` and named style string. Include `:host { display:block }` as best practice.

This pattern keeps each microfrontend/component isolated, loads a single compiled Tailwind file into the shadow root (if available), and provides component-scoped fallback CSS when needed.


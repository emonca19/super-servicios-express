export class HeaderComponent extends HTMLElement{
  constructor(){
    super();
  }

  conectedCallback(){
    const shadow = this.attachShadow({ mode: 'open' });
    this.#addStyles(shadow);
    this.#render(shadow);
  }

  #render(){
    shadow.innerHTML += `
      <section class="header-container">
        <img class="header-image" src="" alt="">
        <div class="title-container">
            <h1 class="title-text">Auto Servicios Express</h1>
            <h2 class="title-subtext">Calidad y Rapidez Garantizada</h2>
        </div>
        <nav class="routes-container">
            <h2 class="normal-route">inicio</h2>
            <h2 class="normal-route">Servicios</h2>
            <h2 class="normal-route">Contacto</h2>
            <h2 class="appointment-route">Agendar Cita</h2>
        </nav>
    </section>
    `;
  }

  #addStyles(){
    let link = document.createAttribute('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', './Header/Header.css');
    shadow.appendChild(link);
  }
}
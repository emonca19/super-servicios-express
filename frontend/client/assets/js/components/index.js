// Barrel for web components — re-export the most used custom elements and helpers
export { default as AppointmentForm } from './appointment-form/appointment-form.component.js';
export { default as ContactComponent } from './contact/contact-component.js';
export { default as FeatureCard } from './feature-card/feature-card.js';
export { default as FooterComponent } from './footer-component/footer-component.js';
export { default as HeaderComponent } from './header/header-component.js';
export { default as ServiceCard } from './service-card/service-card.js';
export { default as UbicacionComponent } from './ubicacion/ubicacion-component.js';

// Also re-export templates/styles that may be useful
export * from './appointment-form/appointment-form.template.js';
export * from './appointment-form/appointment-form.styles.js';

// Default export for convenience
export default {
  AppointmentForm,
  ContactComponent,
  FeatureCard,
  FooterComponent,
  HeaderComponent,
  ServiceCard,
  UbicacionComponent,
};

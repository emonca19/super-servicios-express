// assets/js/components/admin-sidebar/admin-sidebar.styles.js

const adminSidebarStyles = `
  :host {
    display: none;
  }

  @media (min-width: 1024px) {
    :host {
      display: block;
      width: 260px;   /* ancho similar al mockup */
      flex-shrink: 0;
    }
  }

  aside {
    position: sticky;
    top: 0;
    background-color: #101828;
    color: #ffffff;
  }
`;

export { adminSidebarStyles };
export default adminSidebarStyles;

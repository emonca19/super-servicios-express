export class AdminSidebarLogic {
  static highlightCurrentPage(root) {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    console.log('Current page:', currentPage); 
    
    const navItems = root.querySelectorAll('.nav-list .nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    let foundActive = false;
    
    navItems.forEach(item => {
      const link = item.getAttribute('href');
      console.log('Checking link:', link, 'against current:', currentPage); 
      
      if (link === currentPage) {
        item.classList.add('active');
        foundActive = true;
        console.log('Active item found:', link);
      }
    });
    
    if (!foundActive) {
      console.log('No direct match found, trying alternative methods...');
      
      navItems.forEach(item => {
        const link = item.getAttribute('href');
        const linkName = link.replace('.html', '');
        if (currentPage.includes(linkName)) {
          item.classList.add('active');
          foundActive = true;
          console.log('Found partial match:', link);
        }
      });
      
      if (!foundActive) {
        const dashboardItem = root.querySelector('a[href="dashboard.html"]');
        if (dashboardItem) {
          dashboardItem.classList.add('active');
          console.log('Defaulting to dashboard');
        }
      }
    }
  }
}
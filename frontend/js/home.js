document.addEventListener('DOMContentLoaded', () => {
    const searchIcon = document.getElementById('searchIcon');
    const banner = document.getElementById('banner');
  
    searchIcon.addEventListener('click', () => {
      if (banner.classList.contains('show')) {
        banner.classList.remove('show');
      } else {
        banner.classList.add('show');
      }
    });
  });
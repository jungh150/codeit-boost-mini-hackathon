document.addEventListener('DOMContentLoaded', function() {
    const myPageLink = document.querySelector('.myPage');

    myPageLink.addEventListener('click', function() {
        window.location.href = '../마이페이지/index.html';
    });
});

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
document.addEventListener('DOMContentLoaded', function() {
    const myPageLink = document.querySelector('.myPage');
    const searchIcon = document.getElementById('searchIcon');
    const banner = document.getElementById('banner');

    myPageLink.addEventListener('click', function() {
        window.location.href = '../html/mypage.html'; // 클릭 시 페이지 이동
    });

    searchIcon.addEventListener('click', () => {
        if (banner.classList.contains('show')) {
            banner.classList.remove('show');
        } else {
            banner.classList.add('show');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const myPageLink = document.querySelector('.myPage');

    myPageLink.addEventListener('click', function() {
        window.location.href = '../마이페이지/index.html';
    });
});
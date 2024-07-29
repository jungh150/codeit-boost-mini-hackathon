document.addEventListener('DOMContentLoaded', function() {
    // 기존 페이지 액션들
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

    // Flatpickr 설정
    const datePicker = flatpickr("#date-picker", {
        enableTime: false,
        dateFormat: "Y-m-d",
        onChange: function(selectedDates, dateStr, instance) {
            const itineraryList = document.getElementById('itinerary-list');
            const itineraryItem = document.createElement('li');
            itineraryItem.textContent = `여행 날짜: ${dateStr}`;
            itineraryList.appendChild(itineraryItem);
        }
    });
});

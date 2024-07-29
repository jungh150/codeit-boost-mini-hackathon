document.addEventListener('DOMContentLoaded', function() {
    const myPageLink = document.querySelector('.myPage');
    const searchIcon = document.getElementById('searchIcon');
    const banner = document.getElementById('banner');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    myPageLink.addEventListener('click', function() {
        window.location.href = '../html/mypage.html'; // 클릭 시 페이지 이동
    });

    searchIcon.addEventListener('click', () => {
        if (banner && banner.classList.contains('show')) {
            banner.classList.remove('show');
        } else if (banner) {
            banner.classList.add('show');
        }
    });

    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        fetchPlaces(query);
    });

    async function fetchPlaces(query) {
        const url = `http://localhost:3000/places?query=${encodeURIComponent(query)}`;
        //?name=' + encodeURIComponent(query);


        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();
            console.log(data); // 서버에서 받은 장소 목록을 콘솔에 출력

            const descriptionFilteredPlaces = data.filter(place => place.description.includes(query));
            const nameFilteredPlaces = data.filter(place => place.name.includes(query));

            if (descriptionFilteredPlaces.length > 0) {
                // Redirect to place_list.html with the filtered places
                window.location.href = `../html/place_list.html?query=${encodeURIComponent(query)}&data=${encodeURIComponent(JSON.stringify(descriptionFilteredPlaces))}`;
            } else if (nameFilteredPlaces.length > 0) {
                // Redirect to keyword_list.html with the filtered places
                window.location.href = `../html/keyword_list.html?query=${encodeURIComponent(query)}&data=${encodeURIComponent(JSON.stringify(nameFilteredPlaces))}`;
            } else {
                // Redirect to non_keyword.html
                window.location.href = `../html/non_keyword.html?query=${encodeURIComponent(query)}`;
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

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
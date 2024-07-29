document.addEventListener('DOMContentLoaded', function() {
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('query');
        const data = params.get('data');
        return { query, data: JSON.parse(decodeURIComponent(data)) };
    }

    function createCard(place) {
        const imgSrc = place.imgSrc || 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';
        return `
            <div class="place-card">
                <img src="${imgSrc}" class="place-list-image" />
                <p class="place-list-name">${place.name}</p>
                <i class="fa-regular fa-heart"></i>
                <i class="fa-solid fa-heart full-heart"></i>
                <p class="place-list-address">${place.description}</p>
            </div>
        `;
    }

    function renderCards(places) {
        const container = document.getElementById('places-container');
        if (!container) {
            console.error('No container found to render cards');
            return;
        }
        container.innerHTML = ''; // Clear existing content
        places.forEach(place => {
            container.innerHTML += createCard(place);
        });
    }

    
    function addMarkersToMap(places) {
        const map = L.map('map').setView([37.5665, 126.9780], 13); // Seoul coordinates and initial zoom level

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add markers for each place
        places.forEach(function(place) {
            if (place.location && place.location.latitude && place.location.longitude) {
                L.marker([place.location.latitude, place.location.longitude]).addTo(map)
                    .bindPopup(place.name);
            }
        });
    }

    const { query, data } = getQueryParams();
    console.log('검색어:', query);
    console.log('장소 데이터:', data);

    // Set the H1 tag to the query value
    const header = document.querySelector('h1');
    if (header) {
        header.textContent = query || '서울특별시';
    }

    renderCards(data);
    addMarkersToMap(data);
});
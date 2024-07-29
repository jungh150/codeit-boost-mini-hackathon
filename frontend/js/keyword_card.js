document.addEventListener('DOMContentLoaded', function() {
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('query');
        const data = params.get('data');
        return { query, data: JSON.parse(decodeURIComponent(data)) };
    }

    function createCard(place) {
        return `
            <div class="place-card">
                <img src="${place.imgSrc}" class="place-list-image" />
                <p class="place-list-name">${place.name}</p>
                <i class="fa-regular fa-heart"></i>
                <i class="fa-solid fa-heart full-heart"></i>
                <p class="place-list-address">${place.address}</p>
            </div>
        `;
    }

    function renderCards(places) {
        const container = document.getElementById('keyword-container');
        places.forEach(place => {
            container.innerHTML += createCard(place);
        });
    }

    const { query, data } = getQueryParams();
    console.log('검색어:', query);
    console.log('장소 데이터:', data);

    renderCards(data);
});
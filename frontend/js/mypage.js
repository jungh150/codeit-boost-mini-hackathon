document.addEventListener('DOMContentLoaded', async function() {
    // 사용자가 찜한 목록을 가져오는 함수
    async function fetchWishlist() {
        const url = 'http://localhost:3000/users/my/wishes';
        
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
            console.log(data); // 서버에서 받은 찜한 목록을 콘솔에 출력
            renderWishlist(data);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    // 찜한 목록을 렌더링하는 함수
    function renderWishlist(places) {
        const content = document.querySelector('.content');

        places.forEach(place => {
            const placeElement = document.createElement('div');
            placeElement.classList.add('place-card');
            placeElement.innerHTML = `
                <img src="${place.imgSrc || 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'}" class="place-list-image" />
                <p class="place-list-name">${place.name}</p>
                <p class="place-list-address">${place.description}</p>
            `;
            content.appendChild(placeElement);
        });
    }

    // 페이지 로드 시 찜한 목록을 가져옴
    fetchWishlist();
});
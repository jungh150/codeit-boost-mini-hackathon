// Sample data
const places = [
    {
        imgSrc: "https://www.hotelscombined.co.kr/rimg/himg/44/cb/db/revato-879528-12606709-570767.jpg?width=968&height=607&crop=true",
        name: "도미인 서울 강남",
        address: "대한민국 서울특별시 강남구 봉은사로 134"
    },
    {
        imgSrc: "https://www.hotelscombined.co.kr/rimg/himg/50/12/34/1234.jpg?width=968&height=607&crop=true",
        name: "롯데월드",
        address: "대한민국 서울특별시 송파구 올림픽로 240"
    }
    // Add more places as needed
];

// Function to create a card
function createCard(place) {
    return `
        <div class="keyword-card">
            <img src="${place.imgSrc}" class="keyword-list-image" />
            <p class="keyword-list-name">${place.name}</p>
            <i class="fa-regular fa-heart"></i>
            <i class="fa-solid fa-heart full-heart"></i>
            <p class="keyword-list-address">${place.address}</p>
        </div>
    `;
}

// Function to render all cards
function renderCards() {
    const container = document.getElementById('keyword-container');
    places.forEach(place => {
        container.innerHTML += createCard(place);
    });
}

// Call the function to render cards
renderCards();
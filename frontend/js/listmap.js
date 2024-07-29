// Initialize the map
var map = L.map('map').setView([37.5665, 126.9780], 13); // Seoul coordinates and initial zoom level

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add multiple markers
var points = [
    { coords: [37.5665, 126.9780], popup: '서울특별시' },
    { coords: [37.5700, 126.9769], popup: '경복궁' },
    { coords: [37.5512, 126.9882], popup: '남산서울타워' },
    // Add more points as needed
];

points.forEach(function(point) {
    L.marker(point.coords).addTo(map)
        .bindPopup(point.popup);
});
let map;

function initMap() {
  // Initialize the map centered on Seoul
  const seoul = [37.5665, 126.9780];
  map = L.map('map').setView(seoul, 12);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}

function searchDestinations() {
  const searchValue = document.getElementById('search').value.toLowerCase();
  const destinations = document.getElementById('destinations');
  destinations.innerHTML = '';

  if (searchValue === 'seoul') {
    const travelDestinations = [
      {
        name: 'Gyeongbokgung Palace',
        description: 'A grand palace located in northern Seoul.',
        lat: 37.579617,
        lng: 126.977041
      },
      {
        name: 'Bukchon Hanok Village',
        description: 'A traditional Korean village in Seoul.',
        lat: 37.582604,
        lng: 126.983825
      },
      {
        name: 'N Seoul Tower',
        description: 'A communication and observation tower located on Namsan Mountain.',
        lat: 37.551169,
        lng: 126.988227
      }
    ];

    let lastLatLng = null;
    travelDestinations.forEach(destination => {
      const destinationDiv = document.createElement('div');
      destinationDiv.classList.add('destination');

      const destinationContent = `
        <h2>${destination.name}</h2>
        <p>${destination.description}</p>
      `;

      destinationDiv.innerHTML = destinationContent;
      destinations.appendChild(destinationDiv);

      // Add marker to map
      const marker = L.marker([destination.lat, destination.lng]).addTo(map);
      marker.bindPopup(`<b>${destination.name}</b><br>${destination.description}`);

      // Draw arrow line between destinations
      if (lastLatLng) {
        const line = L.polyline([lastLatLng, [destination.lat, destination.lng]], {
          color: 'blue',
          arrowheads: {
            frequency: '50px',
            size: '20m',
            yawn: 60
          }
        }).addTo(map);
      }
      lastLatLng = [destination.lat, destination.lng];
    });

    // Adjust map bounds to show all markers
    const bounds = travelDestinations.map(dest => [dest.lat, dest.lng]);
    map.fitBounds(bounds);
  } else {
    destinations.innerHTML = '<p>No destinations found for the searched city.</p>';
  }
}

// Initialize the map
document.addEventListener('DOMContentLoaded', initMap);
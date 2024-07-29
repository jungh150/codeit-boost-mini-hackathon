// script.js

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("openModalBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Form submission
document.getElementById("placeForm").onsubmit = async function(event) {
    event.preventDefault();

    const placeName = document.getElementById("placeName").value;
    const placeAddress = document.getElementById("placeAddress").value;


    const mapboxToken = 'pk.eyJ1IjoibWluczEyMTYiLCJhIjoiY2x6NmV3a3AyMnJvNjJrb2kyNHRvbWhuOCJ9.XcVWebjYdS_FRRnGUj_q8w';
    
    async function getCoordinates(address) {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`);
        const data = await response.json();
        if (data.features && data.features.length > 0) {
            const [longitude, latitude] = data.features[0].center;
            return { latitude, longitude };
        } else {
            throw new Error('No coordinates found for the given address');
        }
    }

    try {
        const location = await getCoordinates(placeAddress);
        console.log(location);
    const data = {
        name: placeName,
        location: {
            latitude: location.latitude,
            longitude: location.longitude
        },
        description : placeAddress
    };

    
        const response = await fetch('http://localhost:3000/places', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Success:', result);
        alert("장소가 등록되었습니다.");
    } catch (error) {
        console.error('Error:', error);
    }
}

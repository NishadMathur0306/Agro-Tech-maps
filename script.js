let map;
let marker;

async function initMap() {
    try {
        // Fetch the initial coordinates from the API
        const response = await fetch('https://blr1.blynk.cloud/external/api/get?token=FNK4SAZuWi6DnZz0PY6DwH01KqO_Umcz&V5=5&V6=6');
        const data = await response.json();

        // Parse latitude and longitude
        const latitude = parseFloat(data.V6);
        const longitude = parseFloat(data.V5);

        // Check if valid coordinates are received
        if (isNaN(latitude) || isNaN(longitude)) {
            console.error("Invalid coordinates received:", data);
            return; // Exit if coordinates are not valid
        }

        // Initialize map with API-provided center
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: latitude, lng: longitude },
            zoom: 8,
            mapId: 'd1894f2fd54c0284'
        });

        // Place initial marker at the API-provided location
        marker = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
            title: "Agro box",
            icon: {
                url: "box.svg",
                scaledSize: new google.maps.Size(38, 31)
            }
        });

        // Start updating the marker's location based on the API
        fetchLiveLocation();

    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

// Fetch and update marker location periodically
function fetchLiveLocation() {
    setInterval(async () => {
        try {
            const response = await fetch('https://blr1.blynk.cloud/external/api/get?token=FNK4SAZuWi6DnZz0PY6DwH01KqO_Umcz&V5=5&V6=6');
            const data = await response.json();

            const longitude = parseFloat(data.V6);
            const latitude = parseFloat(data.V5);

            // Only update if valid coordinates are received
            if (!isNaN(latitude) && !isNaN(longitude)) {
                const newPosition = { lat: latitude, lng: longitude };
                
                // Update marker position
                marker.setPosition(newPosition);

                // Optional: Center the map on the new position
                map.setCenter(newPosition);
            } else {
                console.error("Invalid coordinates received:", data);
            }

        } catch (error) {
            console.error('Error fetching location:', error);
        }
    }, 5000); // Fetch data every 5 seconds (adjust as needed)
}

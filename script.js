let qiblaDirection = null;

document.getElementById('findQibla').addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  // Get the user's current location
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Fetch Qibla direction using Aladhan API
      fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`)
        .then((response) => response.json())
        .then((data) => {
          qiblaDirection = data.data.direction;
          document.getElementById('direction').textContent = `${qiblaDirection}°`;
          startCompass();
        })
        .catch((error) => {
          console.error('Error fetching Qibla direction:', error);
          alert('An error occurred. Please try again.');
        });
    },
    (error) => {
      console.error('Error getting location:', error);
      alert('Unable to retrieve your location.');
    }
  );
});

function startCompass() {
  if (!window.DeviceOrientationEvent) {
    alert('Device orientation is not supported by your browser.');
    return;
  }

  window.addEventListener('deviceorientation', (event) => {
    const alpha = event.alpha; // Compass direction (0-360 degrees)
    if (alpha === null) {
      alert('Compass data not available.');
      return;
    }

    const arrow = document.getElementById('arrow');
    const kaaba = document.getElementById('kaaba');

    // Calculate the difference between the device direction and Qibla direction
    const difference = (alpha - qiblaDirection + 360) % 360;
    arrow.style.transform = `translate(-50%, -100%) rotate(${difference}deg)`;

    // Check if the device is aligned with the Qibla direction
    const tolerance = 5; // Degrees of tolerance for alignment
    if (Math.abs(difference) < tolerance || Math.abs(difference - 360) < tolerance) {
      arrow.style.backgroundColor = '#2ecc71'; // Green color
      kaaba.style.display = 'block'; // Show Kaaba image
      if (navigator.vibrate) {
        navigator.vibrate(200); // Vibrate for 200ms
      }
    } else {
      arrow.style.backgroundColor = '#e74c3c'; // Red color
      kaaba.style.display = 'none'; // Hide Kaaba image
    }
  });
}
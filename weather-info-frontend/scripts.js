document.getElementById('weather-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const city = document.getElementById('city').value;
  const resultDiv = document.getElementById('weather-result');
  resultDiv.innerHTML = 'Loading...';

  try {
    const response = await fetch(`https://weather-info-service.onrender.com/weather?city=${city}`);
    const data = await response.json();
    console.log(data);

    if (data.error) {
      resultDiv.innerHTML = `<p>${data.error}</p>`;
    } else {
      let [date, time] = data.location.localtime.split(' ');

      let TimeIcon = '';
      let altName = '';

      // Determine time of day and set the appropriate icon
      const hour = parseInt(time.split(':')[0]);
      if (hour >= 6 && hour < 19) {
        TimeIcon = 'assets/sun.png';
        altName = 'Sun';
      } else {
        TimeIcon = 'assets/new-moon.png';
        altName = 'Moon';
      }

      // Determine weather condition
      switch (data.current.weather_descriptions[0].toLowerCase()) {
        case 'sunny':
          resultDiv.classList.add('sunny');
          break;
        case 'cloudy':
          resultDiv.classList.add('cloudy');
          break;
        case 'rain':
          resultDiv.classList.add('rainy');
          break;
        case 'snow':
          resultDiv.classList.add('snowy');
          break;
        case 'thunderstorm':
          resultDiv.classList.add('thunderstorm');
          break;
        default:
          resultDiv.classList.add('cloudy');
          break;
      }

      resultDiv.innerHTML = `
        <div class="cardtop">
          <p>${date}</p>
          <div class="cart-top-time-div">
            <p id="local-time">${time}</p>
            <img class="TimeIcon" src="${TimeIcon}" alt="${altName}" />
          </div>
        </div>
        <h2>${data.location.name}</h2>
        <p>${data.current.weather_descriptions[0]}</p>
        <img class="weather-icon" src=${data.current.weather_icons[0]} alt=${data.current.weather_descriptions[0]}/>
        <p><strong><i class="fa-solid fa-temperature-quarter"></i> Temperature:</strong> ${data.current.temperature}°C</p>
        <p><strong><i class="fa-solid fa-wind"></i> Wind Speed:</strong> ${data.current.wind_speed} km/h</p>
        <p><strong><i class="fa-solid fa-droplet"></i> Humidity:</strong> ${data.current.humidity}%</p>
      `;

      // Update time every minute
      setInterval(() => {
        const localTimeElement = document.getElementById('local-time');
        let currentTime = new Date(`${date}T${time}`);
        currentTime.setMinutes(currentTime.getMinutes() + 1);

        const updatedTime = currentTime.toTimeString().split(' ')[0].substring(0, 5);
        localTimeElement.textContent = updatedTime;
        time = updatedTime;

        // Update sun/moon icon based on new time
        const updatedHour = currentTime.getHours();
        if (updatedHour >= 6 && updatedHour < 19) {
          TimeIcon = 'assets/sun.png';
          altName = 'Sun';
        } else {
          TimeIcon = 'assets/new-moon.png';
          altName = 'Moon';
        }
        document.querySelector('.TimeIcon').src = TimeIcon;
        document.querySelector('.TimeIcon').alt = altName;
      }, 60000); // 60000ms = 1 minute
    }
  } catch (error) {
    resultDiv.innerHTML = `<p>An error occurred: ${error.message}</p>`;
  }
});

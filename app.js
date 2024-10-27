



async function fetchWeatherData(location) {
    const weatherUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`;
    
    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) {
            throw new Error('Location not found or API limit exceeded.');
        }
        
        const data = await response.json();
        
        // Today's Weather
        const todayWeather = data.days[0];
        setWeatherBackground(todayWeather);


        const temperature = todayWeather.temp; // Adjust based on actual temperature property
        const dayName = getDayName(todayWeather.datetime); // Get the day name
        const imageSrc = weatherImages(todayWeather);
        const conditions = todayWeather.conditions; // Weather description
        const precipitation = todayWeather.precip; // Adjust based on actual precipitation property

        // Function to update the time and weather HTML
        const updateWeatherHTML = () => {
            const date = new Date();
            let hours = date.getHours();
            const minutes = date.getMinutes();

            // Convert to 12-hour format
            const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
            const formattedMinutes = minutes.toString().padStart(2, '0'); // Pad minutes with leading zero if needed

            const currentTime = `${formattedHours}:${formattedMinutes}`; // Combine hours and minutes

            const weatherHTML = `
                <div>
                    <img src="${imageSrc}" style="width:135px" class="todayImg">
                    <p class="tempSearch">${temperature} °C</p>
                    <p>${dayName} ${currentTime}</p> 
                    <p>${conditions}</p>
                    <p>Perc-${precipitation} %</p>
                </div>
            `;

            // Assuming you have a container to update the weather HTML
            document.getElementById('weatherContainer').innerHTML = weatherHTML;
        };

        // Initial call to display the weather
        updateWeatherHTML();

        // Update every second
        setInterval(updateWeatherHTML, 1000);



        // Upcoming Days Forecast
        let upcomingDaysHTML = '<h2></h2>';
        for (let i = 0; i < 7; i++) {
            const day = data.days[i];
            const dayName = getDayName(day.datetime);
            upcomingDaysHTML += `
                <div class="forecast-card">
                    <h3>${dayName}</h3>
                    <img src="${weatherImages(day)}" style="width:70px" class="imgDays">
                    <h3>${day.temp} °C</h3>
                </div>
            `;
        }
        document.getElementById('forecastContainer').innerHTML = upcomingDaysHTML;

        // Today's Highlights
        const todayHighlights = `<h2>Today's Highlights</h2>`;
        document.getElementById('Today-Highlights').innerHTML = todayHighlights;

        const currentWeatherHTML = `
            <div class="forecast-card todayshighlights">
                <h3 class="highLights">UV Index</h3>
                <h2>${data.currentConditions.uvindex}</h2>
                <h5 class="highLightsBottom">Moderate</h5>
            </div>
            <div class="forecast-card todayshighlights">
                <h3 class="highLightsHL">Wind Status</h3>
                <h2>${data.currentConditions.windspeed} </h2>
                <h5 class="highLightsBottoms">km/h</h5>
            </div>
            <div class="forecast-card todayshighlights">
                <h3 class="highLight">Sunrise & Sunset</h3>
                <h2>${data.currentConditions.sunrise} am </h2>
                <h5 class="highLightsBottom">${data.currentConditions.sunset} pm </h5>
            </div>
            <div class="forecast-card todayshighlights">
                <h3 class="highLights">Humidity</h3>
                <h2>${data.currentConditions.humidity}%</h2>
                <h5 class="highLightsBottom">High</h5>
            </div>
            <div class="forecast-card todayshighlights">
                <h3 class="highLights">Visibility</h3>
                <h2>${data.currentConditions.visibility} km</h2>
                <h5 class="highLightsBottom">Clear Air</h5>
            </div>
            <div class="forecast-card todayshighlights">
                <h3 class="highLightsHL">Air Quality</h3>
                <h2>${data.currentConditions.winddir}</h2>
                <h5 class="highLightsBottomHB">Hazardous😱</h5>
            </div>
        `;
        document.getElementById('currentWeather').innerHTML = currentWeatherHTML;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('forecastContainer').innerHTML = '';
        document.getElementById('Today-Highlights').innerHTML = '';
        document.getElementById('currentWeather').innerHTML = '<p>Error fetching weather data. Please try again.</p>';
        document.getElementById('weatherContainer').innerHTML = '<p>Error fetching weather data.</p>';
    }
}


function weatherImages(day) {
    let icon = day.icon;
    switch (icon) {
        case "partly-cloudy-day":
            return 'https://i.ibb.co/PZQXH8V/27.png';
        case "partly-cloudy-night":
            return 'https://i.ibb.co/Kzkk59k/15.png';
        case "rain":
            return 'https://i.ibb.co/kBd2NTS/39.png';
        case "clear-day":
            return 'https://i.ibb.co/rb4rrJL/26.png';
        case "clear-night":
            return 'https://i.ibb.co/1nxNGHL/10.png';
        default:
            return '';
    }
}

function setWeatherBackground(day) {
    const backgroundImageUrl = backGroundImg(day);
    if (backgroundImageUrl) {
        document.body.style.backgroundImage = `url(${backgroundImageUrl})`;
    }
}

function backGroundImg(day) {
    let icon = day.icon;
    switch (icon) {
        case "partly-cloudy-day":
            return 'https://i.ibb.co/qNv7NxZ/pc.webp';
        case "partly-cloudy-night":
            return 'https://i.ibb.co/RDfPqXz/pcn.jpg';
        case "rain":
            return 'https://i.ibb.co/h2p6Yhd/rain.webp';
        case "clear-day":
            return 'https://i.ibb.co/WGry01m/cd.jpg';
        case "clear-night":
            return 'https://i.ibb.co/kqtZ1Gx/cn.jpg';
        default:
            return '';
    }
}

function getDayName(dateString) {
    const date = new Date(dateString);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
}

// Call the function to fetch weather data on page load
fetchWeatherData('New York'); // Pass your desired location

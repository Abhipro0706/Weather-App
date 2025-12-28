const apiKey = "YOUR_API_KEY"; // Replace with your OpenWeather API key

async function getWeather() {
  const city = document.getElementById("city").value;

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  // Current weather
  const weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  );
  const weatherData = await weatherRes.json();

  // 5-day forecast
  const forecastRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  );
  const forecastData = await forecastRes.json();

  displayWeather(weatherData);
  displayForecast(forecastData);
}

function displayWeather(data) {
  const weatherDiv = document.getElementById("weather");

  if (data.cod !== 200) {
    weatherDiv.innerHTML = `<p>${data.message}</p>`;
    return;
  }

  weatherDiv.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
        <p><b>${data.main.temp} °C</b></p>
        <p>${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
  const forecastDiv = document.getElementById("forecast");
  const title = document.getElementById("forecast-title");

  forecastDiv.innerHTML = "";
  title.innerText = "5-Day Forecast";

  // Take one forecast per day (every 24 hrs)
  const dailyData = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.forEach((day) => {
    const card = document.createElement("div");
    card.classList.add("forecast-card");

    const date = new Date(day.dt_txt).toDateString();

    card.innerHTML = `
            <h4>${date}</h4>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
            <p>${day.main.temp} °C</p>
            <p>${day.weather[0].description}</p>
        `;

    forecastDiv.appendChild(card);
  });
}

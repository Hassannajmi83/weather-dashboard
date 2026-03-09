const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const statusMessage = document.getElementById("statusMessage");
const weatherResult = document.getElementById("weatherResult");

const cityName = document.getElementById("cityName");
const weatherDesc = document.getElementById("weatherDesc");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");
const country = document.getElementById("country");
const weatherIcon = document.getElementById("weatherIcon");

// Replace this with your actual OpenWeather API key
const API_KEY = "13a78614d0e6df07aa9fc2b3207124e4";

// Load last searched city
const savedCity = localStorage.getItem("lastWeatherCity");
if (savedCity) {
  cityInput.value = savedCity;
  fetchWeather(savedCity);
}

// Handle search form
weatherForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();
  if (!city) return;

  fetchWeather(city);
});

// Fetch weather data
async function fetchWeather(city) {
  statusMessage.textContent = "Loading weather...";
  weatherResult.classList.add("hidden");

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    // Show actual API error message if something went wrong
    if (!response.ok) {
      throw new Error(data.message || "Unable to fetch weather.");
    }

    renderWeather(data);
    localStorage.setItem("lastWeatherCity", city);
    statusMessage.textContent = "Weather loaded.";

  } catch (error) {
    statusMessage.textContent = error.message || "Something went wrong.";
    weatherResult.classList.add("hidden");
  }
}

// Display weather
function renderWeather(data) {
  cityName.textContent = data.name;
  weatherDesc.textContent = capitalizeWords(data.weather[0].description);
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  country.textContent = data.sys.country;

  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.alt = data.weather[0].description;

  weatherResult.classList.remove("hidden");
}

// Capitalize words for weather description
function capitalizeWords(text) {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

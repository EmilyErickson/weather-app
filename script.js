let container = document.querySelector(".container");
let locationInput = document.querySelector(".location-input");
let backgroundDisplay = document.querySelector(".background");
let tempToggle = document.querySelector(".farenheit-toggle");

let locationDisplay = document.querySelector(".location");
let locationDetails = document.querySelector(".location-details");
let condtionDisplay = document.querySelector(".condition");
let currentDisplay = document.querySelector(".current-weather");
let realFeelDisplay = document.querySelector(".feels-like .info");
let humidityDisplay = document.querySelector(".humidity .info");
let windDisplay = document.querySelector(".wind .info");
let rainDisplay = document.querySelector(".rain .info");

let weeklyDisplay = document.querySelector("weekly-forecast");
let days = document.querySelectorAll(".day");
let time = document.querySelectorAll(".time");
let temp = document.querySelectorAll(".temp");
let hourFeel = document.querySelectorAll(".hour-feel");

let farenheit = true;

locationInput.addEventListener("change", () => {
  changeLocation(locationInput.value);
  locationInput.value = "";
});

function changeLocation(value) {
  getData(value);
}

async function getData(location) {
  try {
    let data = await fetch(
      "https://api.weatherapi.com/v1/forecast.json?key=df411b097e7446288cd221831231904&q=" +
        `${location}`,
      {
        mode: "cors",
      }
    );
    let dataToJson = await data.json();
    let weatherData = await dataToJson;

    processData(weatherData);
  } catch {
    alert("Invalid Location");
    console.log("error");
  }
}

function processData(weatherData) {
  let getCountry = `${weatherData.location.country}`;
  let country = `${weatherData.location.name}, ${weatherData.location.country}`;
  if (getCountry.split(" ").length > 1) {
    country =
      `${weatherData.location.name}, ` + getCountry.replace(/[^A-Z]+/g, "");
  }
  let date = new Date(weatherData.location.localtime).toLocaleDateString(
    "en-us",
    { weekday: "long", year: "numeric", month: "short", day: "numeric" }
  );

  let weatherInfo = {
    location: `${country}`,
    locationDate: `${date}`,
    weatherFarenheit: `${weatherData.current.temp_f}°F`,
    weatherCelcius: `${weatherData.current.temp_c}°C`,
    feelsLikeFarenheit: `${weatherData.current.feelslike_f}°F`,
    feelsLikeCelcius: `${weatherData.current.feelslike_c}°C`,
    windMph: `${weatherData.current.gust_mph}mph`,
    windKph: `${weatherData.current.gust_kph}kph`,
    condition: `${weatherData.current.condition.text}`,
    conditionIcon: `${weatherData.current.condition.icon}`,
    humidity: `${weatherData.current.humidity}%`,
    rain: `${weatherData.forecast.forecastday[0].day.daily_chance_of_rain}%`,
    isDay: `${weatherData.current.is_day}`,
  };
  console.log(weatherInfo);
  console.log(weatherData);

  let hourlyForecast = weatherData.forecast.forecastday[0].hour.toSpliced(0, 5);

  updateTemp(weatherInfo, hourlyForecast);
  updateBackground(weatherInfo);
}

function updateTemp(weatherInfo, hourlyForecast) {
  tempToggle.addEventListener("change", () => {
    if (tempToggle.checked) {
      farenheit = false;
    } else {
      farenheit = true;
    }
    displayData(weatherInfo, hourlyForecast);
  });
  displayData(weatherInfo, hourlyForecast);
}

function displayData(weatherInfo, hourlyForecast) {
  locationDisplay.textContent = `${weatherInfo.location}`;
  locationDetails.textContent = `${weatherInfo.locationDate}`;
  condtionDisplay.textContent = `${weatherInfo.condition}`;
  humidityDisplay.textContent = `${weatherInfo.humidity}`;
  rainDisplay.textContent = `${weatherInfo.rain}`;

  if (farenheit === true) {
    displayFarenheit(weatherInfo);
    hourlyFarenheit(hourlyForecast);
  } else {
    displayCelcius(weatherInfo);
    hourlyCelcius(hourlyForecast);
  }
}

function displayFarenheit(weatherInfo) {
  currentDisplay.textContent = `${weatherInfo.weatherFarenheit}`;
  realFeelDisplay.textContent = `${weatherInfo.feelsLikeFarenheit}`;
  windDisplay.textContent = `${weatherInfo.windMph}`;
}

function displayCelcius(weatherInfo) {
  currentDisplay.textContent = `${weatherInfo.weatherCelcius}`;
  realFeelDisplay.textContent = `${weatherInfo.feelsLikeCelcius}`;
  windDisplay.textContent = `${weatherInfo.windKph}`;
}

function hourlyFarenheit(hourlyForecast) {
  days.forEach((day, i) => {
    let getHour = hourlyForecast[i].time.split(" ")[1].split(":");
    let hour = `${getHour[0]}:${getHour[1]}`;
    if (getHour[0] < 10) {
      hour = `${getHour[0].slice(1)}:${getHour[1]}`;
    }
    if (getHour[0] > 12) {
      hour = `${getHour[0] - 12}:${getHour[1]}`;
    }
    time[i].textContent = hour;
    temp[i].textContent = `${hourlyForecast[i].temp_f}°F`;
    hourFeel[i].textContent = `${hourlyForecast[i].feelslike_f}°F`;
  });
}

function hourlyCelcius(hourlyForecast) {
  days.forEach((day, i) => {
    let getHour = hourlyForecast[i].time.split(" ")[1].split(":");
    let hour = `${getHour[0]}:${getHour[1]}`;
    if (getHour[0] < 10) {
      hour = `${getHour[0].slice(1)}:${getHour[1]}`;
    }
    if (getHour[0] > 12) {
      hour = `${getHour[0] - 12}:${getHour[1]}`;
    }
    time[i].textContent = hour;
    temp[i].textContent = `${hourlyForecast[i].temp_c}°C`;
    hourFeel[i].textContent = `${hourlyForecast[i].feelslike_c}°C`;
  });
}

function updateBackground(weatherInfo) {
  if (weatherInfo.isDay == 0) {
    changeBackgroundToNight(weatherInfo.condition);
  } else if (weatherInfo.isDay == 1) {
    changeBackgroundToDay(weatherInfo.condition);
  }
}

function changeBackgroundToNight(condition) {
  backgroundDisplay.classList = "background";
  if (condition == "Clear") {
    backgroundDisplay.classList.add("clear-night");
  } else if (condition == "Partly Cloudy" || condition == "Cloudy") {
    backgroundDisplay.classList.add("cloudy-night");
  } else if (
    condition == "Rainy" ||
    condition == "Overcast" ||
    condition == "Light Drizzle" ||
    condition == "Mist"
  ) {
    backgroundDisplay.classList.add("rainy");
  } else {
    backgroundDisplay.classList.add("cloudy-night");
  }
}
function changeBackgroundToDay(condition) {
  console.log(condition);
  backgroundDisplay.classList = "background";
  if (condition == "Clear") {
    backgroundDisplay.classList.add("clear-day");
  } else if (condition == "Partly Cloudy" || condition == "Cloudy") {
    backgroundDisplay.classList.add("cloudy-day");
  } else if (
    condition == "Rainy" ||
    condition == "Overcast" ||
    condition == "Light Drizzle" ||
    condition == "Mist"
  ) {
    backgroundDisplay.classList.add("rainy");
  }
}

getData("london");

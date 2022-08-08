const APIKey = "5d6c592be6cd7dca9263abb86e216d9c";
let cityInputEl = document.querySelector("#city-input");
let cityForm = document.querySelector("#city-form");
let card = document.querySelector(".card");
let cityButtons = document.querySelector("#city-buttons");
let btn = document.querySelector(".btn");
let selectionForm = document.querySelector(".selection-form");
let currentDayContainer = document.querySelector("#current-day-container");
let title = document.createElement("h3");
let forecast5Day = document.querySelector(".Forecast-5-day");

// create current weather elements
let cityContainerCurrentUl = document.querySelector(
  "#city-container-current-ul"
);
let cityContainerCurrentH2 = document.querySelector(
  ".city-container-current-h2"
);
currentDayWeatherIcon = document.createElement("img");
let temp = document.createElement("li");
let wind = document.createElement("li");
let humidity = document.createElement("li");
let uvIndex = document.createElement("p");
let uvIndexTitle = document.createElement("p");
// let lon = 0;
// let lat = 0;

// create global array to store searched cities locally
let cities = [];
// create boolean variable to identify when a city has been typed in or the button selected.
let cityInputFlag = false;

function init() {
  // get data from local storage
  createCitiesSearchButtonsStored();

  temp.setAttribute(
    "style",
    "list-style:none;padding-top:2rem;padding-bottom:2rem;"
  );
  wind.setAttribute(
    "style",
    "list-style:none;padding-top:2rem;padding-bottom:4rem;"
  );
  humidity.setAttribute(
    "style",
    "list-style:none;padding-top:2rem;padding-bottom:2rem;"
  );
  uvIndexTitle.setAttribute("style", "display:inline;");
  uvIndex.setAttribute(
    "style",
    "display:inline;padding-left:2rem;padding-right:2rem;border-radius:0.3rem;padding-top:1rem;padding-bottom:1rem;margin-top:3rem;"
  );
}

// called when the submit button is clicked
let formSubmitHandler = function (event) {
  event.preventDefault();

  cityInputFlag = true;
  let city = cityInputEl.value.trim();

  if (city) {
    getCityApi(city);

    cityContainerCurrentUl.textContent = "";
    cityInputEl.value = "";
  } else {
    alert("Please enter a city name");
  }
};

// get the data for the selected city
function getCityApi(city) {
  let requestUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;

  // fetch the weather api data for the selected city using the url
  fetch(requestUrl)
    .then(function (response) {
      // display data not found
      if (response.ok) {
        response.json().then(function (data) {
          displayWeather(data, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to GitHub");
    });
}

function displayWeather(data, city) {
  if (data.length === 0) {
    cityContainerCurrentH2.textContent = "No weather found.";
    return;
  }

  let lon = 0;
  let lat = 0;

  lon = data.coord.lon;
  lat = data.coord.lat;
  // retrieve the city uvi
  // include latitude and longitude co-ordinates in the url and use onecall
  let url =
    "http://api.openweathermap.org/data/2.5/onecall?" +
    "&lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    APIKey +
    "&units=imperial";
  // fetch the api data including the uvi
  fetch(url)
    .then(function (response) {
      // Display not found if an error occurs
      if (response.status === 404) {
        alert("No data found " + response.statusText);
      }
      // return the response to select the data for display
      return response.json();
    })
    .then(function (data) {
      if (cityInputFlag === true) {
        // Add new city to cities array, clear the input
        cities.push(city);
        cityInputEl.value = "";

        // add new city to cities array
        storeCities();
        // create city buttons from local storage
        renderCities();
      }

      // apply style to city container to be displayed
      cityContainerCurrentUl.setAttribute(
        "style",
        "border: 0.3rem solid var(brown);font-size:2.5rem;"
      );
      // format style for data to be displayed for the current weather section
      cityContainerCurrentH2.textContent =
        city + " " + moment.unix(data.current.dt).format("DD/MM/YYYY");
      cityContainerCurrentH2.setAttribute(
        "style",
        "display:inline-flex; font-size:4rem;"
      );
      let currentDayIcon = data.current.weather[0].icon;
      currentDayWeatherIcon.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${currentDayIcon}@2x.png`
      );
      currentDayWeatherIcon.setAttribute("style", "width:4.5%;");
      currentDayContainer.insertBefore(
        currentDayWeatherIcon,
        cityContainerCurrentUl
      );

      temp.textContent = "Temp: " + String(data.current.temp) + " F";
      humidity.textContent =
        "Humidity: " + String(data.current.humidity) + " %";
      wind.textContent = "Wind: " + String(data.current.wind_speed) + " MPH";
      // aadd current weather style to current weather section
      cityContainerCurrentUl.appendChild(temp);
      cityContainerCurrentUl.appendChild(humidity);
      cityContainerCurrentUl.appendChild(wind);
      // add the uvi to the display
      uvIndexTitle.textContent = "UV Index: ";
      uvIndex.textContent = data.current.uvi;
      if (parseInt(data.current.uvi) < 3)
        uvIndex.setAttribute("class", "green uv-class");
      else if (parseInt(data.current.uvi) < 6)
        uvIndex.setAttribute("class", "yellow uv-class");
      else if (parseInt(data.current.uvi) < 8)
        uvIndex.setAttribute("class", "orange uv-class");
      else if (parseInt(data.current.uvi) < 11)
        uvIndex.setAttribute("class", "red uv-class");
      else uvIndex.setAttribute("class", "purple uv-class");
      // add uv index title and data to current weather section
      cityContainerCurrentUl.appendChild(uvIndexTitle);
      cityContainerCurrentUl.appendChild(uvIndex);
      currentDayContainer.setAttribute("style", " border: 0.2rem solid brown;");

      // Clear cityContainerDay element
      for (let i = 1; i < 6; i++) {
        let cityContainerDay = document.querySelector(
          `#city-container-${i}-day`
        );
        cityContainerDay.innerHTML = "";
      }

      // create arrays for 5 day forecast
      let day = [];
      let dailyTemp = [];
      let dailyWind = [];
      let dailyHumidity = [];
      let dailyWeatherIcon = [];

      //get daily weather forecast over 5 days: data, icon, temperature, wind and humidity
      for (let i = 1; i < 6; i++) {
        // create 5 day forecast list
        day[i] = document.createElement("li");
        dailyTemp[i] = document.createElement("li");
        dailyWind[i] = document.createElement("li");
        dailyHumidity[i] = document.createElement("li");
        dailyWeatherIcon[i] = document.createElement("img");
        day[i].textContent = moment.unix(data.daily[i].dt).format("DD/MM/YYYY");

        // apply title and style for 5 day forecast section
        if (i === 1) {
          // define style for lists
          title.textContent = "5 Day Forcast:";
          title.setAttribute(
            "style",
            "font-size:3rem; font-weight:800;padding:2rem;"
          );
          forecast5Day.appendChild(title);
        }
        // apply styles for 5 day forecast section
        day[i].setAttribute("style", "list-style:none;padding:2rem;");
        dailyTemp[i].setAttribute(
          "style",
          "list-style:none;padding-left:2rem;padding-bottom:2rem;"
        );
        dailyWind[i].setAttribute(
          "style",
          "list-style:none;padding-left:2rem;padding-bottom:2rem;"
        );
        dailyHumidity[i].setAttribute(
          "style",
          "list-style:none;padding-left:2rem;padding-bottom:2rem;"
        );
        dailyWeatherIcon[i].setAttribute(
          "style",
          "list-style:none;padding-left:2rem;padding-bottom:2rem;"
        );

        // get the weather icon for each day
        let dailyIcon = data.daily[i].weather[0].icon;
        dailyWeatherIcon[i].setAttribute(
          "src",
          `http://openweathermap.org/img/wn/${dailyIcon}@2x.png`
        );
        // add the data to the days temperature
        dailyTemp[i].textContent =
          "Temp: " + String(data.daily[i].temp.day) + " F";
        // add the data to the days humidity
        dailyHumidity[i].textContent =
          "Humidity: " + String(data.daily[i].humidity) + " %";
        // add the data to the days wind speed
        dailyWind[i].textContent =
          "Wind: " + String(data.daily[i].wind_speed) + " MPH";
        // create the format to get the element for each day
        let cityContainerDay = document.querySelector(
          `#city-container-${i}-day`
        );

        cityContainerDay.setAttribute(
          "style",
          "font-size:2.5rem;color:#fff;background-color: var(--weather-card);margin-bottom:5%;"
        );

        // add the data to the correctly formated style elements for the 5 day forecast section
        cityContainerDay.appendChild(day[i]);
        cityContainerDay.appendChild(dailyWeatherIcon[i]);
        cityContainerDay.appendChild(dailyTemp[i]);
        cityContainerDay.appendChild(dailyWind[i]);
        cityContainerDay.appendChild(dailyHumidity[i]);
      }
    });
}
// get cities previous searched from local storages
// create buttons for each city stored
function createCitiesSearchButtonsStored() {
  // Get stored todos from localStorage
  let storedCities = JSON.parse(localStorage.getItem("cities"));

  // If todos were retrieved from localStorage, update the todos array to it
  if (storedCities !== null) {
    cities = storedCities;
  }

  // This is a helper function that will render todos to the DOM
  renderCities();
}

// The following function renders items in a cities list as <button> elements
function renderCities() {
  // Clear cityButtons element
  cityButtons.innerHTML = "";
  // Render a new li for each todo
  for (var i = 0; i < cities.length; i++) {
    let city = cities[i];

    // create button for the city
    let button = document.createElement("button");
    button.setAttribute("class", "btn");
    button.setAttribute(
      "style",
      "background-color:#a3a3a3;margin-bottom:1rem;color: var(--primary);"
    );
    button.textContent = city;

    // add new city to the first in the list of buttons already on display
    if (i === cities.length - 1) {
      cityButtons.prepend(button);
    }
    // add previously searched cities to the display
    else cityButtons.appendChild(button);
  }
}

function storeCities() {
  // store cities to local storage
  // Stringify and set key in localStorage to cities array
  localStorage.setItem("cities", JSON.stringify(cities));
}

// Add click event to cityButtons element
cityButtons.addEventListener("click", function (event) {
  var element = event.target;
  cityInputFlag = false;
  getCityApi(element.textContent);
});

// call the initialise function
init();
// if submit button clicked then call formSubmitHandler function
cityForm.addEventListener("submit", formSubmitHandler);

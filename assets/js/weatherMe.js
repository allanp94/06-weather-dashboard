var savedCities = JSON.parse(localStorage.getItem("cities"));
var searchedCities = savedCities ? [savedCities] : [];
var searchCityBodyEl = $("#search-city-body");
var searchedCityButtonDivEl = $(".searched-cities");

$(document).ready(function () {
  if (searchedCities) {
    for (var i = 1; i < searchedCities[0].length; i++) {
      var buttonEl = $("<button>")
        .text(searchedCities[0][i].city)
        .addClass("city button");

      searchedCityButtonDivEl.append(buttonEl);
      searchCityBodyEl.append(searchedCityButtonDivEl);
    }
  }
});

searchedCityButtonDivEl.on("click", "button", function () {
  var cityName = $(this).html();
  console.log(cityName);
});

$("#submitBtn").click(function () {
  var inputCityEl = $(".input-city").val();
  if (inputCityEl !== "") {
    //check and see if that city has already been searched for
    checkCity(inputCityEl);
  }
});

function checkCity(inputCityEl) {
  $("#present-weather-info").html("");
  $("#future-weather-container").html("");
  var buttonEl = $("<button>").text(inputCityEl).addClass("city button");

  inputCityEl = inputCityEl.toLowerCase();
  var bool = false;
  var i = 0;

  if (searchedCities.length === 0) {
    fetchMe(inputCityEl);
    searchedCityButtonDivEl.append(buttonEl);
    searchCityBodyEl.append(searchedCityButtonDivEl);
  } else {
    searchedCities.forEach((element, index) => {
      if (inputCityEl == element.city) {
        // if the city is in the array it means that it was already searched; so set bool to true
        i = index;
        bool = true;
      }
    });
    if (bool) {
      getCurrentWeatherData(searchedCities[i].city, searchedCities[i].data);
      getFutureWeatherData(searchedCities[i].data, 5);
      bool = false;
      i = 0;
    } else {
      fetchMe(inputCityEl);
      searchedCityButtonDivEl.append(buttonEl);
      searchCityBodyEl.append(searchedCityButtonDivEl);
    }
  }
}

function getCurrentWeatherData(city, obj) {
  var temp = obj.current.temp;
  var wind = obj.current.wind_speed;
  var humidity = obj.current.humidity;
  var weatherIcon = obj.current.weather[0].icon;
  var uvIndex = obj.current.uvi;

  var weatherInfo = { temp, wind, humidity, weatherIcon, uvIndex };
  displayCurrentWeather(city, weatherInfo);
}

function badInput(badInput) {
  var currentWeatherEl = $("#present-weather-info");
  var cityNameEl = $("<h4>")
    .attr("id", "city-name")
    .html(
      `ERROR -- was not able to search for the requested city: ${badInput}`
    );

  currentWeatherEl.append(cityNameEl);
}

function getFutureWeatherData(obj, days) {
  var futureWeatherArray = [];
  for (var i = 0; i < days; i++) {
    var temp = obj.daily[i].temp.day;
    var wind = obj.daily[i].wind_speed;
    var uvIndex = obj.daily[i].uvi;
    var humidity = obj.daily[i].humidity;
    var weatherIcon = obj.daily[i].weather[0].icon;
    var date = dayjs()
      .add(i + 1, "day")
      .format("DD/MM/YYYY");

    futureWeatherArray.push({
      temp,
      wind,
      humidity,
      weatherIcon,
      uvIndex,
      date,
    });
  }
  displayFutureWeather(futureWeatherArray);
}

function displayCurrentWeather(city, weather) {
  var date = dayjs().format("DD/MM/YYYY");

  var currentWeatherEl = $("#present-weather-info");
  currentWeatherEl.html("");
  var cityImgDivEl = $("<div>").addClass("grid-x");

  var iconEl = $("<img>")
    .addClass("weatherImg")
    .attr(
      "src",
      `http://openweathermap.org/img/wn/${weather.weatherIcon}@2x.png`
    )
    .attr("alt", "Weather Icon");

  var cityNameEl = $("<h4>")
    .attr("id", "city-name")
    .html(`${city.toUpperCase()} (${date})`);

  cityImgDivEl.append(cityNameEl, iconEl);

  var tempEl = $("<span>").text(`Temp: ${weather.temp} °F`);
  var windEl = $("<span>").text(`Wind: ${weather.wind} MPH`);
  var humidityEl = $("<span>").text(`Humidity: ${weather.humidity} %`);

  var uvDivEl = $("<div>").addClass("grid-x");

  var uvIndexTextEl = $("<span>").text("UV Index:");
  var uvIndexEl = $("<span>").addClass("uvIndex").text(weather.uvIndex);

  if (weather.uvIndex < 2) {
    uvIndexEl.addClass("favorable");
  } else if (weather.uvIndex > 2 && weather.uvIndex < 6) {
    uvIndexEl.addClass("moderate");
  } else if (weather.uvIndex > 6) {
    uvIndexEl.addClass("severe");
  }

  uvDivEl.append(uvIndexTextEl, uvIndexEl);
  currentWeatherEl.append(cityImgDivEl, tempEl, windEl, humidityEl, uvDivEl);
}

function displayFutureWeather(futureWeather) {
  $("#future-weather-container").html("");
  for (var i = 0; i < futureWeather.length; i++) {
    var futureWeatherEl = $("#future-weather-container");
    var divEl = $("<div>").addClass("card medium-2 small-2 large-2");

    var dateEl = $("<span>").text(futureWeather[i].date);
    var iconEl = $("<img>")
      .addClass("weatherImg")
      .attr(
        "src",
        `http://openweathermap.org/img/wn/${futureWeather[i].weatherIcon}@2x.png`
      )
      .attr("alt", "Weather Icon");
    var tempEl = $("<span>").text(`Temp: ${futureWeather[i].temp} °F`);
    var windEl = $("<span>").text(`Wind: ${futureWeather[i].wind} MPH`);
    var humidityEl = $("<span>").text(
      `Humidity: ${futureWeather[i].humidity} %`
    );

    divEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);
    futureWeatherEl.append(divEl);
  }
}

function fetchMe(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=b25905e67fcd36d2919f537ee580bedb`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      let lat = response.coord.lat;
      let lon = response.coord.lon;
      return fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely&appid=b25905e67fcd36d2919f537ee580bedb`
      );
    })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (response) {
      var cityData = { city: city, data: response };
      searchedCities.push(cityData);

      localStorage.setItem("cities", JSON.stringify(searchedCities));

      getCurrentWeatherData(city, response);
      getFutureWeatherData(response, 5);
      return response;
    })
    .catch(function () {
      console.log("oops something went wrong");
      badInput(city);
    });
}

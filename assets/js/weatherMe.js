$("#submitBtn").click(function () {
  var searchCityBodyEl = $("#search-city-body");
  var inputCityEl = $(".input-city").val();

  if (inputCityEl !== "") {
    var spanEl = $("<button>").text(inputCityEl).addClass("city button");
    searchCityBodyEl.append(spanEl);
  }

  console.log(inputCityEl);
});

function fetchMe(city) {
  fetch(
    `https:api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=b25905e67fcd36d2919f537ee580bedb`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      let lat = response.coord.lat;
      let lon = response.coord.lon;
      console.log(`lat:${lat} lon: ${lon} `);

      //
      return fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely&appid=b25905e67fcd36d2919f537ee580bedb`
      );
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);
      return response;
    });
}

fetchMe("Madison", 1);

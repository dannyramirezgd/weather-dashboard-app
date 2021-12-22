
var cityInputEl = document.querySelector("#city-name");
var stateInputEl = document.querySelector("#states");
var searchBtnEl = document.querySelector("#search-btn");
var select = document.getElementById("states");
var cityInput = document.getElementById("city-name");
var focusCityEl = document.getElementById("focus-city");
var searchHistoryEl = document.getElementById("search-history");
var forecastEl = document.getElementById("forecast");
var searchHistoryBtnEl = document.getElementById("search-history");
var selectValue = "";
var cityName = "";
var cityNameObj = {};
var cityNameArr = [];

var saveCityNameArr = function () {
  if (!JSON.parse(localStorage.getItem("cityNameArr"))) {
    cityNameArr.push(cityNameObj);
    localStorage.setItem("cityNameArr", JSON.stringify(cityNameArr));
  } else {
    var tempCityNameArr = JSON.parse(localStorage.getItem("cityNameArr"));
    tempCityNameArr.push(cityNameObj);
    cityNameArr = tempCityNameArr;
    localStorage.setItem("cityNameArr", JSON.stringify(cityNameArr));
  }
};

//grabbing input from form and dropdown and pulling the lat and lon
var getLocationInfo = function (city, state) {
  var apiUrl =
    "http://api.geonames.org/searchJSON?q=" +
    city +
    "&adminCode1=" +
    state +
    "&maxRows=10&username=dannyramirezgd";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        if (data.geonames.length > 1) {
          var lat = data.geonames[0].lat;
          var lon = data.geonames[0].lng;
          getWeatherInfo(lat, lon);
        } else {
          alert("Please enter a valid City and State");
          return;
        }
      });
    } else {
      alert("Error");
    }
  });
};
//get info from weather API based on lat and lon of city from getLocationInfo function
var getWeatherInfo = function (lat, lon) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=56d05661cb74c3389542f3c94dddc04e";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var cityName = cityInput.value;
        var selectValue = select.options[select.selectedIndex].value;
        localStorage.setItem("weather", JSON.stringify(data));
        cityNameObj = {
          cityName: cityName,
          state: selectValue,
          lat: lat,
          lon: lon,
        };
        saveCityNameArr();
        createFocusedCity(cityName, selectValue);
        singleSearchHisBtn();
      });
    } else {
      alert("Error: Did not receive response");
    }
  });
};

//create when button is clicked create city and state info for location and weather info functions
var searchButtonHandler = function (event) {
  var cityName = cityInput.value;
  var selectValue = select.options[select.selectedIndex].value;
  var wholeTag = cityInput.value + ", " + select.options[select.selectedIndex].value;
  if (!cityName) {
    alert("Please enter a City Name");
    return;
  } else { 
    var audit = false; 
    var historyBtns = document.querySelectorAll("#history-btn");
    while(audit !== true){
      if(historyBtns.length === 0){
        break;
      }
      for(i=0; i<historyBtns.length; i++){
        if (audit===true){
          break;
        }
         else if(wholeTag === historyBtns[i].textContent){
          alert("City Name has already been searched, please click on search History")
          return;
        }
      }
      audit = true;
    }
        event.preventDefault();
        getLocationInfo(cityName, selectValue);
        forecastEl.innerHTML = "";
        focusCityEl.innerHTML = "";
    
  }
};
//create container and information for the searched city
var createFocusedCity = function (city, state) {
  var getWeatherInfo = JSON.parse(localStorage.getItem("weather"));
  if (getWeatherInfo.current.weather[0].main === "Clear"){
    var weatherIcon = document.createElement("i")
    weatherIcon.setAttribute("class", 'ri-sun-line');
  }
  else if (getWeatherInfo.current.weather[0].main === "Clouds"){
    var weatherIcon = document.createElement("i")
    weatherIcon.setAttribute("class", "ri-cloudy-line")
  }
  else if (getWeatherInfo.current.weather[0].main === "Rain"){
    var weatherIcon = document.createElement("i")
    weatherIcon.setAttribute("class", 'ri-showers-line');
  }
  else if (getWeatherInfo.current.weather[0].main === "Snow"){
    var weatherIcon = document.createElement("i")
    weatherIcon.setAttribute ("class",'ri-snowy-line')
  }
  focusCityEl.textContent = "";
  focusCityEl.textContent =  city + ", " + state;
  var currentDate = moment().format("M/D/YYYY")
  var dateEl = document.createElement("div");
  dateEl.textContent = "(" + currentDate + ")"
  var tempEl = document.createElement("li");
  tempEl.setAttribute("class", "list-group-item border-0")
  tempEl.textContent = "Current Temp: " + getWeatherInfo.current.temp + " °F";
  var windEl = document.createElement("li");
  windEl.setAttribute("class", "list-group-item border-0")
  windEl.textContent =
    "Wind Speed: " + getWeatherInfo.current.wind_speed + " mph";
  var humidEl = document.createElement("li");
  humidEl.setAttribute("class", "list-group-item border-0")
  humidEl.textContent = "Humidity: " + getWeatherInfo.current.humidity + "%";
  var uviEl = document.createElement("li");
  uviEl.setAttribute("class", "list-group-item border-0")
  uviEl.textContent = "UV Index: ";
  var uviElColor = document.createElement("span");
  if(getWeatherInfo.current.uvi <= 2){
    uviElColor.setAttribute("class", "bg-success")
  }
  if(getWeatherInfo.current.uvi >= 3 && getWeatherInfo.current.uvi <=7){
    uviElColor.setAttribute("class", "bg-warning");
  }
  if(getWeatherInfo.current.uvi > 7){
    uviElColor.setAttribute("class","bg-danger");
  }
  uviElColor.textContent = getWeatherInfo.current.uvi
  uviEl.appendChild(uviElColor);
  dateEl.appendChild(weatherIcon);
  focusCityEl.appendChild(dateEl);
  focusCityEl.appendChild(tempEl);
  focusCityEl.appendChild(windEl);
  focusCityEl.appendChild(uviEl);
  createFutureCity();
};
//create new button for each searched city to create a search history
var searchHistory = function () {
  if (JSON.parse(localStorage.getItem("cityNameArr")) === null) {
    var searchHistoryArr = [];
  } else {
    var searchHistoryArr = JSON.parse(localStorage.getItem("cityNameArr"));
    for (var i = 0; i < searchHistoryArr.length; i++) {
        var searchHistoryBtn = document.createElement("button");
        searchHistoryBtn.setAttribute("class", "btn btn-info w-100 mt-2")
        searchHistoryBtn.textContent = searchHistoryArr[i].cityName + ", " + searchHistoryArr[i].state;
        searchHistoryBtn.setAttribute("id", "history-btn");
        searchHistoryEl.appendChild(searchHistoryBtn);
    }
  }
};
//create a button each time I click the search button, but doesn't stay when reloaded
var singleSearchHisBtn = function (){
    var cityName = cityInput.value
    var selectValue = select.options[select.selectedIndex].value;
    var searchHistoryBtn = document.createElement("button");
    searchHistoryBtn.setAttribute("id", "history-btn");
    searchHistoryBtn.setAttribute("class", "btn btn-info w-100 mt-2")
    searchHistoryBtn.textContent = cityName + ", " + selectValue;
    searchHistoryEl.appendChild(searchHistoryBtn);
}
//search the location and print info when clicking the search history button
var searchHistoryBtnClickHandler = function (event){
    if(event.target.id = "history-btn"){
        var textInputForTitleEl = event.target.textContent;
        localStorage.setItem("cityNameEl", JSON.stringify(textInputForTitleEl));
        var createInput = event.target.textContent.split(",");
        var cityName = createInput[0]
        var selectValue = createInput[1]
        event.preventDefault();
        getLocationInfoSearchHis(cityName, selectValue);
        }
    }
//grabbing input from form and dropdown and pulling the lat and lon
var getLocationInfoSearchHis = function (city, state) {
  var apiUrl =
    "http://api.geonames.org/searchJSON?q=" +
    city +
    "&adminCode1=" +
    state +
    "&maxRows=10&username=dannyramirezgd";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        if (data.geonames.length > 1) {
          var lat = data.geonames[0].lat;
          var lon = data.geonames[0].lng;
          getWeatherInfoSearchHis(lat, lon);
        } else {
          alert("Please enter a valid City and State");
          return;
        }
      });
    } else {
      alert("Error");
    }
  });
};
var getWeatherInfoSearchHis = function (lat, lon) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=56d05661cb74c3389542f3c94dddc04e";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        localStorage.setItem("weather", JSON.stringify(data));
        createFocusedCitySearchHis();
      });
    } else {
      alert("Error: Did not receive response");
    }
  });
};
var createFocusedCitySearchHis = function(){
    var getWeatherInfo = JSON.parse(localStorage.getItem("weather"));
    if (getWeatherInfo.current.weather[0].main === "Clear"){
      var weatherIcon = document.createElement("i")
      weatherIcon.setAttribute("class", 'ri-sun-line');
    }
    else if (getWeatherInfo.current.weather[0].main === "Clouds"){
      var weatherIcon = document.createElement("i")
      weatherIcon.setAttribute("class", "ri-cloudy-line")
    }
    else if (getWeatherInfo.current.weather[0].main === "Rain"){
      var weatherIcon = document.createElement("i")
      weatherIcon.setAttribute("class", 'ri-showers-line');
    }
    else if (getWeatherInfo.current.weather[0].main === "Snow"){
      var weatherIcon = document.createElement("i")
      weatherIcon.setAttribute ("class",'ri-snowy-line')
    }
    var titleEl = JSON.parse(localStorage.getItem("cityNameEl"));
    focusCityEl.textContent = "";
    focusCityEl.textContent = titleEl;
    var currentDate = moment().format("M/D/YYYY")
    var dateEl = document.createElement("div");
    dateEl.textContent = "(" + currentDate + ")"
    var tempEl = document.createElement("li");
    tempEl.setAttribute("class", "list-group-item border-0")
    tempEl.textContent = "Current Temp: " + getWeatherInfo.current.temp + " °F";
    var windEl = document.createElement("li");
    windEl.setAttribute("class", "list-group-item border-0")
    windEl.textContent =
      "Wind Speed: " + getWeatherInfo.current.wind_speed + " mph";
    var humidEl = document.createElement("li");
    humidEl.setAttribute("class", "list-group-item border-0")
    humidEl.textContent = "Humidity: " + getWeatherInfo.current.humidity + "%";
    var uviEl = document.createElement("li");
    uviEl.setAttribute("class", "list-group-item border-0")
    uviEl.textContent = "UV Index: ";
    var uviElColor = document.createElement("span");
    if(getWeatherInfo.current.uvi <= 2){
      uviElColor.setAttribute("class", "bg-success")
    }
    if(getWeatherInfo.current.uvi >= 3 && getWeatherInfo.current.uvi <=7){
      uviElColor.setAttribute("class", "bg-warning");
    }
    if(getWeatherInfo.current.uvi > 7){
      uviElColor.setAttribute("class","bg-danger");
    }
    uviElColor.textContent = getWeatherInfo.current.uvi
    uviEl.appendChild(uviElColor);
    dateEl.appendChild(weatherIcon);
    focusCityEl.appendChild(dateEl);
    focusCityEl.appendChild(tempEl);
    focusCityEl.appendChild(windEl);
    focusCityEl.appendChild(uviEl);
    createFutureCity();
  };
//create the 5 day forecast based on the city searched
var createFutureCity = function () {
    forecastEl.innerHTML = "";
//var cardContainerEl = document.createElement("div");
  var getWeatherInfo = JSON.parse(localStorage.getItem("weather"));
  for (let i = 0; i < 5; i++) {
    if (getWeatherInfo.daily[i].weather[0].main === "Clear"){
      var weatherIcon = document.createElement("i")
      weatherIcon.setAttribute("class", 'ri-sun-line');
    }
    else if (getWeatherInfo.daily[i].weather[0].main === "Clouds"){
      var weatherIcon = document.createElement("i")
      weatherIcon.setAttribute("class", "ri-cloudy-line")
    }
    else if (getWeatherInfo.daily[i].weather[0].main === "Rain"){
      var weatherIcon = document.createElement("i")
      weatherIcon.setAttribute("class", 'ri-showers-line');
    }
    else if (getWeatherInfo.daily[i].weather[0].main === "Snow"){
      var weatherIcon = document.createElement("i")
      weatherIcon.setAttribute ("class",'ri-snowy-line')
    }
    var forecastListContainerEl = document.createElement("div");
    forecastListContainerEl.setAttribute("class", "card-body");
    //get moment.js and add a day each time
    var futureDate = moment().add(i+1, "days").format("M/D/YYYY");
    var futureDateEl = document.createElement("div");
    futureDateEl.setAttribute("class", "text-white")
    futureDateEl.textContent = "(" + futureDate + ") "
    //create ul for all the elements
    var forecastListEl = document.createElement("ul");
    forecastListEl.setAttribute("class","card col-2 bg-primary")
    //create an li for all the different forecasts
    var forecastTempEl = document.createElement("li");
    forecastTempEl.setAttribute("class", "list-group-item border-0 bg-primary text-white");
    forecastTempEl.textContent =
      "Temp: " + getWeatherInfo.daily[i].temp.day + "°F";
    var forecastWindEl = document.createElement("li");
    forecastWindEl.setAttribute("class", "list-group-item border-0 bg-primary text-white");
    forecastWindEl.textContent =
      "Wind Speed: " + getWeatherInfo.daily[i].wind_speed + "mph";
    var forecastHumidEl = document.createElement("li");
    forecastHumidEl.setAttribute("class", "list-group-item border-0 bg-primary text-white");
    forecastHumidEl.textContent =
      "Humidity: " + getWeatherInfo.daily[i].humidity + "%";
    futureDateEl.appendChild(weatherIcon);
    forecastListContainerEl.appendChild(futureDateEl);
    forecastListContainerEl.appendChild(forecastTempEl);
    forecastListContainerEl.appendChild(forecastWindEl);
    forecastListContainerEl.appendChild(forecastHumidEl);
    forecastListEl.appendChild(forecastListContainerEl);
    forecastEl.appendChild(forecastListEl);
  }
};
//the date
//object.current.dt need to format unix into readable date
//icon of weather conditions
//need to accumulate all types of weather conditions and add a bootstrap or other icon framework for each
//sunny - sun - word is main:"Clear"
//cloudy - cloud - word is main:"Clouds"
//rainy - water drop - word is main:"Rain"
//snowy - snowflake - word is main:"Snow"
searchHistory();
searchBtnEl.addEventListener("click", searchButtonHandler);
searchHistoryBtnEl.addEventListener("click", searchHistoryBtnClickHandler)


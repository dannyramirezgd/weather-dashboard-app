var cityInputEl = document.querySelector("#city-name");
var stateInputEl = document.querySelector("#states");
var searchBtnEl = document.querySelector("#search-btn");
var select = document.getElementById("states");
var cityInput = document.getElementById("city-name");
var focusCityEl = document.getElementById("focus-city");
var cityDescriptors = document.getElementById("city-descriptors");
var searchHistoryEl = document.getElementById("search-history");
var forecastEl = document.getElementById("forecast");

//grabbing input from form and dropdown and pulling the lat and lon
var getLocationInfo = function(city, state){
    var apiUrl = "http://api.geonames.org/searchJSON?q=" + city + "&adminCode1=" + state + "&maxRows=10&username=dannyramirezgd"

    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                var lat = (data.geonames[0].lat)
                var lon = (data.geonames[0].lng)
                getWeatherInfo(lat, lon);
            });
        }else{
            alert("Error")
        }
    })
}
//get info from weather API based on lat and lon of city from getLocationInfo function
var getWeatherInfo = function (lat, lon){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +"&lon=" + lon +"&units=imperial&appid=56d05661cb74c3389542f3c94dddc04e"

    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                localStorage.setItem("weather", JSON.stringify(data));
            });
        } else {
            alert("Error: Did not receive response");
        }
    })
}
//create when button is clicked create city and state info for location and weather info functions
var searchButtonHandler = function (event){
    event.preventDefault()
    var value = select.options[select.selectedIndex].value;
    var cityName = cityInput.value;
    getLocationInfo(cityName, value)
    localStorage.setItem("cityname", JSON.stringify(cityName, value));
    createFocusedCity();
    searchHistory();
    createFutureCity();
}
var createFocusedCity = function(){
    var getWeatherInfo = JSON.parse(localStorage.getItem("weather"));
    focusCityEl.textContent = "";
    focusCityEl.textContent = cityInput.value + " , " + select.options[select.selectedIndex].value; 
    var tempEl = document.createElement("li");
    tempEl.textContent = "Current Temp: " + getWeatherInfo.current.temp + " °F";
    var windEl = document.createElement("li");
    windEl.textContent = "Wind Speed: " + getWeatherInfo.current.wind_speed + " mph"
    var humidEl = document.createElement("li");
    humidEl.textContent = "Humidity: " + getWeatherInfo.current.humidity + "%"
    var uviEl = document.createElement("li");
    uviEl.textContent = "UVI: " + getWeatherInfo.current.uvi 
    focusCityEl.appendChild(tempEl);
    focusCityEl.appendChild(windEl);
    focusCityEl.appendChild(uviEl); 
}
var searchHistory = function(){
    var searchHistoryBtn = document.createElement("button")
    searchHistoryBtn.textContent = cityInput.value + " , " + select.options[select.selectedIndex].value;
    searchHistoryEl.appendChild(searchHistoryBtn);
}
var createFutureCity = function(){
    var getWeatherInfo = JSON.parse(localStorage.getItem("weather"));
        for (let i=0; i<5; i++){
            var forecastListContainerEl = document.createElement("div");
            //get moment.js and add a day each time
            //add if statement for current weather and add icon
            //create ul for all the elements
            var forecastListEl = document.createElement("ul");
            //create an li for all the different forecasts
            var forecastTempEl = document.createElement("li");
            forecastTempEl.textContent = "Temp: " + getWeatherInfo.daily[i].temp.day + " °F"
            var forecastWindEl = document.createElement("li");
            forecastWindEl.textContent = "Wind Speed: " + getWeatherInfo.daily[i].wind_speed + " mph"
            var forecastHumidEl = document.createElement("li");
            forecastHumidEl.textContent = "Humidity: " + getWeatherInfo.daily[i].humidity + "%"
            forecastListEl.appendChild(forecastTempEl);
            forecastListEl.appendChild(forecastWindEl);
            forecastListEl.appendChild(forecastHumidEl) 
            forecastListContainerEl.appendChild(forecastListEl);
            forecastEl.appendChild(forecastListContainerEl);

    }
}
//after search is made add info as button into list under the form into local storage
//local storage should be the last city searched

//the info I need
//current weather conditions
    //object.current.weather[0].main describes the weather icon?
//future weather conditions
    //object.daily[i from 0-4].temp.day
    //object.daily[i from 0-4].wind_speed
    //object.daily[i from 0-4].humidity
//city name
    //doesn't display name in data need to find another way to do it. Maybe just append with text content in form? 
//the date
    //object.current.dt need to format unix into readable date
//icon of weather conditions
    //need to accumulate all types of weather conditions and add a bootstrap or other icon framework for each
        //sunny - sun - word is main:"Clear"
        //cloudy - cloud - word is main:"Clouds"
        //rainy - water drop - word is main:"Rain"
        //snowy - snowflake - word is main:"Snow"
searchBtnEl.addEventListener("click", searchButtonHandler);
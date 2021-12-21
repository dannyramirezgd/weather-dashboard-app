var cityInputEl = document.querySelector("#city-name");
var stateInputEl = document.querySelector("#states");
var searchBtnEl = document.querySelector("#search-btn");
var select = document.getElementById("states");
var cityInput = document.getElementById("city-name");
var focusCityEl = document.getElementById("focus-city");
var cityDescriptors = document.getElementById("city-descriptors");

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
    createFocusedCity();
}
var createFocusedCity = function(){
    var getWeatherInfo = JSON.parse(localStorage.getItem("weather"));
    console.log(getWeatherInfo.current.temp);
    focusCityEl.textContent = "";
    focusCityEl.textContent = cityInput.value + " , " + select.options[select.selectedIndex].value; 
    var tempEl = document.createElement("li");
    tempEl.textContent = "Current Temp: ";
    var windEl = document.createElement("li");
    var uviEl = document.createElement("li");
    //focusCityEl.appendChild(cityNameEl);
}
var createFutureCity = function(){
    //this is where the future forecast will go
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
//the temperature
    //object.current.temp
//the humidity
    //object.current.humidity
//the wind speed
    //object.current.wind_speed
//uv index
    //object.current.uvi
searchBtnEl.addEventListener("click", searchButtonHandler);
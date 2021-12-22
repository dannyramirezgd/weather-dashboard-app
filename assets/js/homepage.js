var cityInputEl = document.querySelector("#city-name");
var stateInputEl = document.querySelector("#states");
var searchBtnEl = document.querySelector("#search-btn");
var select = document.getElementById("states");
var cityInput = document.getElementById("city-name");
var focusCityEl = document.getElementById("focus-city");
var cityDescriptors = document.getElementById("city-descriptors");
var searchHistoryEl = document.getElementById("search-history");
var forecastEl = document.getElementById("forecast");
var selectValue = select.options[select.selectedIndex].value;
var cityNameObj = {};
var cityNameArr = [];
var saveCityNameArr = function(){
    // cityNameArr.push(cityNameObj)
    if(!JSON.parse(localStorage.getItem("cityNameArr"))){
       localStorage.setItem("cityNameArr", JSON.stringify(cityNameArr));
    } else{ 
        var tempCityNameArr = JSON.parse(localStorage.getItem("cityNameArr"));
        console.log(tempCityNameArr);
        tempCityNameArr.push(cityNameObj);
        cityNameArr = tempCityNameArr;
        localStorage.setItem("cityNameArr", JSON.stringify(cityNameArr));
        };
}
    
//grabbing input from form and dropdown and pulling the lat and lon
var getLocationInfo = function(city, state){
    var apiUrl = "http://api.geonames.org/searchJSON?q=" + city + "&adminCode1=" + state + "&maxRows=10&username=dannyramirezgd"

    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                if (data.geonames.length > 1){
                var lat = (data.geonames[0].lat)
                var lon = (data.geonames[0].lng)
                getWeatherInfo(lat, lon);
                } else {
                    alert("Please enter a valid City and State");
                    return;
                }
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
                var cityName = cityInput.value;
                var selectValue = select.options[select.selectedIndex].value;
                localStorage.setItem("weather", JSON.stringify(data));
                cityNameObj = {"cityName": cityName, "state" : selectValue, "lat" : lat, "lon": lon};
                saveCityNameArr();
                createFocusedCity();
                createFutureCity();
            });
        } else {
            alert("Error: Did not receive response");
        }
    })
}
//create when button is clicked create city and state info for location and weather info functions
var searchButtonHandler = function (event){
    var cityName = cityInput.value;
    var selectValue = select.options[select.selectedIndex].value;
    event.preventDefault()
    getLocationInfo(cityName, selectValue)
    forecastEl.innerHTML = "";
    focusCityEl.innerHTML = "";

}
//create container and information for the searched city
var createFocusedCity = function(){
    var getWeatherInfo = JSON.parse(localStorage.getItem("weather"));
    focusCityEl.textContent = "";
    focusCityEl.textContent = cityInput.value + ", " + select.options[select.selectedIndex].value; 
    var currentDate = new Date(getWeatherInfo.current.dt * 1000)
    var dateEl = document.createElement("div");
    dateEl.textContent = currentDate.toLocaleString();
    var tempEl = document.createElement("li");
    tempEl.textContent = "Current Temp: " + getWeatherInfo.current.temp + " °F";
    var windEl = document.createElement("li");
    windEl.textContent = "Wind Speed: " + getWeatherInfo.current.wind_speed + " mph"
    var humidEl = document.createElement("li");
    humidEl.textContent = "Humidity: " + getWeatherInfo.current.humidity + "%"
    var uviEl = document.createElement("li");
    uviEl.textContent = "UVI: " + getWeatherInfo.current.uvi 
    focusCityEl.appendChild(dateEl);
    focusCityEl.appendChild(tempEl);
    focusCityEl.appendChild(windEl);
    focusCityEl.appendChild(uviEl); 
}
//create new button for each searched city to create a search history
var searchHistory = function(){
    if(JSON.parse(localStorage.getItem("cityNameArr"))===null){
        searchHistoryArr = [];
    } else {
        searchHistoryArr = (JSON.parse(localStorage.getItem("cityNameArr")));
        for (var i=0; i<searchHistoryArr.length; i++){
            var searchHistoryBtn = document.createElement("button")
            searchHistoryBtn.textContent = searchHistoryArr[i].cityName + ", " + searchHistoryArr[i].state;
            searchHistoryEl.appendChild(searchHistoryBtn)
        }
    }
}
//create the 5 day forecast based on the city searched
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
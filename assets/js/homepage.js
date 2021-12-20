//fetch data from weather api by lat lon and exclude any parts?
var getWeatherInfo = function (lat, lon){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +"&lon=" + lon +"&units=imperial&appid=56d05661cb74c3389542f3c94dddc04e"
    console.log(apiUrl);
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
            });
        } else {
            alert("Error: Did not receive response");
        }
    })
}
//create a function on search
    // is there a way to search up cities and be given their lat and lon? 
//after search is made add info as button into list under the form into local storage
//local storage should be the last city searched
getWeatherInfo("20.45","-40.18");
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
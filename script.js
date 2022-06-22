var inputEl = document.querySelector("#cityInput");
const key = "a126aa1b20ff07eaa80dbf0130337921";
let recentList = document.getElementById('cityList');
var city = $("#city").val().trim();
var userCityName = '';

// making a call to the API to get forecast
let getForecast = function(city) {
    // add city name to URL
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key + "&units=imperial" ;
    // call API with updated URL
    fetch(queryURL)
            .then((response) => {
                    if (response.ok) {
                        response.json().then(function (data) {
                            displayCurrentWeather(data, city);
                            var lat = data.coord.lat;
                            var lon = data.coord.lon;
                            console.log(city + ` located at:`+lat+`x`+ lon);
                            weeklyForecast(lat, lon, city)
                            console.log(response)
                        });
                    } else {
                        alert("Error: " + response.statusText);
                    }
                })
};

let weeklyForecast = function(lat, lon) {
    var oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&units=imperial";
    fetch(oneCall)
            .then((response) => {
                    if (response.ok) {
                        response.json().then(function (data) {
                            console.log(data)
                            displayWeeklyWeather(data);
                            displayUvIndex(data);
                        });
                    } else {
                        alert("Error: " + response.statusText);
                    }
                })
};

// assigning function to run on button call
inputEl.addEventListener('submit', function(event){
    // stop the refreshes
    event.preventDefault();
    // naming variable from user input
    let city = $("#city").val().trim();
    // call forecast if valid city
    if(city) 
    {
        getForecast(city);
        $("#city").val("");
        let searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
        if (!searchedCities) {
            searchedCities = [];
        }
        // adding city to array
        searchedCities.push(city);
        // push updated array to local storage
        storeSearchedCities(searchedCities);
        // Update city list with new search
        addSearchedCities(searchedCities);        
    } else {
        alert("Enter a City Name");
    }
    

});


let displayCurrentWeather = function(Current, City) 
{
    const date = new Date(Current.dt * 1000)
    console.log(Current)
    $("#cityName").text(City + ":" + date.toLocaleDateString());
    $("#cityTemp").text("Temperature: " + Current.main.temp.toFixed(1) + "°F");
    $("#cityHumidity").text("Humidity: " + Current.main.humidity + "%");
    $("#cityWindSpeed").text("Wind Speed: " + Current.wind.speed.toFixed(1) + " mph");
};

let displayUvIndex = function(data)
{
    console.log(data)
    $("#uviColor").text(data.current.uvi);
    if(data.current.uvi <= 2){uviColor = "#20f209";}
            //  Background color for moderate exposure level UV Index
            else if(data.current.uvi > 2 && data.current.uvi <= 5){uviColor = "#e5ed09";}
            //  Background color for high exposure level UV Index
            else if(data.current.uvi > 5 && data.current.uvi <= 7){uviColor = "#f9912f";}
            //  Background color for very high exposure level UV Index
            else {uviColor = "#ff0000";}
            $("#uviColor").css({"background-color" : uviColor});
    // add current weather icon
    $("#currentIcon").attr("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
    console.log(data.current.weather[0].icon)
}

// function to add an ordered list containing an array of the searched cities
function addSearchedCities(searchedCities){
        let cityList = searchedCities.map(searchedCities => `<li><button>${searchedCities}</button></li>`).join('\n');
        document.querySelector('#cityList').innerHTML = cityList;
        console.log(cityList)
        $('#cityList').click(function(e){
            console.log(e.target.innerHTML)
            getForecast(e.target.innerHTML);
        })
    }




// save cities to local storage
function storeSearchedCities(searchedCities) {
    localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
    console.log(localStorage);
}

// function storeCities(){
//     // Stringify and set "cities" key in localStorage to cities array
//    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
//    console.log(localStorage);
//  }

let displayWeeklyWeather = function(data) {
    for (let i = 1; i < 6; i++) {
        $('#day' + i + 'Date').html(moment.unix(data.daily[i].dt).format ('dddd/MMMM/ Do YYYY'));
        $('#day' + i + 'Temp').html("Temperature: " + data.daily[i].temp.day + " &deg;F"); 
        $('#day' + i + 'Wind').html("Wind Speed: " + data.daily[i].wind_speed + " mph"); 
        $('#day' + i + 'Humidity').html("Humidity: " + data.daily[i].humidity + "%"); 
        var iconUrl = "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";
        $('#day' + i + 'Icon').attr("src", iconUrl);
     }
 };
// clear the search history list
$('#clearHistory').click (function(){
    localStorage.clear();
    $('#cityList').empty();
})
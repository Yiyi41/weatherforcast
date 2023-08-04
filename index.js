const opencagedataKey = "7549ef3c510041a1944be63b22641331";
const openWeatherKey = "727bc62434f50a6a25a292925405f678";

const inputCity = document.getElementById("inputCity");
const btnSubmit = document.getElementById("btnSubmit");

// GET INPUT VALUE --> (CITY)
let cityName = "";
inputCity.addEventListener("input", () => {
  let city = inputCity.value;
  cityName = encodeURIComponent(city);
});

// GET LON AND LAT OF LOCATION FROM opencagedata API
function getLocation(cityName) {
  return fetch(
    `https://api.opencagedata.com/geocode/v1/json?key=${opencagedataKey}&q=${cityName}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results[0]);
      return data.results[0].geometry;

      //   return geometry;
    })
    .catch(() => console.log("error"));
}

// GET WEATHER OF THE INPUT CITY FROM openweathermap API
async function getWeather(coord) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${coord.lat}&lon=${coord.lng}&exclude={part}&appid=${openWeatherKey}`
    );
    const data = await res.json();
    // console.log(data);
    return data;
  } catch (e) {
    return console.log("error");
  }
}

// FUNC FOR REMOVING PREVIOUS DISPLAY WHEN SEARCH ANOTHER CITY WEATHER
function removeImgAndSpan() {
  // réécir la fonction
  const weekDayContainer = document.getElementById("weekDay-container");

  const imgContainer = document.getElementById("img-container");

  while (imgContainer.hasChildNodes()) {
    imgContainer.removeChild(imgContainer.childNodes[0]);
  }

  while (weekDayContainer.hasChildNodes()) {
    weekDayContainer.removeChild(weekDayContainer.childNodes[0]);
  }
  // console.log(weekDayContainer);
}

// FUNC FOR INJECT IMG -->(weather icon) ELEMENT IN HTML
function createImg(imgName) {
  const imgContainer = document.getElementById("img-container");
  const img = document.createElement("img");
  img.src = `./assets/${imgName}.svg`;
  //img.alt
  imgContainer.appendChild(img);
}

//   FUNC FOR INJECT WEEK DAY SPAN ELEMENT IN HTML
function createWeekDaySpan(text) {
  const weekDayContainer = document.getElementById("weekDay-container");
  const weekDaySpan = document.createElement("span");
  weekDaySpan.innerHTML = text;
  weekDayContainer.appendChild(weekDaySpan);
}

// FUNC RECEIVES DATA THEN CALLS ABOVE FUNC IN "FOR" TO DISPLAY DATA
async function myFunctionResolve() {
  let locationResult = await getLocation(cityName);
  let weatherResults = await getWeather(locationResult);
  //   console.log(weatherResults[0].dt);

  //Switch light and dark mode depending on the time of searching city
  const body = document.body;
  let iconValue = weatherResults.current.weather[0].icon; // value shows if daytime or nighttime
  let indication = iconValue[iconValue.length - 1];
  // console.log(iconValue[iconValue.length - 1]);
  if (indication === "n") {
    body.classList.remove("lightBlue");
    body.classList.add("darkBlue");
  }

  // un aure if pour de jour à la nuit

  removeImgAndSpan(); // ---> remove previous weather display before new search

  // get value of option of nb days to display
  let nbDaysSelectorValue = document.querySelector("select").value;
  let nbDaysToDisplay;
  if (nbDaysSelectorValue === "oneDay") nbDaysToDisplay = 1;
  else if (nbDaysSelectorValue === "threeDays") nbDaysToDisplay = 3;
  else if (nbDaysSelectorValue === "fiveDays") nbDaysToDisplay = 5;
  else if (nbDaysSelectorValue === "sevenDays") nbDaysToDisplay = 7;

  // ---> get current day of the week
  const currentDay = new Date(); // ---> current day
  let today = currentDay.getDay(); // ---> week day in number
  const weekTab = [
    // ---> ceation week days in an array for diplay week day in span
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  for (let iDay = 0; iDay < nbDaysToDisplay; iDay++) {
    // console.log("today + iDay" + (today + iDay));
    // console.log("iDay " + iDay);
    createWeekDaySpan(weekTab[(today + iDay) % 7]); // % for reset my loop to 0 every time if iDay equal to 6

    // ---> making dynamiclly icon's src to display weather icons
    let weatherId = weatherResults.daily[iDay].weather[0].id;
    let description;
    if (
      (weatherId >= 500 && weatherId <= 531) ||
      (weatherId >= 200 && weatherId <= 232) ||
      (weatherId >= 701 && weatherId <= 781) ||
      (weatherId >= 300 && weatherId <= 321)
    ) {
      description = "rain";
      createImg(description);
    } else if (weatherId >= 600 && weatherId <= 622) {
      description = "snow";
      createImg(description);
    } else if (weatherId == 800) {
      description = "sun";
      createImg(description);
    } else if (weatherId >= 801 && weatherId <= 802) {
      description = "cloudy";
      createImg(description);
    } else if (weatherId >= 803 && weatherId <= 804) {
      description = "clouds";
      createImg(description);
    }
  }
}

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  myFunctionResolve();
});

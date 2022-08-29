
const getWeather = async (latitude, longitude, startDate, endDate) => {
  const url = `https://archive-api.open-meteo.com/v1/era5?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max&timezone=Europe/Madrid&timezone_abbreviation=CEST`
  const response = await fetch(url)
  const data = response.json()
  return data
}
const weatherForn = document.querySelector("form")
const weatherContainer = document.querySelector("#weather-container")

weatherForn.addEventListener("submit", async (event) => {
  const formData = new FormData(weatherForn)
  const data = {
    latitude: formData.get("weather-latitude"),
    longitude: formData.get("weather-longitude"),
    startDate: formData.get("weather-start-date"),
    endDate: formData.get("weather-end-date")
  }
  weatherForn.reset()
  event.preventDefault()
  const weather = await getWeather(data.latitude, data.longitude, data.startDate, data.endDate)
  weatherContainer.innerHTML = `
<div id="location-details">
<p>Location: ${weather.latitude} - ${weather.longitude}</p>
</div>
<div id="timezone-details">
<p>Timezone: ${weather.timezone} ${weather.timezone_abbreviation}</p>
</div>
<div id="graphic"></div>
`
  const temperaturesArray = []
  const datesArray = []

  for (let i = 0; i < weather.daily.temperature_2m_max.length; i++) {
    temperaturesArray.push(weather.daily.temperature_2m_max[i])
    weather.daily.time[i] = new Date(weather.daily.time[i]).toLocaleDateString()
    datesArray.push(weather.daily.time[i])
  }
  console.log(weather)
  const temperatureTrace = [{
    x: temperaturesArray,
    y: datesArray,
    type: "bar",
    marker: { color: "rgb(32,37,40)" },
    width: []
  }]
  for (let i = 0; i < temperaturesArray.length; i++) {
    temperatureTrace[0].width.push(0.5)
  }
  const layout = {
    xaxis: { range: [Math.min(...temperaturesArray), Math.max(...temperaturesArray)], title: "ºC" },
    yaxis: { range: [0, datesArray.length], title: "Day" },
    autosize: true,
    title: "Daily Weather"
  }
  // eslint-disable-next-line
  Plotly.newPlot("graphic", temperatureTrace, layout, { scrollZoom: true })
})

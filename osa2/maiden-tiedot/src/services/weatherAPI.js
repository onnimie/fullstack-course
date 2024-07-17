import axios from 'axios'


// Running the app with vite, add the API key to e.g. an environment variable by:
// set "VITE_WEATHER_API_KEY=apikeyhere" && npm run dev

// with this, we access it as follows:
const api_key = import.meta.env.VITE_WEATHER_API_KEY


const getWeatherWithLongitudeLatitude = (lon, lat) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
    const promiseResponse = axios.get(url).then(res => res.data)
    return promiseResponse
}


export default {
    getWeatherWithLongitudeLatitude
}
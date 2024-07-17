
const icon_url = (id) => {
    return `https://openweathermap.org/img/wn/${id}@2x.png`
}

const WeatherInfo = ({countryObj, weatherObj}) => {
    if (!weatherObj || !countryObj) {
        return <></>
    } else {
        const temp = weatherObj.main.temp
        const iconID = weatherObj.weather[0].icon
        const windspeed = weatherObj.wind.speed
        const city = countryObj.capital[0]
        return (
            <div>
                <h3>
                    Weather in {city}
                </h3>
                <p>
                    temperature {temp} Celsius
                </p>
                <img src={icon_url(iconID)} alt='an img depicting the weather' />
                <p>
                    wind {windspeed} m/s
                </p>
            </div>
        )
    }
}


export default WeatherInfo
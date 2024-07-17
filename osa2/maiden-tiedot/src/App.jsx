import { useState } from 'react'
import CountryInfo from './components/CountryInfo'
import SearchBar from './components/SearchBar'
import countriesAPI from './services/countriesAPI'
import SearchOutput from './components/SearchOutput'
import weatherAPI from './services/weatherAPI'
import WeatherInfo from './components/WeatherInfo'



function App() {

  const [searchBarValue, setSearchBarValue] = useState('')
  const [searchOutputList, setSearchOutputList] = useState([])
  const [searchOutputError, setSearchOutputError] = useState('')
  const [searchOutputCountry, setSearchOutputCountry] = useState(null)
  const [searchOutputCountryWeather, setSearchOutputCountryWeather] = useState(null)

  const searchOutputThreshold = 10 //if output has more countries, render some message that says its too many

  const overThresholdMessage = "Too many matches, specify further"
  const noMatchMessage = "No country matches the specification"


  const showSingleCountryInfo = name => {
    countriesAPI.getCountryByName(name).then(res => {
      setSearchOutputCountry(res)
      setSearchOutputError('')
      setSearchOutputList([])

      const [lat,lon] = res.capitalInfo.latlng
      weatherAPI.getWeatherWithLongitudeLatitude(lon,lat).then(res => {

        setSearchOutputCountryWeather(res)

      })
      .catch(err => {
        console.log("error in getWeatherWithLonLat", err)
      })

    })
    .catch(err => {
      console.log("error in getCountryByName", err)
    })
  }


  const handleSearchBarInputChange = (event) => {
    //console.log(event.target.value)
    setSearchBarValue(event.target.value)

    countriesAPI.getAllNamesCommon()
      .then(res => {

        const filteredNames = res.filter(n => n.toLowerCase().includes(event.target.value.toLowerCase()))

        //console.log(filteredNames)
        if (filteredNames.length > 0) {

          if (filteredNames.length === 1) {
            // show the country info for this country

            showSingleCountryInfo(filteredNames[0])

          } else {

            if (filteredNames.length > searchOutputThreshold) {
              // too many countries to list
              setSearchOutputError(overThresholdMessage)
              setSearchOutputList([])
              setSearchOutputCountry(null)
              setSearchOutputCountryWeather(null)

            } else {

              // output the countries
              setSearchOutputList(filteredNames)
              setSearchOutputError('')
              setSearchOutputCountry(null)
              setSearchOutputCountryWeather(null)
            }
          }
        } else {
          // the list is empty, i.e., no matches

          setSearchOutputList([])
          setSearchOutputError(noMatchMessage)
          setSearchOutputCountry(null)
          setSearchOutputCountryWeather(null)
        }


      })
      .catch(err => {
        console.log("Some error in getAllNamesCommon", err)
      })
  }

  const showCountryButtonClicked = (name) => {
    showSingleCountryInfo(name)
  }

  return (
    <div>
      <h1>
        React app for finding information on countries
      </h1>

      <SearchBar onInputChange={handleSearchBarInputChange} value={searchBarValue} />

      <p>{searchOutputError}</p>

      <SearchOutput countryNames={searchOutputList} showFunction={showCountryButtonClicked} />

      <CountryInfo countryObj={searchOutputCountry} />

      <WeatherInfo countryObj={searchOutputCountry} weatherObj={searchOutputCountryWeather} />
    </div>
  )
}

export default App

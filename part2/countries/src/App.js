import { useEffect, useState } from 'react'
import axios from 'axios'

const CountryView = ({ country, weatherDetails}) => {
  const data = country[0]
    return (
      <>
        <h1>{data.name.common}</h1>
        <p>Capital: {data.capital}</p>
        <p>Area: {data.area}</p>
        <h4>Languages:</h4>
        <ul>{Object.values(data.languages).map(values => <li key={Object.values(data.languages).indexOf(values)}>{values}</li>)}</ul>
        <img src={data.flags.png} alt="flag" />
        <h3>Weather in {data.capital}</h3>
        <p>Temperature is {weatherDetails.temp} °C </p>
        {weatherDetails.icon ? (<img src={`https://www.weatherbit.io/static/img/icons/${weatherDetails.icon}.png`} alt="weather icon"></img>):(<></>)}
        <p>Wind speed is {weatherDetails.wind_speed} m/s</p>
      </>
    )
  }

  const ShowButton = ({country, showCountry}) => {
    return(
      <div>
      {country.name.common} <button onClick={() => showCountry(country)}>show</button>
      </div>
    )
  }

  const ListView = ({countries, showCountry, weatherDetails}) => {
    if(countries.length === 1){
      return <CountryView country = {countries} weatherDetails = {weatherDetails}/>
    }else if(countries.length <= 10){
      return countries.map(country => <ShowButton key = {countries.indexOf(country)} country = {country} showCountry = {showCountry}/>)
    }else if(countries.length > 10){
      return <p>Too many matches, specify another filter</p>
    }else{
      return <p>No match found</p>
    }
  }



const App = () => {
  const [countries, setCountries] = useState([])
  const [weatherDetails, setWeatherDetails] = useState({data: [{temp:null}]})
  const [filter, setFilter] = useState("")
  const [filteredCountries, setFilteredCountries] = useState(countries)

  const showCountry = (country) => {
    setFilteredCountries([country])
  }
  
  const updateListView = () => {
    setFilteredCountries(countries.filter(country => country.name.official.toLowerCase().includes(filter)))
  }

  const getCountries = () => {
    axios.get('https://restcountries.com/v3.1/all')
    .then(response => {
      setCountries(response.data)
    }
    )
  }

  const getWeatherDetails = () => {
    if(filteredCountries.length === 1){
      axios.get(`https://api.weatherbit.io/v2.0/current?lat=${filteredCountries[0].latlng[0]}&lon=${filteredCountries[0].latlng[1]}&key=${process.env.REACT_APP_WEATHERBIT}&include=minutely`)
        .then(response => {
          let weather = {
            temp: response.data.data[0].temp,
            wind_speed: response.data.data[0].wind_spd,
            icon: response.data.data[0].weather.icon
          }
        setWeatherDetails(weather);
      })
    }
  }

  useEffect(getWeatherDetails, [filteredCountries])
  useEffect(getCountries,[])
  useEffect(updateListView,[countries, filter])

  return (
    <div>
        Find countries: <input value={filter} onChange={(event) => setFilter(event.target.value)} />
        {/* maps each filtered country to a new html element and displays them in paragraph */}
        <ListView countries={filteredCountries} showCountry={showCountry} weatherDetails = {weatherDetails}/>
    </div>
  )
}

export default App
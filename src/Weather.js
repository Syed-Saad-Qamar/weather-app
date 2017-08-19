/* eslint-disable react/prop-types */
import React, { Component } from "react"
import { compose } from "recompose"
import Temperature from "./Temperature"
import { toFahrenheit } from "./pure-functions"

class Weather extends Component {
  state = {
    isLoading: true,
    location: {},
    temperature: 0,
    condition: {},
    isCelsius: true
  }
  componentDidMount = () => {
    // start updating weather data
    this.loadWeatherData()
    this.timer = setInterval(this.loadWeatherData, 20000)
  }
  componentWillUnmount = () => {
    clearInterval(this.timer)
  }
  loadWeatherData = async () => {
    let dummyWeatherServer = "http://127.0.01:3001/api"
    let dummyWeatherIcon = "http://127.0.0.1:3001/cloudy.png"
    this.setState({ isLoading: true })
    try {
      let response = await fetch(dummyWeatherServer)
      let data = await response.json()
      this.setState({
        isLoading: false,
        location: data.location,
        temperature: data.current.temp_c,
        condition: data.current.condition,
        icon: dummyWeatherIcon
      })
    } catch (error) {
      console.error(error)
    }
  }
  toggleTemperatureScale = () => {
    this.setState({
      isCelsius: !this.state.isCelsius
    })
  }
  render() {
    let {
      condition,
      isCelsius,
      temperature,
      location,
      isLoading,
      icon
    } = this.state
    let { name } = location
    let { text } = condition
    return (
      <TemperatureWithLoading
        onClick={this.toggleTemperatureScale}
        isLoading={isLoading}
        location={name}
        temperature={isCelsius ? temperature : toFahrenheit(temperature)}
        text={text}
        temperatureScale={isCelsius ? "C" : "F"}
        icon={icon}
      />
    )
  }
}

// For fun let's use some Higher Order Components
// See https://www.robinwieruch.de/gentle-introduction-higher-order-components/
const withLoading = Component => props =>
  <div>
    {props.isLoading ? <span>Loading...</span> : <Component {...props} />}
  </div>

const Panel = props =>
  <div style={weatherStyles}>
    <Temperature {...props} />
  </div>

const TemperatureWithLoading = compose(withLoading)(Panel)

let weatherStyles = {
  width: "300px",
  height: "220px",
  border: "1px solid #fdb",
  borderRadius: "3%",
  backgroundColor: "#ffd"
}

export default Weather

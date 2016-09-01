//npm install suncalc --save
import * as SunCalc from 'suncalc'

fetch('http://ip-api.com/json')
  .then((response) => {
    return response.json()
  })
  .then((json) => {
    const now = +new Date()
    const sunset = +new Date(SunCalc.getTimes(+new Date(), json.lat, json.lon).sunset)
    if(now > sunset) {
      const classList = document.querySelector('html').getAttribute('class')
      document.querySelector('html').setAttribute('class', `${classList} inverted`)
    }
  })


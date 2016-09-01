//npm install suncalc --save
import * as SunCalc from 'suncalc'

const html = document.querySelector('html')

fetch('https://ip-api.com/json')
  .then((response) => {
    return response.json()
  })
  .then((json) => {
    const now = +new Date()
    const sunset = +new Date(SunCalc.getTimes(+new Date(), json.lat, json.lon).sunset)
    if(now > sunset) {
      const classList = html.getAttribute('class')
                        html.setAttribute('class', `${classList} inverted`)
    }
  })


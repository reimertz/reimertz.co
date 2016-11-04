import fetch from 'isomorphic-fetch'
import * as SunCalc from 'suncalc'

const html = document.querySelector('html')
let isNightMode = false


function toggleNightMode(buttonEl) {
  const buttonReplaceArgs = isNightMode ?  ['✓', 'x'] : ['x', '✓']
  const list = html.getAttribute('class')
  let newList = isNightMode ? list.replace('night-mode-on', '') : `${list} night-mode-on`

  html.setAttribute('class', newList)

  buttonEl.innerHTML = buttonEl.innerHTML.replace(buttonReplaceArgs[0], buttonReplaceArgs[1])

  isNightMode = !isNightMode
}

fetch('https://geo-location.api.reimertz.co')
  .then((response) => {
    return response.json()
  })
  .then((json) => {
    const now = +new Date()
    const sunset = +new Date(SunCalc.getTimes(+new Date(), json.lat, json.lon).sunset)

    if (now > sunset) toggleNightMode()
  })


document.querySelector('[data-night-mode-toggle]').addEventListener('click', (e) => {
  toggleNightMode(e.target)
})

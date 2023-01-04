import { getPlayAgainButton, getTimerElement } from './selectors.js'

// Create funciton shuffle
function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length <= 2) return arr

  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i)

    // hoán đổi vị trí
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor

  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  // random "Count" color
  for (let i = 0; i < count; i++) {
    // randomColor function is provice https://github.com/davidmerfield/randomColor
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    })

    colorList.push(color)
  }

  // mỗi màu xuất hiện lần, nên sẽ tạo ra 2 mảng màu giống nhau
  const fullColorList = [...colorList, ...colorList]

  // đảo lộn các màu
  shuffle(fullColorList)

  return fullColorList
}

// bài 220
export function showPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.classList.add('show')
}

export function hidePlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.classList.remove('show')
}

export function setTimerText(text) {
  const timerElement = getTimerElement()
  if (timerElement) timerElement.textContent = text
}

// bài 222
export function createTimer({ seconds, onChange, onFinish }) {
  let intervalId = null

  function start() {
    clear()

    let currentSeconds = seconds
    intervalId = setInterval(() => {
      if (onChange) {
        onChange(currentSeconds)
      }

      currentSeconds--
      if (currentSeconds < 0) {
        clear()

        if (onFinish) {
          onFinish()
        }
      }
    }, 1000)
  }

  function clear() {
    clearInterval(intervalId)
  }

  return {
    start,
    clear,
  }
}

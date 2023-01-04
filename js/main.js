import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getColorBackground,
  getColorElementList,
  getColorListElement,
  getInActiveColorList,
  getPlayAgainButton,
} from './selectors.js'
import {
  getRandomColorPairs,
  showPlayAgainButton,
  setTimerText,
  hidePlayAgainButton,
  createTimer,
} from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING

// bài 222

let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})

function handleTimerChange(seconds) {
  // console.log('change', seconds)

  // tạo luôn luôn có 2 chữ số
  const fullSecond = `0${seconds}`.slice(-2)
  setTimerText(fullSecond)
}

function handleTimerFinish() {
  // console.log('finish')

  // end game
  gameStatus = GAME_STATUS.FINISHED
  setTimerText('Game Over!!!')
  showPlayAgainButton()
}

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

// b3: create function handleColorClick
// handleColorClick 1
// handleColorClick 2
// handleColorClick 3
// setTimeout 2 -> reset selectioins
// setTimeout 3 -> errors here

function handleColorClick(liElement) {
  //   console.log(liElement)
  // 219 : check block click
  const checkBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
  // bài 220
  const checkIsClicked = liElement.classList.contains('active')

  if (!liElement || checkIsClicked || checkBlockClick) return

  liElement.classList.add('active')

  // 219: sau khi click vào ô thì sẽ lưu liElement vào mảng selection
  selections.push(liElement)
  if (selections.length < 2) return

  // 219 check Match
  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMatch = firstColor === secondColor

  if (isMatch) {
    // check win
    const isWin = getInActiveColorList().length === 0
    if (isWin) {
      // bài 220: hiển thị vòng chơi mới
      showPlayAgainButton()
      // hiển thị You win
      setTimerText('YOU WIN!!!')

      // bài 222
      timer.clear()

      // set game status
      gameStatus = GAME_STATUS.FINISHED
    }

    selections = []
    return
  }

  // 219 in case of not match
  // xóa class active trong 2 Element
  gameStatus = GAME_STATUS.BLOCKING

  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')

    // 219 reset mảng selections cho lần chọn tiếp theo
    selections = []

    // bài 223 : race-condition check with handleTimerFinish
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 500)
}

// console.log(getRandomColorPairs(5))
// b1: create funciton initColor
function initColors() {
  // random 8 pairs of color
  const colorList = getRandomColorPairs(PAIRS_COUNT)

  // bind to li > div.overlay
  const liList = getColorElementList()
  liList.forEach((liElements, index) => {
    // 219: add datacolor into Li element
    liElements.dataset.color = colorList[index]

    // tìm ra class overlay trong mỗi li và gán mã màu vào cho nó
    const overlayElement = liElements.querySelector('.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
  })
}

// b2: create function attachEventForColorList
function attachEventForColorList() {
  // get ul
  const ulElement = getColorListElement()
  if (!ulElement) return

  // sử dụng event delegation
  ulElement.addEventListener('click', (event) => {
    // 219 :
    if (event.target.tagName !== 'LI') return

    // console.log(event.target)
    handleColorClick(event.target)
  })
}

// bài 220 create function resetGame
function resetGame() {
  // reset global vars
  gameStatus = GAME_STATUS.PLAYING
  selections = []
  // reset DOM element
  //  - remove active class from li
  //  - hide play again button
  //  - clear you win / timout text
  const colorElementList = getColorElementList()
  for (const colorElement of colorElementList) {
    colorElement.classList.remove('active')
  }

  hidePlayAgainButton()
  setTimerText('')
  // re-generate new colors
  initColors()

  // bài 222 : start new game
  startTimer()
}

// bài 220
function attachEventForPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (!playAgainButton) return

  playAgainButton.addEventListener('click', resetGame)
}

// bài 222 create startTimer
function startTimer() {
  timer.start()
}

// main
;(() => {
  initColors()

  attachEventForColorList()

  // bài 220
  attachEventForPlayAgainButton()

  // bài 222
  startTimer()
})()

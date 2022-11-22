<template>
  <div :class="$style.layout">
    <canvas id="gameboard"></canvas>

    <div :class="$style.controls">
      <button
        @click="
          () => {
            currentGameType = gameType.NORMAL
            resetGame(gameBoard)
          }
        "
      >
        Normal Mode
      </button>
      <button
        @click="
          () => {
            currentGameType = gameType.BEST_OF_THREE
            resetGame(gameBoard)
          }
        "
      >
        Best of 3
      </button>
      <button
        @click="
          () => {
            currentGameType = gameType.BEST_OF_FIVE
            resetGame(gameBoard)
          }
        "
      >
        Best of 5
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { GameBoard } from './gameComponents'
import { gameType, gameHands, winnerResult } from './gameSchema'

const vueCanvas = ref(null)
const gameBoard = ref(null)
const playerWinCount = ref(0)
const computerWinCount = ref(0)
const tieCount = ref(0)
const totalGamesPlayCount = ref(0)
const currentGameType = ref(gameType.NORMAL)

function computerHandGenerator() {
  const gameHandKeys: string[] = Object.keys(gameHands)
  const randomIndex = Math.floor(Math.random() * gameHandKeys.length)
  const computerHand: gameHands = gameHands[gameHandKeys[randomIndex]]
  return computerHand
}

function calculateWinner(
  playerHand: gameHands,
  computerHand: string
): winnerResult {
  if (playerHand === computerHand) {
    tieCount.value++
    return winnerResult.TIE
  } else if (
    (playerHand === gameHands.ROCK && computerHand == gameHands.SCISSORS) ||
    (playerHand === gameHands.PAPER && computerHand == gameHands.ROCK) ||
    (playerHand === gameHands.SCISSORS && computerHand == gameHands.PAPER)
  ) {
    playerWinCount.value++
    return winnerResult.PLAYER
  } else {
    computerWinCount.value++
    return winnerResult.COMPUTER
  }
}

function playRockPaperScissor(playerHand: gameHands) {
  const computerHand: string = computerHandGenerator()

  const winner = calculateWinner(playerHand, computerHand)
  totalGamesPlayCount.value++
  const gameResult = { playerHand, computerHand }

  // Currently only Normal Mode is used on UI
  if (currentGameType.value === gameType.NORMAL) {
    gameBoard.value.gameWinnerAnimation(winner.toString(), gameResult, false)
  } else {
    const maxRounds = currentGameType.value === gameType.BEST_OF_FIVE ? 5 : 3
    const winRequired = Math.round(maxRounds / 2)

    if (playerWinCount.value >= winRequired) {
      gameBoard.value.gameWinnerAnimation(winnerResult.PLAYER, gameResult, true)
    } else if (computerWinCount.value >= winRequired) {
      gameBoard.value.gameWinnerAnimation(
        winnerResult.COMPUTER,
        gameResult,
        true
      )
    } else if (totalGamesPlayCount.value === maxRounds) {
      gameBoard.value.gameWinnerAnimation(winnerResult.TIE, gameResult, true)
    } else {
      gameBoard.value.continueGame(gameResult)
    }
  }

  gameBoard.value.drawScore(
    playerWinCount.value,
    computerWinCount.value,
    tieCount.value,
    totalGamesPlayCount.value
  )
}

function resetGame(board) {
  playerWinCount.value = 0
  computerWinCount.value = 0
  tieCount.value = 0
  totalGamesPlayCount.value = 0
  board.clearCanvas()
  board.drawScore(
    playerWinCount.value,
    computerWinCount.value,
    tieCount.value,
    totalGamesPlayCount.value
  )
  board.startGameText()
}

onMounted(() => {
  vueCanvas.value = document.getElementById('gameboard')
  const board = new GameBoard(vueCanvas.value)
  let context = board.canvas.getContext('2d')
  board.draw()
  let buttons = board.buttons

  board.canvas.addEventListener('click', function (event) {
    const bounds = vueCanvas.value.getBoundingClientRect()
    const xPos = event.clientX - bounds.left + 15
    const yPos = event.clientY - bounds.top + 15

    if (buttons.Rock.onClick(xPos, yPos)) {
      playRockPaperScissor(gameHands.ROCK)
    }
    if (buttons.Paper.onClick(xPos, yPos)) {
      playRockPaperScissor(gameHands.PAPER)
    }
    if (buttons.Scissors.onClick(xPos, yPos)) {
      playRockPaperScissor(gameHands.SCISSORS)
    }
    if (buttons.Reset.onClick(xPos, yPos)) {
      resetGame(board)
    }
  })

  board.drawScore(
    playerWinCount.value,
    computerWinCount.value,
    tieCount.value,
    totalGamesPlayCount.value
  )
  board.startGameText()
  gameBoard.value = board
})
</script>

<style module lang="scss">
.layout {
  display: grid;
  grid-gap: 10px;
  background-color: none;
  margin: auto;

  .controls {
    margin: auto;
  }
}

canvas {
  background-color: black;
  margin: auto;
  padding: 15px;
}
</style>

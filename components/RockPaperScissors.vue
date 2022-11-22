<template>
  <div :class="$style.layout">
    <button @click="playRockPaperScissor(gameHands.ROCK)">Rock</button>
    <button @click="playRockPaperScissor(gameHands.PAPER)">Paper</button>
    <button @click="playRockPaperScissor(gameHands.SCISSORS)">Scissors</button>
    <div>{{ `Total Games Played ${totalGames}`}}</div>
    <div>{{ `Total Games Played ${totalGames} computer wins ${computerWins} userWins${playerWins} ties${tiedGames}` }}</div>
    <button @click=resetGame()> Reset Game </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const totalGames = ref(0)
const computerWins = ref(0)
const tiedGames = ref(0)
const playerWins = ref(0)

enum gameHands {
  ROCK = 'ROCK',
  PAPER = 'PAPER',
  SCISSORS = 'SCISSORS',
}

function computerHandGenerator(): gameHands {
   const gameHandKeys = Object.keys(gameHands)
   const randomSelection = Math.floor(Math.random()* gameHandKeys.length)
   return gameHands[gameHandKeys[randomSelection]]
}

function calculateWinner(playerHand : gameHands, computerHand : gameHands) {
  if (playerHand === computerHand) {
    tiedGames.value++
  } else if (
    (playerHand === gameHands.ROCK && computerHand == gameHands.SCISSORS) ||
    (playerHand === gameHands.PAPER && computerHand == gameHands.ROCK) ||
    (playerHand === gameHands.SCISSORS && computerHand == gameHands.PAPER)
  ) {
    playerWins.value++
  } else {
    computerWins.value++
  }
}

function playRockPaperScissor(playerHand: gameHands) {
  const computerHand: gameHands = computerHandGenerator()
  calculateWinner(playerHand, computerHand)

  totalGames.value++
}

function resetGame(){
 computerWins.value=0;
 playerWins.value=0;
 tiedGames.value=0;
}
</script>

<style module lang="scss">
.layout {
  display : grid;
  background-color: green;

}
</style>

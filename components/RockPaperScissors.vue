
<template>
  <div
    :class="$style.test"
  >
   <button @click="playRockPaperScissor"> Rock</button>
      <button @click="playRockPaperScissor"> Rock</button>
         <button @click="playRockPaperScissor"> Rock</button>
   <div> {{`Total Games Played ${totalGames}`}}
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';

const totalGames = ref(0);
const computerWins = ref(0);
const tiedGames = ref(0)
const playerWins = ref(0);

enum gameHands {
 ROCK = "ROCK",
 PAPER = "PAPER",
 SCISSORS = "SCISSORS"
}

function computerHandGenerator():gameHands{
  return gameHands.ROCK
}

function calculateWinner(playerHand, computerHand){
  if(playerHand === computerHand){
    tiedGames.value++
  }else if(playerHand === gameHands.ROCK && computerHand == gameHands.SCISSORS 
  || playerHand === gameHands.PAPER && computerHand == gameHands.ROCK 
  || playerHand === gameHands.SCISSORS && computerHand == gameHands.PAPER){
    playerWins.value++
  }else {
    computerWins.value++
  }
}
function playRockPaperScissor(playerHand : gameHands){
  console.log(`Played Game$ ${totalGames.value}`)
  const computerHand : gameHands = computerHandGenerator();

  calculateWinner(playerHand,computerHand);

  totalGames.value++
}


 
</script>

<style module>
  .test{
    background-color: aqua;
    }

</style>

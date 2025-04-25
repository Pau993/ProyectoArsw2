<template>
    <div class="game-page">
      <GameCanvas />
    </div>
  </template>
  
  <script setup>
  import GameCanvas from '~/components/GameCanvas.vue'
  </script>
  
  <style scoped>
  .game-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #333;
  }
  </style>
<template>
  <div id="app">
    <v-app dark>
      <Header title="Submittal Workflow and Tracking"></Header>
      
      <v-main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script setup>
  import Header from './components/Header'
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap');
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: 'Poppins', sans-serif;
  }
  
  .v-card__title {
      background: linear-gradient(74deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.25))
  }
  
  .v-toolbar {
      background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.25))
  }
  
  .v-expansion-panel-header {
      background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.25))
  }
</style>

<template>
  <v-app-bar
    app
    fixed
    color="pink darken-4"
    dark
    shrink-on-scroll
    prominent
    src="https://picsum.photos/1920/1080?random"
    fade-img-on-scroll
  >
    <template v-slot:img="{ props }">
      <v-img
        v-bind="props"
        gradient="to top right, rgba(57, 17, 68,.7), rgba(172, 88, 166,.7)"
      ></v-img>
    </template>

    <v-app-bar-nav-icon></v-app-bar-nav-icon>

    <v-app-bar-title class="title">{{ title }}</v-app-bar-title>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn icon @click="toggleSubmittalView('table')" v-show="submittalview=='cards'">
      <v-icon>mdi-table</v-icon>
    </v-btn>
    
    <v-btn icon @click="toggleSubmittalView('cards')" v-show="submittalview=='table'">
      <v-icon>mdi-cards</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>

    <template v-slot:extension>
      <v-tabs align-with-title color="pink lighten-2">            
        <v-tab to="/">Home</v-tab>
        <v-tab to="/submittals">Submittals</v-tab>
        <v-tab to="/projects">Projects</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script setup>
  import { ref } from 'vue';
  import router from '@/router';
  
  const title = "Submittal Workflow and Tracking";
  const submittalview = ref('cards');
  const toggleSubmittalView = (view) => {
        submittalview.value = view;
        router.push({ path: '/submittals/'+view });
    }
</script>

<style scoped>
.title {
  flex-grow: 10;
  color: var(--text-reverse);
  text-overflow: show;
}
</style>

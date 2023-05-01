<template>
  <v-app-bar
    app
    fixed
    color="pink darken-4"
    dark
    dense
    rounded
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

    <v-btn icon @click="app.submittalSearch = true" v-show="app.submittalSearch == false">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn icon @click="app.submittalSearch = false" v-show="app.submittalSearch == true">
      <v-icon>mdi-magnify-close</v-icon>
    </v-btn>

    <v-btn icon @click="app.submittalView = 'table'" v-show="app.submittalView=='cards'">
      <v-icon>mdi-table</v-icon>
    </v-btn>
    
    <v-btn icon @click="app.submittalView = 'cards'" v-show="app.submittalView=='table'">
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
  // import { ref } from 'vue';
  // import router from '@/router';
  import { useAppStore } from '../stores/AppStore';

  const app = useAppStore();
  
  const title = "Submittal Workflow and Tracking";
  // const submittalview = ref('cards');
  // const toggleSubmittalView = (view) => {
  //       submittalview.value = view;
  //       router.push({ path: '/submittals/'+view });
  //   }
</script>

<style scoped>
.title {
  flex-grow: 10;
  color: var(--text-reverse);
  text-overflow: show;
}
</style>

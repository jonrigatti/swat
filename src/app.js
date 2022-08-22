// var app = new Vue({
//     el: '#app',
//     data: {
//       message: 'Hello Vue!'
//     }
//   })

const app = Vue.createApp({
  template: "<h1>Hello World</h1>",
});

app.mount("#app");

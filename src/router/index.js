import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Submittals from "../components/Submittals.vue";
import Projects from "../components/Projects.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/submittals/:submittalview?",
    name: "Submittals",
    component: Submittals,
    props: true
  },
  {
    path: "/projects",
    name: "Projects",
    component: Projects
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

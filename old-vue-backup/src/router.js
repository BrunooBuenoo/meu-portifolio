import { createRouter, createWebHistory } from "vue-router"
import Home from "./views/Home.vue"
import Admin from "./views/Admin.vue"
import Login from "./views/Login.vue"

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/projetos",
    name: "projetos",
    component: Home,
    beforeEnter: (to, from, next) => {
      next("/#projetos")
    },
  },
  {
    path: "/tecnologias",
    name: "tecnologias",
    component: Home,
    beforeEnter: (to, from, next) => {
      next("/#tecnologias")
    },
  },
  {
    path: "/sobre",
    name: "sobre",
    component: Home,
    beforeEnter: (to, from, next) => {
      next("/#sobre")
    },
  },
  {
    path: "/contato",
    name: "contato",
    component: Home,
    beforeEnter: (to, from, next) => {
      next("/#contato")
    },
  },
  {
    path: "/admin",
    name: "admin",
    component: Admin,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

export default router

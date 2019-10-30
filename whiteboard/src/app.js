import "reset-css"

import Vue from "vue"
import VueRouter from "vue-router"

import App from "./App.vue"

import Launch from "./components/Launch.vue"
import Sheet from "./components/Sheet.vue"

Vue.use(VueRouter)

const routes = [
    { path: "/", component: Launch },
    { path: "/:id", component: Sheet }
]

const router = new VueRouter({
    routes
})

new Vue({
    el: "#app",
    router: router,
    render: h => h(App)
})
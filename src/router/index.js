import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Article from '../views/Article.vue'
import Navigation from '../views/Navigation.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: Article
  },
  {
    path: '/navigation',
    name: 'Navigation',
    component: Navigation
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

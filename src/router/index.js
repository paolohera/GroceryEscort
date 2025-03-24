// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import ShoppingList from '../components/ShoppingList.vue'
import History from '../components/HistoryComponent.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: ShoppingList
  },
  {
    path: '/history',
    name: 'History',
    component: History
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: () => import('../components/ExpenseAnalytics.vue')
  },  
  {
    path: '/calculator',
    name: 'Calculator',
    component: () => import('../components/Calculator.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
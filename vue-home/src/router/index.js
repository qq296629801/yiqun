import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Product from '@/components/Product'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/product',
      name: 'Product',
      component: Product
    }
  ]
})

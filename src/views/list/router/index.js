import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: resolve => require(['../components/Header'], resolve),
             
        },
        {
            path: '/list',
            name: 'list',
            component: resolve => require(['../pages/list/list'], resolve),
        }
         
    ]
  })
  
import Vue from 'vue'
import Router from 'vue-router'
import Header from "../components/Header"
import List from "../pages/list/list"

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            // component:Header
            component: resolve => require(['../components/Header'], resolve),
             
        },
        {
            path: '/list',
            name: 'list',
            // component:List
            component: resolve => require(['../pages/list/list'], resolve),
        }
         
    ]
  })
  
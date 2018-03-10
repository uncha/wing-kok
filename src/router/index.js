import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import App from '@/components/App'
import Connection from '@/components/Connection'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: App
    },
    {
    	path:'/:accessToken',
    	name:'App',
    	component: App
    },
    {
    	path: '/connection',
    	name: 'Connection',
    	component: Connection,
    }
  ]
})

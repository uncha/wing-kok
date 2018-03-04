import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

Vue.use(Vuex)
Vue.use(VueResource)

Vue.http.options.emulateJSON = true

export default new Vuex.Store({
  state: {
    instagramData:{}
  },
  mutations: {
    updateInstagramData(state, data) {
      state.instagramData = data
    }
  },
  actions: {
  	instagramLoad (context, param) {
    	return new Promise(resolve => {
    		let url = `https://api.instagram.com/v1/tags/${param.keyword}/media/recent?access_token=${param.token}`

    		Vue.http.get(url).then(response => {
			    context.commit('updateInstagramData', response.data)
			    resolve()
			  }, response => {
			  	console.log(response)
			  })
    	})
    }
  },
})
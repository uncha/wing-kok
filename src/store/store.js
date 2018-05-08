import Vue from 'vue'
import Vuex from 'vuex'
import VueJsonp from 'vue-jsonp'

Vue.use(Vuex)
Vue.use(VueJsonp)

Vue.http.options.emulateJSON = true

export default new Vuex.Store({
  state: {
    instagramData:{},
    youtubeData:{},
    flickrData:{},
  },
  mutations: {
    updateData(state, param) {
      switch(param.sns){
        case 'instagram':
          state.instagramData = param.data
          break
        case 'youtube':
          state.youtubeData = param.data
          break
        case 'flickr':
          state.flickrData = param.data
          break
      }
    },
    modifyData(state, param) {
      switch(param.sns){
        case 'instagram':
          for(let i=0; i<param.data.data.length; i++){
            state.instagramData.data.push(param.data.data[i])
          }

          state.instagramData.meta = param.data.meta
          state.instagramData.pagination = param.data.pagination
          break
        case 'youtube':
          for(let i=0; i<param.data.items.length; i++){
            state.youtubeData.items.push(param.data.items[i])
          }

          state.youtubeData.nextPageToken = param.data.nextPageToken
          break
        case 'flickr':
          for(let i=0; i<param.data.photos.photo.length; i++){
            state.flickrData.photos.photo.push(param.data.photos.photo[i])
          }

          state.flickrData.photos.page = param.data.photos.page
          state.flickrData.photos.pages = param.data.photos.pages
          state.flickrData.photos.perpage = param.data.photos.perpage
          break
      }
    },
  },
  actions: {
  	instagramLoad (context, param) {
    	return new Promise(resolve => {
    		let url = `https://api.instagram.com/v1/tags/${param.keyword}/media/recent?access_token=2945410720.02e1557.585a0311f0024312a5f7428984943f8e`

    		Vue.http.get(url).then(response => {
			    context.commit('updateData', {sns:'instagram', data:response.data})
			    resolve()
			  }, response => {
			  	console.log(response)
			  })
    	})
    },
    youtubeLoad (context, param) {
      return new Promise(resolve => {
        let url = `https://content.googleapis.com/youtube/v3/search?maxResults=50&part=snippet&q=${param.keyword}&safeSearch=moderate&key=AIzaSyDJH2sAVrMq3v79apTNFO1tJjabR3tk1Mw`

        Vue.http.get(url).then(response => {
          context.commit('updateData', {sns:'youtube', data:response.data})
          resolve()
        }, response => {
          console.log(response)
        })
      })
    },
    flickrLoad (context, param) {
      return new Promise(resolve => {
        let url = `https://secure.flickr.com/services/rest/?method=flickr.photos.search&api_key=c95046e39cbbd7d6d71c452ca7a814d6&text=${param.keyword}&privacy_filter=1&safe_search=1&content_type=1&per_page=50&format=json&jsoncallback=flickrCallback&sort=date-posted-desc&extras=date_upload`

        Vue.jsonp(url, {
          callbackName: 'flickrCallback'
        }).then(data => {
          context.commit('updateData', {sns:'flickr', data:data})
          resolve()
        }).catch(response => {
          console.log(response)
        })
      })
    },
    addedList (context, param) {
      return new Promise(resolve => {
        // instagram added
        let instagramURL = this.state.instagramData.pagination.next_url
        Vue.http.get(instagramURL).then(response => {
          context.commit('modifyData', {sns:'instagram', data:response.data})
          resolve()
        }, response => {
          console.log(response)
        })

        // youtube added
        let youtubeURL = `https://content.googleapis.com/youtube/v3/search?maxResults=50&part=snippet&q=${param.keyword}&safeSearch=moderate&key=AIzaSyDJH2sAVrMq3v79apTNFO1tJjabR3tk1Mw&nextPageToken=${this.state.instagramData.nextPageToken}`
        Vue.http.get(youtubeURL).then(response => {
          context.commit('modifyData', {sns:'youtube', data:response.data})
          resolve()
        }, response => {
          console.log(response)
        })

        //flickr added
        console.log(this.state.flickrData.photos)
        let flickrURL = `https://secure.flickr.com/services/rest/?method=flickr.photos.search&api_key=c95046e39cbbd7d6d71c452ca7a814d6&text=${param.keyword}&privacy_filter=1&safe_search=1&content_type=1&per_page=50&format=json&jsoncallback=flickrCallback&sort=date-posted-desc&extras=date_upload&page=${this.state.flickrData.photos.page + 1}`
        Vue.jsonp(flickrURL, {
          callbackName: 'flickrCallback'
        }).then(data => {
          context.commit('modifyData', {sns:'flickr', data:data})
          resolve()
        }).catch(response => {
          console.log(response)
        })
      })
    },
  },
})
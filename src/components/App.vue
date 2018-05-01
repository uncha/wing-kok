<template>
	<div id="sns-list">
		<el-row>
			<el-col>
				<div class="search-wrap">
					<el-input v-model="searchValue" placeholder="Please input">
						<el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
				  </el-input>
				</div>
				<div class="sns-list">
					<el-checkbox-group v-model="checkedSNSList">
			    	<el-checkbox v-for="sns in snsList" :label="sns" :key="sns">{{sns | capitalize}}</el-checkbox>
					</el-checkbox-group>
				</div>
			</el-col>
		</el-row>
		<!-- instagram
		<masonry :cols="{default: 5, 1440: 4, 1000: 3, 800:2, 700: 1}">
		  <el-row :gutter="10" class="list-wrap" v-for="(item, index) in listData" :key="index">
		  	<el-col>
		  		<img style="width:100%" :src="item.images.standard_resolution.url" class="image">
		  	</el-col>
		  	<el-col v-if="item.caption">
		  		<el-row :gutter="10">
		  			<el-col class="profile" :span="6"><img :src="item.caption.from.profile_picture" /></el-col>
		  			<el-col :span="18">
		  				<el-row class="info">
		  					<el-col class="name">{{item.caption.from.full_name}}</el-col>
		  					<el-col class="created">{{item.created_time}}</el-col>
		  				</el-row>
		  			</el-col>
		  		</el-row>
		  	</el-col>
		  	<el-col class="text" v-if="item.caption">
	        <span>{{ item.caption.text }}</span>
		  	</el-col>
		  </el-row>
		</masonry>
		-->
		<masonry :cols="{default: 5, 1440: 4, 1000: 3, 800:2, 700: 1}">
			<el-row v-if="isCheckedSNS(item.type)" :gutter="10" class="list-wrap" v-for="(item, index) in listParse" :key="index">
		  	<div class="list-box-area">
		  		<el-col>
			  		<img style="width:100%" :src="item.image" class="image" />
			  	</el-col>
			  	<el-col>
			  		<el-row :gutter="10">
			  			<el-col class="profile" :span="6"></el-col>
			  			<el-col v-if="item.type!='instgram' || item.caption" :span="18">
			  				<el-row class="info">
			  					<el-col class="name">{{item.title}}</el-col>
			  					<el-col class="created">{{item.created}}</el-col>
			  				</el-row>
			  			</el-col>
			  		</el-row>
			  	</el-col>
		  	</div>
		  </el-row>
		</masonry>
	  <el-row class="more">
	  	<el-col>
	  		<el-button class="more-btn" type="primary" @click="handleMore">+ 더보기</el-button>
	  	</el-col>
	  </el-row>
	</div>
</template>

<script type="text/javascript">
	import Vue from 'vue'
	import $ from 'jquery'
	import VueMasonry from 'vue-masonry-css'

	Vue.use(VueMasonry)

	export default {
		components: {

		},
		data () {
			/* data를 아래와 같은 형태로 맞춰야함
			{
				image:'',
				title:'',
				created:'',
				caption:'',
			}
			*/
			return {
				searchValue: '',
				listData: [],
				snsList: ['instagram', 'youtube', 'flickr'],
				checkedSNSList: ['instagram', 'youtube', 'flickr'],
			}
		},
		watch: {
	    '$route' (to, from) {
	      this.dataLoad(this.searchValue)
	    }
	  },
		computed: {
			listParse () {
				this.listData = []

				// instagram
				if(this.$store.state.instagramData.data){
					for(let value of this.$store.state.instagramData.data) {
						this.listData.push({
							type:'instagram',
							image:value.images.standard_resolution.url,
							created:new Date(value.created_time * 1000).yyyymmdd(),
							caption:value.caption && value.caption.text,
							title:value.caption && value.caption.from.username,
						})
					}
				}
				// youtube
				if(this.$store.state.youtubeData.items){
					for(let value of this.$store.state.youtubeData.items) {
						this.listData.push({
							type:'youtube',
							image:value.snippet.thumbnails.high.url,
              created:new Date(value.snippet.publishedAt).yyyymmdd(),
              caption:value.snippet.description,
              title:value.snippet.title,
						})
					}
				}
				// flicker
				if(this.$store.state.flickerData.photos){
					for(let value of this.$store.state.flickerData.photos.photo) {
						this.listData.push({
							type:'flickr',
							image:`http://farm${value.farm}.static.flickr.com/${value.server}/${value.id}_${value.secret}.jpg`,
              title:value.title,
              created:new Date(value.dateupload * 1000).yyyymmdd(),
						})
					}
				}

				this.listData.sort(function (a, b) {
					return a.created > b.created ? -1 : a.created < b.created ? 1 : 0
				})

				return this.listData
			},
		},
		created () {
			this.dataLoad(this.$route.query.keyword)
		},
		methods: {
			dataLoad (keyword) {
				this.searchValue = keyword

				this.$store.dispatch('instagramLoad', {keyword:keyword})
				this.$store.dispatch('youtubeLoad', {keyword:keyword})
				this.$store.dispatch('flickerLoad', {keyword:keyword})
			},
			handleSearch () {
				this.$router.push({ path: '/', query: { keyword: this.searchValue }})
			},
			handleMore () {
				this.$store.dispatch('addedList', {keyword:this.searchValue})
			},
			isCheckedSNS (sns) {
				for(let value of this.checkedSNSList) {
					if(sns == value){
						return true
					}
				}

				return false
			},
		}
	}
</script>

<style scoped>
	*{line-height: 150%}
	#sns-list {width: 100%; overflow-x: hidden;}

	.search-wrap {max-width: 600px; width:100%; margin:50px auto 10px;}
	.sns-list {text-align: center; margin-bottom: 50px}

	.list-wrap {word-break: break-all; padding:15px; border-radius: 10px;}
	.list-wrap .list-box-area{background: #EFEFEF; position: relative;}
	.list-wrap .image {margin-bottom: 10px; border-radius: 10px;}
	.list-wrap .profile {text-align: center; margin-bottom: 10px}
	.list-wrap .profile > img{width: 54px; height:54px; vertical-align: middle;}
	.list-wrap .info {line-height: 25px; font-size:12px;}
	.list-wrap .info .created{color:#CCC;}
	.list-wrap .text{font-size: 14px}

	.more {text-align: center; margin:80px 0;}
	.more .more-btn{width:250px;}
</style>
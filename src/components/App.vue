<template>
	<div id="sns-list">
		<el-row>
			<el-col>
				<div class="search-wrap">
					<el-input v-on:keyup.13="handleSearch" v-model="searchValue" placeholder="Please input">
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
		  	<div class="list-box-area" @click="handleShowDialog(index)">
		  		<el-col>
			  		<img style="width:100%" :src="item.image" class="image" />
			  	</el-col>
			  	<el-col>
			  		<el-row :gutter="10">
		  				<span class="ico-sns">
		  					<img style="" :src="imgSrc(item.type)" class="image" />
		  				</span>
		  				<el-row class="info" style="">
		  					<el-col class="name">{{item.title}}</el-col>
		  					<el-col class="created">{{item.created}}</el-col>
		  				</el-row>
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
		<el-dialog
		  :title="(selectedId != undefined) ? listData[selectedId].title : ''"
		  :visible.sync="dialogVisible"
		  width="30%">
		  <template v-if="listData[selectedId]">
			  <div v-if="listData[selectedId].type == 'youtube'" class="video-container">
			  	<iframe :src="youtubeSrc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
			  </div>
			  <div v-else-if="listData[selectedId].type == 'tumblr' && listData[selectedId].contentType == 'video'">
			  	<div class="video-container" v-html="listData[selectedId].embed"></div>
			  </div>
			  <div v-else>
			  	<img style="width:100%;" :src="listData[selectedId].image" />
			  </div>
		  </template>
		  <p class="caption" v-html="listData[selectedId] && listData[selectedId].caption"></p>
		</el-dialog>
	</div>
</template>

<script type="text/javascript">
	import Vue from 'vue'
	import $ from 'jquery'
	import VueMasonry from 'vue-masonry-css'
	import {fn_twitterTimelineCount} from '../twitter.js'

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
				type:'', <-- tumblr data type
			}
			*/
			return {
				searchValue: '',
				listData: [],
				snsList: ['instagram', 'youtube', 'flickr', 'tumblr', 'twitter'],
				checkedSNSList: ['instagram', 'youtube', 'flickr', 'tumblr', 'twitter'],
				dialogVisible: false,
				selectedId:undefined,
			}
		},
		watch: {
	    '$route' (to, from) {
	      this.dataLoad(this.searchValue)
	    }
	  },
		computed: {
			youtubeSrc () {
				return `https://www.youtube.com/embed/${this.listData[this.selectedId].videoId}`
			},
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
			            	videoId:value.id.videoId,
						})
					}
				}
				// flickr
				if(this.$store.state.flickrData.photos){
					for(let value of this.$store.state.flickrData.photos.photo) {
						this.listData.push({
							type:'flickr',
							image:`http://farm${value.farm}.static.flickr.com/${value.server}/${value.id}_${value.secret}.jpg`,
				            title:value.title,
				            created:new Date(value.dateupload * 1000).yyyymmdd(),
						})
					}
				}
				// tumblr
				if(this.$store.state.tumblrData.response){
					for(let value of this.$store.state.tumblrData.response) {
						let url, embed

						switch(value.type){
							case 'photo':
								url = value.photos[0].original_size.url
								break
							case 'video':
								url = value.thumbnail_url
								embed = value.player[2].embed_code
								break
						}

						this.listData.push({
							type:'tumblr',
							image:url,
				            title:value.blog_name,
				            created:new Date(value.date).yyyymmdd(),
				            caption:value.summary,
				            embed:embed,
				            contentType:value.type,
						})
					}
				}

				// twitter
				if(this.$store.state.twitterData.statuses){
					console.log(this.$store.state.twitterData.statuses)

					for(let value of this.$store.state.twitterData.statuses) {
						this.listData.push({
							type:'twitter',
							image:(value.extended_entities) ? value.extended_entities.media[0].media_url : '',
				            title:value.text,
				            created:new Date(value.created_at).yyyymmdd(),
				            //caption:'caption',
				            //embed:embed,
				            //contentType:value.type,
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
				if(!keyword){
					this.$message('검색어를 입력해 주세요.')
					return
				}

				this.searchValue = keyword
				
				this.$store.dispatch('instagramLoad', {keyword:this.searchValue})
				this.$store.dispatch('youtubeLoad', {keyword:this.searchValue})
				this.$store.dispatch('flickrLoad', {keyword:this.searchValue})
				this.$store.dispatch('tumblrLoad', {keyword:this.searchValue})

				fn_twitterTimelineCount(keyword, '', (data) => {
					this.$store.dispatch('twitterLoad', data)
				})
			},
			handleSearch () {
				if(!this.searchValue){
					this.$message('검색어를 입력해 주세요.')
					return
				}

				this.searchValue = this.searchValue.replace(' ', '');
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
			imgSrc (sns) {
				let src = ''
				switch(sns) {
					case 'instagram':
						src = require('../assets/ico-instagram.png')
						break
					case 'youtube':
						src = require('../assets/ico-youtube.png')
						break
					case 'flickr':
						src = require('../assets/ico-flickr.png')
						break
					case 'tumblr':
						src = require('../assets/ico-tumblr.png')
						break
					case 'twitter':
						src = require('../assets/ico-twitter.png')
						break;
				}

				return src
			},
			handleShowDialog (index) {
				this.selectedId = index
				this.dialogVisible = true
			},
		}
	}
</script>

<style>
	*{line-height: 150%}
	#sns-list {width: 100%; overflow-x: hidden;}

	.search-wrap {max-width: 600px; width:100%; margin:50px auto 10px;}
	.sns-list {text-align: center; margin-bottom: 50px}

	.list-wrap {word-break: break-all; padding:15px; border-radius: 10px;}
	.list-wrap:hover{background: #EEE; cursor: pointer;}
	.list-wrap .list-box-area{background: #EFEFEF; position: relative;}
	.list-wrap .image {margin-bottom: 10px; border-radius: 10px;}
	.list-wrap .profile {text-align: center; margin-bottom: 10px}
	.list-wrap .profile > img{width: 54px; height:54px; vertical-align: middle;}
	.list-wrap .info {line-height: 25px; font-size:12px; float:left;  margin-left:10px; width:calc(100% - 60px);}
	.list-wrap .info .name{overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-top: 2px; position:relative;}
	.list-wrap .info .created{color:#AAA;}
	.list-wrap .ico-sns > img{width:40px; height:40px; float:left; margin-left:10px}
	.list-wrap .text{font-size: 14px}

	.more {text-align: center; margin:80px 0;}
	.more .more-btn{width:250px;}

	.el-dialog {width:100% !important; max-width:600px;}
	.el-dialog .el-dialog__body {padding:10px 20px 20px 20px;}
	.el-dialog .el-dialog__header .el-dialog__headerbtn {top:0; right:-28px; padding:3px 6px; background: #000}
	.el-dialog .caption {margin-top:10px;}

	.video-container {
		position: relative;
		padding-bottom: 56.25%;
		padding-top: 30px; height: 0; overflow: hidden;
	}

	.video-container iframe,
	.video-container object,
	.video-container embed {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
<template>
	<!-- <div>
		<el-row>
		 <el-col :span="8" v-for="(o, index) in $store.state.instagramData.data" :key="o.id" :offset="index > 0 ? 2 : 0">
		    <el-card :body-style="{ padding: '0px' }">
		      <img :src="o.images.standard_resolution.url" class="image">
		      <div style="padding: 14px;">
		        <span>{{ o.caption.text }}</span>
		        <div class="bottom clearfix">
		          <time class="time">{{ o.created_time }}</time>
		          <el-button type="text" class="button">Operating button</el-button>
		        </div>
		      </div>
		    </el-card>
		  </el-col>
		</el-row>
	</div> -->
	<waterfall
		align="center"
    :line-gap="200"
    :min-line-gap="100"
    :max-line-gap="220"
    :single-max-width="300"
		auto-resize="true"
	>
	  <!-- each component is wrapped by a waterfall slot -->
	  <waterfall-slot
	  	v-for="(item, index) in $store.state.instagramData.data"
	    :width="item.images.standard_resolution.width"
	    :height="item.images.standard_resolution.height + (contentsHeightArr[index] || 0)"
	    :order="index"
      ref="waterfall"
	    move-class="item-move"
	  >
	    <div class="slot-wrap">
        <div class="cont-wrap">
        	<img style="width:100%; height:100%" :src="item.images.standard_resolution.url" class="image" />
	        <div ref="infoBox" class="cont">
	        	<span class="text">{{ item.caption.text }}</span>
		        <div class="bottom clearfix">
		          <time class="time">{{ item.created_time }}</time>
		          <el-button type="primary" class="button">Operating button</el-button>
		        </div>
	        </div>
        </div>
      </div>
	  </waterfall-slot>
	</waterfall>
</template>

<script type="text/javascript">
	import $ from 'jquery'
	import Waterfall from 'vue-waterfall/lib/waterfall'
	import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'

	export default {
		components: {
			Waterfall,
			WaterfallSlot,
		},
		data () {
			return {
				keyword: '김수현',
				contentsHeightArr: [],
			}
		},
		computed: {

		},
		created () {
			const token = this.$route.query.accessToken

			this.$store.dispatch('instagramLoad', {token:token, keyword:this.keyword}).then(()=>{
				for(let i in this.$refs.infoBox){
					setTimeout(()=>{
						let origin = this.$store.state.instagramData.data[i].images.standard_resolution.width
						let change = $(this.$refs.infoBox[i]).outerWidth(true)
						let per = origin / change

						this.contentsHeightArr.push($(this.$refs.infoBox[i]).outerHeight(true) * per)
					}, 1000)
				}
			})
		},
	}
</script>

<style scoped>
	.item-move {
    transition: all .5s cubic-bezier(.55,0,.1,1);
    -webkit-transition: all .5s cubic-bezier(.55,0,.1,1);
  }

  .slot-wrap{
  	padding:7px;
  }

  .cont-wrap{
  	padding:15px;
  }

  .cont {
  	word-wrap: break-word;
  }

  .text {
  	margin:10px 0;
  	display: block;
  }

  .time{
  	display: block;
  	margin:5px 0;
  }

  .cont-wrap{
  	background: #EFEFEF;
  	border-radius: 5px;
  }
</style>
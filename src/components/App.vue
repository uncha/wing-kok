<template>
	<div>
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
	</div>
</template>

<script type="text/javascript">
	import $ from 'jquery'

	export default {
		data () {
			return {
				keyword: '김수현',
			}
		},
		created () {
			const token = this.$route.query.accessToken
			console.log('token = ' + token)

			this.$store.dispatch('instagramLoad', {token:token, keyword:this.keyword}).then(()=>{
				console.log(this.$store.state.instagramData)
			});
		}
	}
</script>

<style scoped>
	 .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
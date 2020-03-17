<template>
  <swiper>
    <swiper-item v-for="item in banners">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper'

  export default {
    name: "HomeSwiper",
    props: {
      banners: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        isLoad: false
      }
    },
    components: {
      Swiper,
      SwiperItem
    },
    methods: {
		  // stopTimer() {
		  //   this.$refs.swiper.stopTimer()
      // },
      // startTimer() {
		  //   if (this.$refs.swiper) {
      //     this.$refs.swiper.startTimer()
      //   }
      // }

      // 只需要加载一个图片我们就可以知道元素高度了，所以不要重复发送事件，防抖
      imageLoad() {
        if(!this.isLoad) {
          this.$emit('swiperImageLoad')
          this.isLoad = true
        }
      }
    }
  }
</script>

<style scoped>

</style>

<template>
<!-- 通过ref绑定在组件上 -->
<!-- 通过$refs，这样可以明确拿到一个组件 -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 定义一个空对象
        scroll: null
      }
    },
    mounted() {
      // 1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        // probeType为3的话，滚动，就监听
        probeType: this.probeType,
        // 上拉加载更多
        pullUpLoad: this.pullUpLoad
      })

      // 2.监听滚动的位置
      if (this.probeType == 2 || this.probeType == 3) {
      this.scroll.on('scroll', (position) => {
        // console.log(position);
        // 自定义事件$emit,事件名：scroll,参数：position,可以发出该事件
        this.$emit('scroll', position)
      })
      }

      // 3.监听上拉事件
      // this.scroll.on('pullingUp', () => {
      //   this.$emit('pullingUp')
      // })
      if(this.pullUpLoad) {
        this.scroll.on('pullingup', ()=> {
          this.$emit('pullingup')
        })
      }
    },
    methods: {
      // 在300毫秒回到你设置的x,y的坐标
      scrollTo(x, y, time=300) {

        // 做这个操作是为了做组件之间数据的同步。
        // 因为组件都是有生命周期的，可能你需要调用的这个方法在它自己组件中还没有被挂载。
        // 所以我们在执行此方法时候先判断对象是否有值，若无值，则不作处理
        this.scroll && this.scroll.scrollTo(x, y, time)
      },

      // 加载更多后，要调用此方法，让它为下一次加载更多做准备
      finishPullUp() {
        this.scroll.finishPullUp()
      },

      // 刷新操作，刷新过后，会重新计算可滑动区域
      refresh() {
        // console.log('------');
        this.scroll && this.scroll.refresh()
      },

      // 获取滑动区域的y值
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>

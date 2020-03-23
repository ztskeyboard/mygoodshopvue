<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                  @tabClick="tabClick"
                  class="tab-control"
                  ref="tabControl1" 
                  v-show="isTabFixed"/>
    <!-- 通过@scoll监听到自定义的scroll事件 -->
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick" ref="tabControl2"/>
                   <!-- :class="{fixed: isTabFixed}" -->
                   <!-- 动态绑定样式，对象语法，如果为true，我们就用这个样式 -->
      <goods-list :goods="showGoods"/>
    </scroll>
    <!-- 组件不可直接被监听，click方法不可直接用，必须加.native这个属性，然后才可监听组件 -->
    <!-- v-show标签，是否显示该组件,backTop这个方法封装在mixin混入文件中 -->
    <back-top @click.native="backTop" v-show="showBackTop"/>
  </div>
</template>

<script>

import NavBar from 'components/common/navbar/NavBar';
import TabControl from 'components/content/tabControl/TabControl';
import GoodsList from 'components/content/goods/GoodsList';
import Scroll from 'components/common/scroll/Scroll';
import BackTop from 'components/content/backTop/BackTop';

import HomeSwiper from './childComps/HomeSwiper';
import RecommendView from './childComps/RecommendView';
import FeatureView from './childComps/FeatureView';

import {getHomeMultidata,getHomeGoods} from 'network/home';

import {debounce} from 'common/utils';
import {itemListenerMixin,backTopMixin} from 'common/mixin';
import {NEW, POP, SELL, BACKTOP_DISTANCE} from "common/const";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },

    mixins: [itemListenerMixin,backTopMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        isTabFixed: false,
        tabOffsetTop: 0,
        saveY: 0,

        // 定义此变量目的是让它保存刷新函数，做到我们可以管理刷新函数和被调用，何时停止调用
        // scollshuaxin: null
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      this.getHomeMultidata();

      this.getHomeGoods(POP);
      this.getHomeGoods(NEW);
      this.getHomeGoods(SELL);

      // 在create周期内拿$refs里面组件对象，
      // 或是在document.querySelector()拿，都有可能为空
      //  因为组件极有可能还没有被挂载
    },
    // mounted() {

    //   const refresh = debounce(this.$refs.scroll.refresh,200)
    //   // 监听item中图片加载完成，因为这个组件和home组件不是直接包含关系（非父子组件关系），
    //   // 一层一层传递太过麻烦，所以用一个事件总线把他们联系起来
    //   // 下面方法里面是一个闭包，所以说refresh不会被销毁
    //   this.scollshuaxin = ()=>{
    //     refresh()
    //   }
    //   this.$bus.$on('itemImageLoad', this.scollshuaxin)

    //   //获取TabControl的offsetTop。但是一个组件它是没有offsetTop
    //   //所以我们要获取组件中的元素，找到元素的offsetTop
    //   //所以组件有一个属性$el，用于获取 组件中元素
    // },
    destroyed() {
      // console.log('it is over')
    },
    // 再次进入组件时调用此方法
    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    // 离开组件时调用此方法
    deactivated(){

      //离开组件时，保存滚动坐标Y轴。
      this.saveY = this.$refs.scroll.getScrollY()

      //离开组件时，销毁组件监听的刷新函数。
      //这样一来，我们就可以共用goodslistitem这个组件了。
      this.$bus.$off('itemImageLoad',this.scollshuaxin)


    },
    methods: {
      /**
       * 事件监听相关的方法
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      // backClick() {
      //   // 通过$ref得到scoll对象，可以直接拿到对象里面属性方法
      //   this.$refs.scroll.scrollTo(0, 0)
      // },
      contentScroll(position) {
        // 如何纵坐标大于1000，我们就把小坐标给显示出来，点击它，可以返回顶部
        this.showBackTop = position.y < BACKTOP_DISTANCE

        // isTabFixed是一个boolean值，如果高度比tabOffsetTop高，我们就让标题吸顶
        // isTabFixed设置为true
        this.isTabFixed = position.y < -this.tabOffsetTop
      },
      loadMore() {
        // 给相应的类型，加载更多
         this.getHomeGoods(this.currentType)
      },
      swiperImageLoad () {

        //offsetTop是元素高度，可以通过$el.offsetTop获取
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
      /**
       * 网络请求相关的方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // this.result = res;
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
          // 下次更新DOM时,获取新的tabOffsetTop值(不保险,可以在updated钩子中获取)
          // this.$nextTick(() => {
          //   this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
          // })
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          // 加载更多，后调用此方法
           this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    /* --color-tint是我们在base.css中定义的css语法，定义为红色 */
    background-color: var(--color-tint);
    color: #fff;

    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
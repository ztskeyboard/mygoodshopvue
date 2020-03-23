<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="cart-nav">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <div v-if="this.cartLength == 0">
      <van-button class="vbut" round type="primary" to="/home">快去购物吧</van-button>
    </div>
    <!-- 商品列表 -->
    <div v-if="this.cartLength > 0">
    <cart-list class="cart-list" :cart-list="CartList"></cart-list>
    </div>
    <!-- 底部汇总 -->
    <bottom-bar></bottom-bar>
  </div>
</template>

<script>
import CartList from './childComps/CartList';
import BottomBar from './childComps/BottomBar'

import NavBar from "components/common/navbar/NavBar";

import { mapGetters } from "vuex";

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    BottomBar
  },
  data() {
    return {};
  },

  // 计算属性方法，顾明思议，它可以对你定义或拿到的一些属性加以计算，
  // 里面都是一些方法
  computed: {
    cartLength() {
      // return this.$store.getters.cartCount;
    },

    // 基于上面方法太过繁琐，vuex为我们提供了辅助函数mapGetters
    ...mapGetters({
      cartLength: "cartCount",
      CartList: "cartList"
    })
  }
};
</script>

<style scoped>

#cart {
  position: relative;
  z-index: 10;
  height: 100vh;
}
.cart-nav {
  background-color: var(--color-tint);
  color: #fff;
}
/* relative：定位是相对于自身位置定位（设置偏移量的时候，会相对于自身所在的位置偏移）。设置了relative的元素仍然处在文档流中，元素的宽高不变，
设置偏移量也不会影响其他元素的位置。最外层容器设置为relative定位，在没有设置宽度的情况下，宽度是整个浏览器的宽度。
https://www.runoob.com/w3cnote/css-position-static-relative-absolute-fixed.html

absolute：定位是相对于离元素最近的设置了绝对或相对定位的父元素决定的，如果没有父元素设置绝对或相对定位，则元素相对于根元素即html元素定位。
设置了absolute的元素脱了了文档流，元素在没有设置宽度的情况下，宽度由元素里面的内容决定。脱离后原来的位置相当于是空的，下面的元素会来占据位置。 */

/* 由于cartList本身就是个滚动组件，里面所以样式已经调好，这里就直接绝对定位 */
.cart-list {
  position: absolute;
  top: 44px;
  bottom: 49px;
  width: 100%;
}
.vbut {
  position: absolute;
  top: 40%;
  right: 35%;
}
</style>

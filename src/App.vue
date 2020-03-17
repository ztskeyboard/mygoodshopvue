<template>
  <div id="app">
    <!-- 懒加载，对于vue的声明周期，你如果点击进入下一个页面，
    该组件vue是会调用销毁方法的，我们不希望组件随便销毁，就用懒加载 -->
    <keep-alive exclude="Detail">
      <router-view/>
    </keep-alive>
    <main-tab-bar/>
  </div>
</template>
<script>
  import MainTabBar from 'components/content/mainTabbar/MainTabBar'

  export default {
    name: 'app',
    components: {
      MainTabBar
    }
  }
</script>

<style>
@import "assets/css/base.css";
</style>

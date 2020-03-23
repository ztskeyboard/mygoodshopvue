<template>
  <div>
    <nav-bar class="category-nav">
      <div slot="center">商品分类</div>
    </nav-bar>
    <category-content :categoryList="categoryList"></category-content>
  </div>
</template>
<script>
//网络请求js模块
import { getCategory } from "network/category.js";

// import Scroll from 'components/common/scroll/Scroll';

//组件
import NavBar from "components/common/navbar/NavBar"; //顶部标题栏
import categoryContent from "./childComps/categoryContent.vue"; //分类页主要区域

export default {
  name: "Category",
  data() {
    return {
      categoryList: []
    };
  },
  created() {
    getCategory().then(res => {
      const { list } = res.data.category;
      // console.log(data)
      // console.log(list)
      this.categoryList = list;
    });
  },
  components: {
    NavBar,
    categoryContent
  }
};
</script>
<style scoped>

.category-nav {
  /* --color-tint是我们在base.css中定义的css语法，定义为红色 */
  background-color: var(--color-tint);
  color: #fff;
}
</style>
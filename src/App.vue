<template>
  <div>
    <Header></Header>
    <!-- 路由组件出口地方 -->
    <router-view></router-view>
    <!-- <Footer v-show="$route.path=='/home'||$route.path=='/search'"></Footer>  -->
    <Footer v-show="$route.meta.showFooter"></Footer>
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  mounted() {
    // 组件加载完毕：可以向服务器发请求
    this.$store.dispatch("categoryList");
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

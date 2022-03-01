import Vue from 'vue'
import App from './App.vue'

// 三级联动组件---全局组件
import TypeNav from '@/components/TypeNav'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'

//element-ui
import { MessageBox } from 'element-ui'
Vue.use(MessageBox)
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;

// 第一个参数：全局组件的名字 第二个参数：哪一个组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)
//引入router配置文件
import router from '@/router'
import store from '@/store'
// 测试
// import { reqCategoryList } from '@/api'
// reqCategoryList()

// 引入MockServe.js
import '@/mock/mockServe'
// 引入swiper样式
import 'swiper/css/swiper.css' 
// 引入注册懒加载
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload,{

})

Vue.config.productionTip = false

//引入表单验证插件
import '@/plugins/validate'

// 统一接口api文件夹里面全部的请求函数
// 统一引入
import * as API from '@/api'
// console.log(API);
new Vue({
  render: h => h(App),
  // $bus
  beforeCreate(){
    Vue.prototype.$bus = this
    Vue.prototype.$API = API
  },
  //注册路由
  router,
  // 注册仓库 $store
  store
}).$mount('#app')

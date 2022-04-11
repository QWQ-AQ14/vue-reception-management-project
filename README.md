## 1、组件的显示与隐藏用v-if和v-show哪个更好？理由？
v-if：频繁操作DOM、耗性能
v-show:通过样式将元素显示或隐藏，性能更好
- 那么条件判断是什么呢？
根据组件身上的 $route.path 判断

```bash
<Footer v-show="$route.path=='/home'||$route.path=='/search'"></Footer> 
```
**问题：** 当组件数量增多时，判断过于冗余
**解决：** 利用路由元信息meta

```bash
{
    path: '/register',
    component: Register,
    meta: { showFooter: false }
},
```
判断：

```bash
<Footer v-show="$route.meta.showFooter"></Footer>
```
## 2、路由传参
### 2.1路由跳转有几种方式？
两种。
1、声明式导航：router-link（务必要有to属性）
2、编程式导航：主要利用的是组件实例的$router.push | replace方法，可以书写一些自己的业务
### 2.2路由传参，参数有几种写法？
两种。
1、params参数：属于路径中的一部分，在配置路由的时候需要==占位==
2、query参数：；不属于路径的一部分，类似于Ajax中的querystring ，==不需要占位==  /home?k=v&kv=

**情况说明：** 当点击搜索按钮之后 将home页面跳转到search页面，输入内容后，需要将内容传递给search页面
**params:** 
占位：(注意冒号：)

```javascript
path: '/search/:keyWord',
```
传参：

```javascript
this.$router.push("/search/" + this.keyWord)
```
**query传参:** 

```javascript
this.$router.push("/search/"  + this.keyWord + "?k=" + this.keyWord.toUpperCase())
```
结果：
![在这里插入图片描述](https://img-blog.csdnimg.cn/550629c57bbe4b40b408efe1bb0dd48e.png)
**模板字符串写法：**

```javascript
this.$router.push(`/search/${this.keyWord}?k=${this.keyWord.toUpperCase()}`)
```
==常用：== 对象写法：

```javascript
this.$router.push({name:"search",params:{keyWord:this.keyWord},query:{k:this.keyWord.toUpperCase()}})
```
### 2.3路由传参相关问题
#### 2.3.1路由传递参数（对象写法）path是否可以结合params参数一起使用？
不可以。
#### 2.3.2如何指定params参数可传可不传？
已占位，但是不传递，路径会存在问题
配置可传可不传：加？

```javascript
path: '/search/:keyWord?'
```
#### 2.3.3params参数可传可不传，若传递为空串，如何解决？
路径会存在问题。
解决：使用==undefined==解决

```javascript
params:{keyWord:'' || undefined}

```
#### 2.3.4路由组件能否传递props数据？
可以。三种写法。
布尔值写法：只能传递params参数。
对象写法：额外的给路由组件传递一些props
函数写法（==常用==）：params、query参数都可传递
### 2.4编程式路由跳转到当前路由（参数不变），多次执行会弹出NavigationDuplicated的警告错误
多次点击搜索按钮会出现（声明式不会出现该问题，vue底层已解决）：
![在这里插入图片描述](https://img-blog.csdnimg.cn/e41a7bedbdac43dabdb0de53502cef38.png)
原因：最新的"vue-router": "^3.5.3"引入了promise，编程式导航具有其返回值，失败成功的回调
解决：给push方法添加两个回调参数

```javascript
this.$router.push({name:"search",params:{keyWord:this.keyWord},query:{k:this.keyWord.toUpperCase()}},()=>{},()=>{})
```
缺陷：只解决单个编程式导航
重写push方法 
![在这里插入图片描述](https://img-blog.csdnimg.cn/8d4295e2eb7b4cb0bec5f1184ce683c2.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQVExNF8=,size_20,color_FFFFFF,t_70,g_se,x_16)
## 3、模块开发
1：先静态页面+静态组件拆分出来
注意拆分组件顺序：HTML+CSS+图片资源+引入+注册+使用
2：发请求(API)
3：vuex (三连环) 
4：组件获取仓库数据，动态展示数据
## 4、axios二次封装
### 4.1为什么axios需要二次封装？
为了用到其拦截器。
请求拦截器：在发请求之前可以处理业务
响应拦截器：服务器数据返回以后，处理数据
项目中的==API==文件夹有关axios
配置：
![axios二次封装](https://img-blog.csdnimg.cn/d1ba6df8fbcc4b5d8ba66ff0519352a5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQVExNF8=,size_20,color_FFFFFF,t_70,g_se,x_16)

```javascript
// axios二次封装
import axios from 'axios'

const requests = axios.create({
    baseURL:"/api",
    timeout:5000
})

// 请求拦截器
requests.interceptors.request.use((config)=>{
    return config
})

// 响应拦截器
requests.interceptors.response.use((res)=>{
    return res.data
},(error)=>{
    return Promise.reject(new Error('faile'))
})

//对外暴露
export default requests
```
## 5.接口统一管理
项目小：可以在组件的生命周期函数中发请求
项目大：axios.get
文件：index.js 
### 5.1跨域问题
**跨域：** 协议、域名、端口号不同请求
http://localhost:8080/#/home 前端本地服务器
http://39.98.123.211 后台服务器地址
**解决跨域问题：** JSONP、CORS、代理

```javascript
module.exports = {
    lintOnSave:false,
    //代理跨域
    devServer:{
        proxy:{
            '/api':{
                target: 'http://39.98.123.211',
                // pathRewrite:{'^/api':''}
            }
        }
    }
}
```
main测试

```javascript
// 测试
import { reqCategoryList } from '@/api'
reqCategoryList()
```
![proxy](https://img-blog.csdnimg.cn/a2bdafcfb4e446e38e3c0ece6f4b621a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQVExNF8=,size_20,color_FFFFFF,t_70,g_se,x_16)![在这里插入图片描述](https://img-blog.csdnimg.cn/9a8209d2fb7247ae909655dd6fdab8c0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQVExNF8=,size_20,color_FFFFFF,t_70,g_se,x_16)code:200 表示成功

### 5.2请求加载进度条nprogress
start：进度条开始
done：进度条结束
颜色可修改
```javascript
// 引入进度条
import nprogress from 'nprogress'
// 引入进度条样式
import "nprogress/nprogress.css" 
```

```javascript
// 请求拦截器
requests.interceptors.request.use((config)=>{
    nprogress.start()
    return config
})

// 响应拦截器
requests.interceptors.response.use((res)=>{
    nprogress.done()
    return res.data
},(error)=>{
    return Promise.reject(new Error('faile'))
})

```
## 4卡顿现象

 - 正常情况 (用户慢慢的操作) :鼠标进入， 每一个一级分类h3，都会触发鼠标进入事件
 -  非正常情况 (用户操作很快)本身全部的级分类都应该触发鼠标进入事件，但是经过测试，只有部分h3触发了
 - 由于用户行为过快，导致浏览器反应不过来
 - 如果当前回调函数中有一些大量业务，有可能出现卡顿现象
 
### 4.1函数的防抖和节流 **
 - **防抖：** 前面的所有的触发都被取消，最后一次执行在规定的时间之后才会触发，也就是说如果连续快速的触发只会执行一次
 	例子:输入框搜索 输入完内容之后 一秒后才发送一次请求
 	**解决：** ladash插件，封装函数的防抖与节流业务（闭包+延迟器）
 			对外暴露_函数 
 - **节流：** 在规定的间隔时间范围内不会审复触发回调，只有大于这个时间间隔才会触发回调，==把频繁触发变为少量触发==
 	例子：计数器限定一秒内不管用户点击按钮多少次，数值只能加一
 	**解决：** _throttle()
 	引入：
 	

```javascript
import throttle from 'lodash/throttle'
```
默认暴露 不需要花括号
回调函数不要用箭头函数，可能出现上下文this
 - **区别：**
防抖：用户操作很频繁，但是只是执行一次
节流：用户操作很频繁，但是把频繁的操作变为少量操作[可以给浏览器有充裕的时间解析代码]

### 4.2三级联动的路由跳转与传参
如果使用声明式导航router-link，可以实现路由的跳转与传递参数
但是会出现==卡顿现象==。
**原因：** router-link为一个组件，当服务器的数据返回之后，循环出很多的router-link组件（需要创建组件实例）1000+ 数量较多
创建组件实例的时候，一瞬间创建上千个十分耗内存，因此出现卡顿现象。
编程式导航也不是最优化的实现方式
采用==编程式导航+事件委派==，避开循环语句，放置事件。
![在这里插入图片描述](https://img-blog.csdnimg.cn/e44ba2744ea440148b3c52a0f14c8968.png)
存在问题：
（1）点击的标签不能精确指定为a标签
（2）如何确定是几级a标签
解决：

 - 把子节点当中a标签，加上自定义属性data-categoryName, 其余的子节点不存在
 - 利用事件触发event，获取到当前触发这个事件的节点【h3,a,dt,dl】，但只需要带有data-categoryName的节点，即为a标签
 - 节点有个属性dataset属性， 可以获取节点的自定义属性与属性值

代码：
```javascript
<a :data-categoryName="c3.categoryName" ：data-category3Id="c3.categoryId">{{ c3.categoryName }}</a>
```

```javascript
//进行路由跳转的回调函数
    goSearch(event) {
      //event.target:获取到的是出发事件的元素(div、h3、a、em、dt、dl)
      let node = event.target;
      //给a标签添加自定义属性data-categoryName,全部的字标签当中只有a标签带有自定义属性，别的标签名字----dataset纯属扯淡
      let {
        categoryname,
        category1id,
        category2id,
        category3id,
      } = node.dataset;
      //第二个问题解决了：点击的到底是不是a标签（只要这个标签身上带有categoryname）一定是a标签
      //当前这个if语句：一定是a标签才会进入
      if (categoryname) {
        //准备路由跳转的参数对象
        let loction = { name: "search" };
        let query = { categoryName: categoryname };
        //一定是a标签：一级目录
        if (category1id) {
          query.category1Id = category1id;
          //一定是a标签：二级目录
        } else if (category2id) {
          query.category2Id = category2id;
          //一定是a标签：三级目录
        } else {
          query.category3Id = category3id;
        }
        //判断：如果路由跳转的时候，带有params参数，捎带脚传递过去
        if (this.$route.params) {
          loction.params = this.$route.params;
          //动态给location配置对象添加query属性
          loction.query = query;
          //路由跳转
          this.$router.push(loction);
        }
      }
    },
```
路径跳转丢失search：
![在这里插入图片描述](https://img-blog.csdnimg.cn/b0ee9922d344435b960f0068037fcc2d.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/05748699ad354595bbe743f97212f2eb.png)
配置路由时，没有命名：
![在这里插入图片描述](https://img-blog.csdnimg.cn/5361afe23acf4a0da9c8e3e422d761bd.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/369d2f6e579b494db714979523d94c40.png)
## 5过渡动画
前提：组件元素务必要有v-if或v-show指令才可以进行

```javascript
<transition name="sort"> 
     <!-- 三级联动 -->
     <div class="sort" v-show="showSort">
     </div>
</transition>
```
属性名name写了之后，不需要使用v-xxx

```javascript
// 过渡动画样式
    // 开始状态
    .sort-enter {
      height: 0;
    }
    // 结束状态
    .sort-enter-to {
      height: 461px;
    }
    // 定义动画时间、速率
    .sort-enter-active {
      transition: all 0.5s linear;
    }
```
### 5.1性能优化问题：
问题：组件切换过程多次向服务器发送请求
解决：APP的mounted只会执行一次
![在这里插入图片描述](https://img-blog.csdnimg.cn/25af51cc3f794fce8caea3f1a8b7d9ad.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQVExNF8=,size_17,color_FFFFFF,t_70,g_se,x_16)
## 6.Mock数据
服务器接口不存在的数据如何模拟，利用mock.js
作用：生成随机数据，拦截AJAX请求

```javascript
npm i --save mockjs  
```
webpack默认对外暴露：图片、JSON数据格式
==使用步骤:== mockjs使用步骤

 1. 在项目当中src文件夹中创建mock文件夹
 2. 第一步准备JSON数据(mock 文件夹中创建相应的JSON文件) ----格式化一下，别留有空格(跑不起来的)
 3. mock数据需要的图片放置到public文件夹中[public文件夹在打包的时候，会把相应的资源原封不动打包到dist文件夹
 4. 创建mockServe . js通过mockjs插件实现模拟数据
 

```javascript
import Mock from 'mockjs'
import banner from './banner.json'
import floor from './floor.json'

// 第一个参数：请求地址 第二个参数：请求数据
Mock.mock("/mock/banner", { code: 200, data: banner })
Mock.mock("/mock/floor", { code: 200, data: floor })
```

 5. mockServe.js文件在入口文件中引入(至少需要执行一次，才能模拟数据)

```javascript
// 引入MockServe.js
import '@/mock/mockServe'
```
## 7.轮播图：swiper
引包+引样式+结构+实例
```javascript
var mySwiper = new Swiper ('.swiper', {
    direction: 'vertical', // 垂直切换选项
    loop: true, // 循环模式选项
    
    // 如果需要分页器
    pagination: {
      el: '.swiper-pagination',
    },
    
    // 如果需要前进后退按钮
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    
    // 如果需要滚动条
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  })        
```

在new Swpier实例之前，页面中结构必须的有[现在把new Swiper实例放在mounte这里发现不行]
原因：因为dispatch当中涉及到异步语句，导致v- for遍历的时候结构还没有完全
解决：

 1. updata能解决，若有别的数据更新，同时触发了响应内容，冗余
 2. setTimeout定时器解决，但过时效才能显示分页器效果
 3. **watch+nectTick**： wahtch只能保证数据已经存在，不能保证结构是否完整
nectTick：在下次DOM更新（服务器数据已返回）
==循环结束之后==（v-for执行结束 结构已完整）执行延迟回调。在==修改数据之后==（服务器数据回来）立即使用这个方法，获取更新后的DOM。

```javascript
watch: {
    bannerList: {
      handler(newValue, oldValue) {
        this.$nextTick(()=>{
          var mySwiper = new Swiper(this.$refs.mySwiper, {
          loop: true, // 循环模式选项

          // 如果需要分页器
          pagination: {
            el: ".swiper-pagination",
          },
          // 如果需要前进后退按钮
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          });
        })
      },
    },
  },
```
## 8.组件通信方式 **
- props：用于父子组件通信
- 自定义事件：@on @emit 可以 实现子给父通信
- 全局事件总线:$bus全能
- pubsub-js:vue当中儿乎不用全能
- 插槽
- vuex
- 
## 9.vuex中getters的使用
作用：为了简化数据，使用方便
配置：

```javascript
// 计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
    // 当前形参state，是当前仓库中的state
    goodsList(state){
        return state.searchList.goodsList
    },
    trademarkList(state) {
        return state.searchList.trademarkList
    },
    attrsList(state) {
        return state.searchList.attrsList
    },
}
```
防止没有网络：

```javascript
goodsList(state){
        // 考虑没有网络
        return state.searchList.goodsList || []
    },
```

 引入：
 

```javascript
import {mapGetters} from 'vuex'
```
使用：

```javascript
computed:{
      ...mapGetters(['goodsList'])
    }
```
Object.assign：ES6新增语法，合并对象

```javascript
beforeMount() {
    Object.assign(this.searchParams,this.$route.query,this.$route.params)
  },
```
报错：
[Vue warn]: Error in render: "TypeError: Cannot read property 'category1Name' of undefined"

```javascript
<!-- 导航路径区域 -->
      <div class="conPoin">
        <span v-if="categoryView.category1Name">{{categoryView.category1Name}}</span>
        <span v-if="categoryView.category2Name">{{categoryView.category2Name}}</span>
        <span v-if="categoryView.category3Name">{{categoryView.category3Name}}</span>
      </div>
// 计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
    categoryView(state){
        // 比如：state.goodInfo初始状态空对象，空对象的categoryView属性值undefined
        return state.goodInfo.categoryView
    }
}
```
原因：state.goodInfo初始状态空对象，空对象的categoryView属性值undefined

##  10.面包屑
兄弟通信：配置全局事件总线

```javascript
new Vue({
  render: h => h(App),
  // $bus
  beforeCreate(){
    Vue.prototype.$bus = this
  },
```

## 11.购物车功能
** 防抖|节流 存储
### 11.1 加入购物车
UUID：点击加入购物车的时候，通过请求头给服务器带临时身份给服务器，存储某一个用户购物车的数据
会话存储：取存储产品的信息一级展示功能
## 12.导航守卫
解决问题：

 1. 多个组件展示用户信息需要在每一个组件的mounted中触发，效率不高
 2. 用户已经登陆，不应该出现在登录页

理解：
导航：表示路由正在发生改变，进行路由跳转
守卫：‘紫禁城护卫’

### 12.1登录页面的重定向
若用户未登录则不能跳转到某些页面，若此时用户登录后应该重新调回到用户原本想跳转的页面。
```javascript
// 获取用户去往的页面
        let toPath = to.path
        if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1){
            // 把未登录的时候想去而没有去成的信息，存储于地址栏中
            next(`/login?redirect=${toPath}`)
        }
```
判断登录页面是否存在query重定向参数：
![login](https://img-blog.csdnimg.cn/0d1c17ff32ab4bb6afb16caae86a80d1.png)`// 登录的路由组件：看路由中是否有query参数，有，跳转到query参数指定的路由中，没有跳到home

    let toPath = this.$route.query.redirect || "/home";
    this.$route.push(toPath)

### 12.2 路由独享与组件内守卫
用户已经登录的情况下，不能去支付成功等页面
只有从购物车界面才能跳转到交易页面( 创建订单)

```javascript
{
        path: '/trade',
        component: Trade,
        meta: { showFooter: true },
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            if (from.path == '/shopcart') {
                next()
            } else {
                // 从哪来回哪去
                next(false)
            }
        }

    },
```

只有从交易页面(创建订单江页面才能跳转到支付页面
只有从支付页面才能跳转到支付成功页面

组件内守卫

```javascript
 export default {
    name: 'PaySuccess',
    //组件内守卫
    beforeRouteEnter (to, from, next) {
      // ...
      if(from.path == '/pay'){
                next()
            } else {
                // 从哪来回哪去
                next(false)
            }
    }
  }
```

## 13.封装模块
不用vuex的情况下实现通信
在main.js入口文件下将api文件在所有暴露的方法进行封装

```javascript
/ 统一接口api文件夹里面全部的请求函数
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

```

## 14. 懒加载
### 14.1 图片懒加载
```javascript
npm i vue-lazyload
```
在请求服务器结束前 加载默认设置的图片

### 14.2 路由懒加载
当路由被访问的时候才加载对应组件

```javascript
{
        path: '/center',
        component: () => import('@/pages/Center'),
        meta: { showFooter: true },
}
```

## 15. 表单验证插件
![注册输入验证判断](https://img-blog.csdnimg.cn/edd928e5bd7548af9f95babfb15a60a3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQVExNF8=,size_20,color_FFFFFF,t_70,g_se,x_16)

```javascript
import Vue from 'vue'
import VeeValidate from 'vee-validate';
// 中文提示信息
import zh_CN from 'vee-validate/dist/locale/zh_CN'
Vue.use(VeeValidate)

// 11表单验证
VeeValidate.validator.localize('zh. CN', {
    messages: {
        ...zh_CN.messages,
        is: (field) => `${field}必须与密码相同`//修改内置规则的message, 让确认密码和密码相同
    },
    attributes: {
        //给校验的field 属性名映射中文名称
        phone: '手机号',
        code: '验证码',
        password: '密码',
        password1: '确认密码',
        agree: '协议',
    }
})

```
使用：

```javascript
 <input
          placeholder="请输入你的手机号"
          v-model="phone"
          name="phone"
          v-validate="{ required: true, regex: /^1\d{10}$/ }"
          :class="{ invalid: errors.has('phone') }"
        />
        <span class="error-msg">{{ errors.first("phone") }}</span>
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/4578456266734ed9b2495f86a8832a06.png)用正则表达式确定验证规则：
手机号：`regex: /^1\d{10}$/ ` 
密码：`regex: /^[0-9A-Za-z]{8-20}$/`
确认密码与原始密码相同：`is:password`

**自定义校验规则**
```javascript
VeeValidate.Validator.extend("agree",{
    validate:(value)=>{
        return value
    },
    getMessage:(field)=>field + '必须同意'
})
```
使用：
```javascript
<input
          name="agree"
          type="checkbox"
          v-validate="{ required: true, 'agree': true }"
          :class="{ invalid: errors.has('agree') }"
        />
        <span>同意协议并注册《尚品汇用户协议》</span>
        <span class="error-msg">{{ errors.first("agree") }}</span>
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/71e49b2872e746a89d9f5f60bbd46f86.png)确认所有表单验证成功，才能完成注册：

```javascript
 async userRegister() {
      const success = await this.$validator.validateAll();
      if (success) {
        try {
          const { phone, code, password, password1 } = this;
            (await this.$store.dispatch("userRegister", {
              phone,
              code,
              password,
            }));
          this.$router.push("/login");
        } catch (error) {
          alert(error.message);
        }
      }
    },
```

## 16. 打包上线
### 16.1 打包

```javascript
npm run build
```
生成dist文件，架构：
![](https://img-blog.csdnimg.cn/2a8cb4d327574049ad5970e6357eacc1.png)项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
有了map就可以像未加密的代码样，准确的输出是哪一行哪一列有错。
![map](https://img-blog.csdnimg.cn/7be8f17ac9cb4ba989d0453955d70560.png)
该文件若项目不需要，在vue.config.js文件写入：`productionSourceMap:false`

### 16.2 购买云服务器

 - 阿里云、腾讯云
 - 记得重置密码
 - 设置安全组 开放端口
 - 利用xshell等工具登录服务器

![在这里插入图片描述](https://img-blog.csdnimg.cn/09b3a2dee08743dfaf6e51871a677cc5.png)
### 16.3 nginx
1、如何通过服务器IP地址直接访问到项目？
在服务器上部署dist文件地址:`/root/project/dist`
2、项目数据来自于哪个服务器
通过`nginx`从数据服务器拿数据
![在这里插入图片描述](https://img-blog.csdnimg.cn/cf45ea523f0343fa84a8c51e659659c1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQVExNF8=,size_20,color_FFFFFF,t_70,g_se,x_16)配置Nginx：在etc文件下

```bash
cd etc
ls
```
安装nginx：`yum install nginx`

```bash
cd nginx
```
存在文件`nginx.conf`
编辑`vim nginx.conf`
解决第一个问题：

```bash
location /{
root /root/project/dist;
index index.html;
try_files $uri/ /index.html;
}
```
解决第二个问题：

```powershell
location /api{
	proxy_pass http://39.983123.211;
```
启动nginx服务器：`service nginx start`


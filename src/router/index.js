//配置路由的地方
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'
//使用插件
Vue.use(VueRouter)

//配置路由
let router = new VueRouter({
    routes,
    // 滚动行为
    scrollBehavior(to, from, savedPosition) {
        // 返回的Y代表滚动条在最上方
        return { y: 0 }
    }
})

// 全局守卫：前置守卫（在路由进行跳转之间进行判断）
router.beforeEach(async (to, form, next) => {
    //to:可以获取到你要跳转到那个路由信息
    //from:可以获取到你从哪个路由而来的信息
    //next:放行函数. next()放行 next(path)放行到指 令路由
    let token = store.state.user.token
    let name = store.state.user.userInfo.name

    if(token){  //已经登陆
        if (to.path == '/login' || to.path == '/register'){
            //已登录 去login
            next('/home')
        }else{
            // 已登录 去别的网页
            if (name) {
                // 用户信息存在
                next()
            } else {
                // 刷新后 用户信息不存在
                try {
                    await store.dispatch('getUserInfo')
                    next()
                } catch (error) {
                    // token失效了 获取不到用户信息 重新登陆
                    await store.dispatch('userLogout')
                    next('/login')
                }
                
            }
        }
    } else {//未登录 不能去trade pay paysuccess center 需要跳转到登录页
        // 除此之外 放行
        // console.log(to.path);
        // 获取用户去往的页面
        let toPath = to.path
        if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1){
            // 把未登录的时候想去而没有去成的信息，存储于地址栏中
            next(`/login?redirect=${toPath}`)
        }
        next()
    }
})


export default router
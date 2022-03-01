//引入一级路由组件
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
// import Center from '@/pages/Center'
// 引入二级路由
import GroupOrder from '@/pages/Center/groupOrder'
import MyOrder from '@/pages/Center/myOrder'
//路由配置信息
export default [
    {
        path: '/center',
        component: () => import('@/pages/Center'),
        meta: { showFooter: true },
        // 二级路由
        children: [
            {
                path: 'myorder',
                component: MyOrder
            },
            {
                path: 'grouporder',
                component: GroupOrder
            },
            {
                path: '/center',
                redirect: '/center/myorder'
            },
        ]
    },
    {
        path: '/paysuccess',
        component: PaySuccess,
        meta: { showFooter: true }
    },
    {
        path: '/pay',
        component: Pay,
        meta: { showFooter: true },
        beforeEnter: (to, from, next) => {
            if(from.path == '/trade'){
                next()
            } else {
                // 从哪来回哪去
                next(false)
            }
        }
    },
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
    {
        path: '/shopcart',
        component: ShopCart,
        meta: { showFooter: true }
    },
    {
        path: '/addcartsuccess',
        component: AddCartSuccess,
        name: 'addcartsuccess',
        meta: { showFooter: true },
    },
    {
        // 错误写法 不会跳转
        // path: '/detail/skuid',
        path: '/detail/:skuid',
        component: Detail,
        meta: { showFooter: true },
    },
    {
        path: '/home',
        component: Home,
        meta: { showFooter: true }
    },
    {
        path: '/search/:keyWord?',
        component: Search,
        meta: { showFooter: true },
        name: "search"
    },
    {
        path: '/login',
        component: Login,
        meta: { showFooter: false }
    },
    {
        path: '/register',
        component: Register,
        meta: { showFooter: false }
    },
    //重定向,只要用户进入界面 必然是首页
    {
        path: '*',
        redirect: '/home'

    }
]
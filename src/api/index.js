// API统一管理

import mockAjax from './mockAjax'
import requests from "./request";
// 三级联动
// /api/product / getBaseCategoryList get 参数无
// export const reqCategoryList = () =>{
//     // 发请求
//     return request({ url:'/product/getBaseCategoryList',method:'get'})
// }

export const reqCategoryList = () => requests({ url: '/product/getBaseCategoryList', method: 'get' })

// 获取banner
export const reqBannerList = () => mockAjax({ url: '/banner', method: 'get' })
// 获取floor
export const reqFloorList = () => mockAjax({ url: '/floor', method: 'get' })

// 获取搜索模块的数据 地址：/api/list 请求方式：post 需要带参数
export const reqGetSearchInfo = (params) => requests({ url: '/list', method: 'post', data: params })

// 获取产品详情信息的接口 URL：/api/item/{skuId} 请求方式：get
export const reqGoodsInfo = (skuId) => requests({ url: `/item/${skuId}`, method: 'get' })

// 将产品添加到购物车中（获取更新某一个产品的个数）
export const reqAddOrUpdateShopCart = (skuId, skuNum) => requests({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: "post" })

// 获取购物车列表数据接口
export const reqCartList = () => requests({ url: '/cart/cartList', method: 'get' })

//删除购物产品的接口
export const reqDeleteCartById = () => requests({ url: `/cart/deleteCart/${skuId}`, method: 'DELETE' })

//修改商品的选中状态
export const reqUpdateCheckedByid = (skuId, isChecked) => requests({ url: `/cart/checkCart/${skuId}/${isChecked}`, method: 'get' })

//获取验证码
export const reqGetCode = (phone) => requests({ url: `/user/passport/sendCode/${phone}`, method: 'get' })

// 注册 phone code password
export const reqUserRegister = (userData) => requests({ url: `/user/passport/register`, data: userData, method: 'post' })

//登录
export const reqUserLogin = (userData) => requests({ url: `/user/passport/login`, data: userData, method: 'post' })

// 获取用户信息 带着用户token获取用户信息
export const reqUserInfo = () => requests({ url: `/user/passport/auth/getUserInfo`, method: 'get' })

// 退出登录
export const reqLogout = () => requests({ url:`/user/passport/logout`,method:'get'})

// 获取用户地址信息
export const reqAddressInfo = () => requests({ url:`/user/userAddress/auth/findUserAddressList`,method:'get'})

// 获取商品的清单
export const reqOrderInfo = () => requests({ url: `/order/auth/trade`, method: 'get' })

// 提交订单的接口
export const reqSubmitOrder = (tradeNo, data) => requests({ url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,data,method:`post`})

// 获取支付信息
export const reqPayInfo = (orderId) => requests({ url: `/payment/weixin/createNative/${orderId}`,method:`GET`})

// 获取支付订单状态
export const reqPayStatus = (orderId) => requests({ url:`/payment/weixin/queryPayStatus/${orderId}`,method:`get`})

//获取个人中心的数据
export const reqMyOrderList = (page, limit) => requests({ url:`/order/auth/${page}/${limit}`,method:'get'})
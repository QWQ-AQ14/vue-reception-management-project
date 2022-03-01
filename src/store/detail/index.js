import { reqGoodsInfo, reqAddOrUpdateShopCart } from "@/api"
// 封装游客身份模块uuid
import { getUUID} from '@/utils/uuid_token'
//仓库存储数据的地方
const state = {
    //不一定是数组 取决于服务器返回的数据格式
    goodInfo:{},
    uuid_token:getUUID()

}
// 修改state的唯一手段
const mutations = {
    GETGOODINFO(state,goodInfo){
        state.goodInfo = goodInfo
    }

}
// 处理action，可以书写自己的业务逻辑，也可以受理异步
const actions = {
    // 获取产品信息的action
    async getGoodInfo({commit},skuId){
        let result = await reqGoodsInfo(skuId)
        // console.log(result);
        if(result.code == 200){
            commit("GETGOODINFO",result.data)
        }
    },
    // 将产品添加到购物车中
    async addAddOrUpdateShopCart({ commit }, {skuId,skuNum}) {
        // 加入购物车返回的结果
        let result = await reqAddOrUpdateShopCart(skuId, skuNum)
        console.log(result);
        if (result.code == 200) {
            return "ok" 
        }else{
            return Promise.reject(new Error('faile'))
        }
    },
}
// 计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
    categoryView(state){
        // 比如：state.goodInfo初始状态空对象，空对象的categoryView属性值undefined
        return state.goodInfo.categoryView || {}
    },
    skuInfo(state){
        return state.goodInfo.skuInfo || {}
    },
    spuSaleAttrList(state){
        return state.goodInfo.spuSaleAttrList || []
    }
}

// 对外暴露store类的一个实例
export default ({
    state,
    mutations,
    actions,
    getters
})
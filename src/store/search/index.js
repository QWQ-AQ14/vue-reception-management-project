import { reqGetSearchInfo} from '@/api'

//仓库存储数据的地方
const state = {
    // 初始化格式不能乱写
    searchList : {}
}
// 修改state的唯一手段
const mutations = {
    GETSEARCHLIST(state,searchList){
        state.searchList = searchList
    }
}
// 处理action，可以书写自己的业务逻辑，也可以受理异步
const actions = {
    async getSearchList({commit},params={}){
        let result = await reqGetSearchInfo(params)
        if(result.code == 200){
            commit("GETSEARCHLIST",result.data)
        }
    }
}
// 计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
    // 当前形参state，是当前仓库中的state
    goodsList(state){
        // 考虑没有网络
        return state.searchList.goodsList || []
    },
    trademarkList(state) {
        return state.searchList.trademarkList || []
    },
    attrsList(state) {
        return state.searchList.attrsList || []
    },
}

// 对外暴露store类的一个实例
export default ({
    state,
    mutations,
    actions,
    getters
})
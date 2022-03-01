import { reqCategoryList, reqBannerList, reqFloorList} from '@/api'
//仓库存储数据的地方
const state = {
    //不一定是数组 取决于服务器返回的数据格式
    categoryList :[],
    bannerList:[],
    floorList:[]
}
// 修改state的唯一手段
const mutations = {
    CATEGORYLIST(state, categoryList){
        state.categoryList = categoryList
    },
    BANNERLIST(state, bannerList) {
        state.bannerList = bannerList
    },
    FLOORLIST(state, floorList) {
        state.floorList = floorList
    }
}
// 处理action，可以书写自己的业务逻辑，也可以受理异步
const actions = {
// 通过API里面的借口函数调用 向服务器发请求，获取服务器的数据
    async categoryList({commit}){
        let result = await reqCategoryList()
        // console.log(result.data);
        if(result.code == 200){
            commit("CATEGORYLIST",result.data)
        }
    },
    // 获取首页轮播图的数据
    async getBannerList({ commit }) {
        let result = await reqBannerList()
        // console.log(result);
        if (result.code == 200) {
            commit("BANNERLIST", result.data)
        }
    },
    // 获取floor数去
    async getFloorList({ commit }) {
        let result = await reqFloorList()
        // console.log(result.data);
        if (result.code == 200) {
            // 提交mutation
            commit("FLOORLIST", result.data)
        }
    },
}
// 计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {}

// 对外暴露store类的一个实例
export default ({
    state,
    mutations,
    actions,
    getters
})
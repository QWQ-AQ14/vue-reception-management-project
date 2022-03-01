// 登录与注册的模块
import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqLogout} from '@/api'
import { setToken, getToken, removeToken} from '@/utils/token'
const state = {
    code: '',
    token: getToken(),
    userInfo: {}
};
const mutations = {
    GETCODE(state, code) {
        state.code = code
    },
    USERLOGIN(state, token) {
        state.token = token
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo
    },
    // 清除本地数据
    CLEAR(state){
        // 帮仓库中相关用户信息清除
        state.token = ''
        state.userInfo = {}
        removeToken()

    }
};
const actions = {
    // 获取验证码
    async getCode({ commit }, phone) {
        // 获取验证码的这个接口 把验证码返回 正常情况是返回到手机上
        let result = await reqGetCode(phone)
        // console.log(result);
        if (result.code == 200) {
            commit("GETCODE", result.data)
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 用户注册
    async userRegister({ commit }, user) {
        // 获取验证码的这个接口 把验证码返回 正常情况是返回到手机上
        let result = await reqUserRegister(user)
        // console.log(result);
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 登录业务
    async userLogin({ commit }, data) {
        let result = await reqUserLogin(data)
        // console.log(result);
        if (result.code == 200) {
            commit("USERLOGIN", result.data.token)
            setToken(result.data.token)
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 获取用户信息
    async getUserInfo({ commit }) {
        let result = await reqUserInfo()
        console.log(result);
        if (result.code == 200) {
            commit("GETUSERINFO", result.data)
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 退出登录
    async userLogout({ commit }){
        // 只是通知服务器发起一次请求，通知服务器清楚相关token
        let result = await reqLogout()
        if (result.code == 200) {
            commit("CLEAR")
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    }

};
const getters = {};
export default {
    state,
    mutations,
    actions,
    getters
}

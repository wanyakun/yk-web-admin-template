import UserApi from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const data = await UserApi.login({ userName: username.trim(), password: password })
    commit('SET_TOKEN', data.token)
    setToken(data.token)
  },

  // get user info
  async getInfo({ commit, state }) {
    const data = await UserApi.getInfo()
    const { userName } = data
    const avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'

    commit('SET_NAME', userName)
    commit('SET_AVATAR', avatar)
  },

  // user logout
  async logout({ commit, state }) {
    await UserApi.logout()
    commit('SET_TOKEN', '')
    removeToken()
    resetRouter()
  },

  // remove token
  async resetToken({ commit }) {
    commit('SET_TOKEN', '')
    removeToken()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


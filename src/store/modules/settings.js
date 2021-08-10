import defaultSettings from '@/settings'

const { showSettings, fixedHeader, sidebarLogo, permissionEnable, showSidebar, showNavbar, tagsView } = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  permissionEnable: permissionEnable,
  showSidebar: showSidebar,
  showNavbar: showNavbar,
  tagsView: tagsView
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


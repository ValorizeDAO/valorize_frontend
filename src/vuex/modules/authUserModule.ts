import { ActionContext } from "vuex"
import { User, emptyUser } from "../../models/User"
import auth from "../../services/authentication"

export default {
  namespaced: true,
  state() {
    return {
      checkingAuth: false,
      authenticated: false,
      hasToken: false,
      user: {
        id: 0,
        email: "",
        name: "",
        username: "",
        avatar: "",
        about: "",
        links: [],
      },
    }
  },
  getters: {
    authenticated: (state: UserState) => state.authenticated,
    user: (state: UserState) => state.user,
    username: (state: UserState) => state.user.username,
    checkingAuth: (state: UserState) => state.checkingAuth,
    profileImage: (state: UserState) => state.user.avatar,
    hasToken: (state: UserState) => state.hasToken,
  },
  mutations: {
    authenticated(state: UserState, payload: boolean) {
      state.checkingAuth = false
      state.authenticated = payload
    },
    setUser(state: UserState, payload: User) {
      state.authenticated = true // assumes setUser is only called by logging in
      state.checkingAuth = false
      state.user = payload
      state.user.avatar = state.user.avatar || "/assets/img/default_avatar.png"
    },
    setUserPicture(state: UserState, payload: string) {
      state.user.avatar = payload
    },
    logout(state: UserState) {
      state.authenticated = false
      state.user = emptyUser
    },
  },
  actions: {
    async checkAuth({ commit, state }: ActionContext<UserState, any>) {
      if (state.checkingAuth) {
        return
      }
      state.checkingAuth = true
      const { isLoggedIn, user } = await auth.isLoggedIn()
      if (isLoggedIn) {
        commit("authenticated", true)
        commit("setUser", user)
      } else {
        commit("authenticated", false)
      }
      state.checkingAuth = false
    },
    async logout({ commit }: ActionContext<UserState, any>) {
      await auth.logout()
      commit("logout")
    },
  },
}

interface UserState {
  checkingAuth: boolean;
  authenticated: boolean;
  hasToken: boolean;
  user: User;
}

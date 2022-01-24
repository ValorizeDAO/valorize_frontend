import { createRouter, createWebHistory } from "vue-router"
import auth from "../services/authentication"
import Landing from "../views/Landing.vue"
import Dashboard from "../views/Dashboard.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import EditProfilePage from "../views/EditProfilePage.vue"
import TokenAdminPage from "../views/TokenAdminPage.vue"
import ProfilePage from "../views/ProfilePage.vue"
import TokenSuccess from "../views/TokenSuccess.vue"
import Leadgen from "../views/Leadgen.vue"
import store from "../vuex/store"

const routes = [
  {
    path: "/",
    name: "Landing",
    component: Landing,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/beta-signup",
    name: "Join Beta",
    component: Leadgen,
  },
  {
    path: "/edit-profile",
    name: "Edit Profile",
    component: EditProfilePage,
  },
  {
    path: "/:username",
    name: "Show Profile",
    component: ProfilePage,
  },
  {
    path: "/token-success",
    name: "Token Success",
    component: TokenSuccess,
  },
  {
    path: "/token/:id",
    name: "Token Admin",
    component: TokenAdminPage,
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const publicRoutes = ["Landing", "Login", "Register", "Show Profile", "Join Beta"]
  let { name } = to
  const { username } = to.params
  name = name?.toString() || ""
  const title = document.querySelector("head > title")
  if (title) {
    switch (name) {
      case "Show Profile":
        title.innerHTML = `${username}'s Profile`
        break
      case "Landing":
        title.innerHTML = "Valorize | Launch your own crypto in 1 click"
        break
      default:
        title.innerHTML = name + " | Valorize"
        break
    }
  }
  const isAuthenticated = store.state.authenticated
  if (!publicRoutes.includes(name) && !isAuthenticated) {
    store.state.checkingAuth = true
    const { isLoggedIn, user } = await auth.isLoggedIn()
    if (!isLoggedIn) {
      store.state.checkingAuth = false
      next({ name: "Login" })
    } else {
      store.commit("authUser/setUser", user)
      next()
    }
  }
  next()
})

export default router

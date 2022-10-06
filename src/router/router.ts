import { createRouter, createWebHistory } from "vue-router"
import auth from "../services/authentication"
import Landing from "../views/Landing.vue"
import Dashboard from "../views/Dashboard.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import ResetPassword from "../views/ResetPassword.vue"
import EditProfilePage from "../views/EditProfilePage.vue"
import CreateTokenPage from "../views/CreateTokenPage.vue"
import TokenAdminPage from "../views/TokenAdminPage.vue"
import ProfilePage from "../views/ProfilePage.vue"
import TokenSuccess from "../views/TokenSuccess.vue"
import Leadgen from "../views/Leadgen.vue"
import AirdropCreationPage from "../views/AirdropCreationPage.vue"
import AirdropClaimPage from "../views/AirdropClaimPage.vue"
import TokenDashboard from "../views/TokenDashboard.vue"
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
    path: "/reset-password",
    name: "Reset Password",
    component: ResetPassword,
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
    path: "/token/:tokenId/airdrop/:airdropId",
    name: "Claim Airdrop",
    component: AirdropClaimPage,
  },
  {
    path: "/dashboard/token/create",
    name: "Create Token",
    component: CreateTokenPage,
  },
  {
    path: "/dashboard/token/:id",
    name: "Token",
    component: TokenDashboard,
    children: [
      {
        path: "",
        name: "Token Admin",
        component: TokenAdminPage,
      },
      {
        path: "airdrop/create",
        name: "Create Airdrop",
        component: AirdropCreationPage,
      },
    ],
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const publicRoutes = ["Landing", "Login", "Register", "Show Profile", "Join Beta", "Claim Airdrop", "Reset Password"]
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
  const isAuthenticated = store.state.authUser.authenticated
  if (!publicRoutes.includes(name) && !isAuthenticated) {
    if (isAuthenticated) {
      return next()
    }
    store.state.checkingAuth = true
    const { isLoggedIn: isReturnUser, user } = await auth.isLoggedIn()
    store.state.checkingAuth = false
    if (isReturnUser) {
      store.commit("authUser/setUser", user)
      next()
    } else {
      next({ path: "/login", query: { redirectUri: to.fullPath } })
    }
  } else {
    next()
  }
})

export default router

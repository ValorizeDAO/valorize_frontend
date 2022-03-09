import { createStore } from "vuex";
import authUser from "./modules/authUserModule";
import userToken from "./modules/userTokenModule";
import LogRocket from "logrocket";

export default createStore({
  modules: {
    authUser,
    userToken,
  },
});

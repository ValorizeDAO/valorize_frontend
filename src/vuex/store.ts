import { createStore } from "vuex";
import authUser from "./modules/authUserModule";
import userToken from "./modules/userTokenModule";
import createPlugin from "logrocket-vuex";
import LogRocket from "logrocket";

const logrocketPlugin = createPlugin(LogRocket);
export default createStore({
  modules: {
    authUser,
    userToken,
  },
  plugins: [logrocketPlugin],
});

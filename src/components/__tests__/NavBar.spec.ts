import Vuex from "vuex";
import { shallowMount } from "@vue/test-utils";
import NavBar from "../NavBar.vue";

describe("<NavBar \\>", () => {
  let store: any;
  let wrapper: any;
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        "authUser/checkingAuth": () => false,
        "authUser/authenticated": () => false,
        "authUser/user": () => false,
      },
    });
  });

  it("renders", () => {
    wrapper = shallowMount(NavBar, {
      global: {
        mocks: {
          $store: store,
        },
      },
    });
    expect(wrapper).toBeTruthy();
  });
});

import Vuex from "vuex"
import { shallowMount } from "@vue/test-utils"
import NavBar from "../NavBar.vue"

describe("<NavBar \\>", () => {
  let store: any
  let wrapper: any
  let mockRouter: any
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        "authUser/checkingAuth": () => false,
        "authUser/authenticated": () => false,
        "authUser/user": () => false,
      },
    })
    mockRouter = {
      push: jest.fn(),
    }
  })

  it("renders", () => {
    wrapper = shallowMount(NavBar, {
      global: {
        mocks: {
          $store: store,
          $router: mockRouter,
        },
        stubs: ["router-link"],
      },
    })
    expect(wrapper).toBeTruthy()
  })
})

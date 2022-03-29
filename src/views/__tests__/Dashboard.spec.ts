import { shallowMount } from "@vue/test-utils"
import Dashboard from "@/views/Dashboard.vue"

jest.mock("vuex", () => ({
  useStore: jest.fn(() => ({
    getters: {
      "authUser/user": {
        id: "1",
        name: "test",
      },
    },
  })),
}))
jest.mock("../../services/authentication", () => ({
  getTokens: jest.fn().mockResolvedValue({
    status: 200,
    json: jest.fn(() => ({
      tokens: [
        { id: 38, token_type: "timed_mint", name: "JabaCoin", address: "0xAc73e66733Be787C17d135eA6899d4103d469b45", network: 1 },
        { id: 40, token_type: "simple", name: "JabaCoin", address: "0x8aAbfb1C1F269ed324e251FDDa38D5894ae417f3", network: 1 },
      ],
    })),
  }),
}))
describe("<Dashboard \\>", () => {
  it("mounts", () => {
    const wrapper = shallowMount(Dashboard, {
      global: {
        stubs: ["router-link"],
      },
    })
    expect(wrapper).toBeTruthy()
  })
  describe("Shows user tokens on render", () => {
    it("shows user tokens", async () => {
      const wrapper = shallowMount(Dashboard, {
        global: {
          stubs: ["router-link"],
        },
      })
      // to put the rest of the function execution after the onMounted hook runs
      await new Promise((resolve) => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()
      expect(wrapper.findAll(".token-list-item").length).toBe(2)
    })
  })
})

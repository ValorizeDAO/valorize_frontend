import { shallowMount } from "@vue/test-utils"
import Dashboard from "@/views/Dashboard.vue"
import SlotStub from "@/test-helpers/SlotStub.vue"

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
        { id: 38, symbol: "JABA", token_type: "timed_mint", name: "JabaCoin", address: "0xAc73e66733Be787C17d135eA6899d4103d469b45", chain_id: 1 },
        { id: 40, symbol: "COIN", token_type: "simple", name: "TestCoin", address: "0x8aAbfb1C1F269ed324e251FDDa38D5894ae417f3", chain_id: 42161 },
      ],
    })),
  }),
}))
describe("<Dashboard \\>", () => {
  it("mounts", () => {
    const wrapper = shallowMount(Dashboard, {
      global: {
        stubs: { "router-link": SlotStub },
      },
    })
    expect(wrapper).toBeTruthy()
  })
  describe("Shows user tokens on render", () => {
    it("Should show user tokens", async () => {
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
    it("Should show the name of the network the token is deployed to", async () => {
      const wrapper = shallowMount(Dashboard, {
        global: {
          stubs: { "router-link": SlotStub },
        },
      })
      await new Promise((resolve) => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#token-38").find(".network-name").text()).toBe("Ethereum")
      expect(wrapper.find("#token-40").find(".network-name").text()).toBe("Arbitrum")
    })
  })
})

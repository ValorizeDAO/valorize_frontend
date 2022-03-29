import { shallowMount } from "@vue/test-utils"
import CreateToken from "../CreateToken"

jest.mock("vue-router", () => ({
  useRoute: jest.fn(() => ({
    query: { redirectUri: "a", registerAddress: "b" },
  })),
  useRouter: jest.fn(() => ({ name: "Home" })),
}))
jest.mock("ethers", () => ({
  ethers: {
    utils: {
      getAddress: jest.fn(() => {
        return true
      }),
    },
  },
  Signer: jest.fn(),
  providers: jest.fn(),
  BigNumber: {
    from: jest.fn(() => {
      return true
    }),
  },
}))

describe("<CreateToken \\>", () => {
  let wrapper: any

  it("renders", () => {
    wrapper = shallowMount(CreateToken)
    expect(wrapper).toBeTruthy()
  })
  describe("Displays Parameters", () => {
    it("should show inputs for simple token on render", () => {
      wrapper = shallowMount(CreateToken)
      expect(wrapper.find("input[name='tokenName']").exists()).toBe(true)
      expect(wrapper.find("input[name='tokenSymbol']").exists()).toBe(true)
      expect(wrapper.find("input[name='initialSupply']").exists()).toBe(true)
      expect(wrapper.find("input[name='vaultAddress']").exists()).toBe(true)
      expect(wrapper.find("input[name='airdropSupply']").exists()).toBe(true)
      expect(wrapper.find("input[name='adminAddresses']").exists()).toBe(true)
      expect(wrapper.find("input[name='minting']").exists()).toBe(true)
    })
    it("should not show inputs for TimedMintToken on render", () => {
      wrapper = shallowMount(CreateToken)
      expect(wrapper.find("input[name='supplyCap']").exists()).toBe(false)
      expect(wrapper.find("input[name='maxSupply']").exists()).toBe(false)
      expect(wrapper.find("input[name='timeDelay']").exists()).toBe(false)
      expect(wrapper.find("input[name='mintCap']").exists()).toBe(false)
    })
    it("should show inputs for TimedMintToken if minting is set to true", async () => {
      wrapper = shallowMount(CreateToken)
      const mintingActiveButton = wrapper.find("input#minting-yes")
      await mintingActiveButton.trigger("click")
      await wrapper.vm.$nextTick()
      expect(wrapper.find("input[name='supplyCap']").exists()).toBe(true)
      expect(wrapper.find("input[name='timeDelay']").exists()).toBe(true)
      expect(wrapper.find("input[name='mintCap']").exists()).toBe(true)
    })
    it("should show only show MaxSupply input if minting is set to true and SupplyCap is set to true", async () => {
      wrapper = shallowMount(CreateToken)
      expect(wrapper.find("input[name='maxSupply']").exists()).toBe(false)
      const mintingActiveButton = wrapper.find("input#minting-yes")
      await mintingActiveButton.trigger("click")
      const maxSupplyButton = wrapper.find("input#mint-cap-yes")
      await maxSupplyButton.trigger("click")
      await wrapper.vm.$nextTick()
      expect(wrapper.find("input[name='maxSupply']").exists()).toBe(true)
    })
  })
})

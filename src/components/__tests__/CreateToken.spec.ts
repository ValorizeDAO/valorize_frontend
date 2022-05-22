import { shallowMount } from "@vue/test-utils"
import CreateToken from "../CreateToken"

jest.mock("vue-router", () => ({
  useRoute: jest.fn(() => ({
    query: { redirectUri: "a", registerAddress: "b" },
  })),
  useRouter: jest.fn(() => ({ name: "Home" })),
}))

jest.mock("../../services/authentication", () => ({
  getContractKeys: jest.fn(() => ({
    smartContractKeys: ["1", "2"],
  })),
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
  describe("Validations", () => {
    it("Should display an error if vault address is invalid ETH address", async () => {
      wrapper = shallowMount(CreateToken)
      expect(wrapper.find("#vaultAddress-error").exists()).toBe(false)
      const vaultInput = wrapper.find("input[name='vaultAddress']")
      vaultInput.setValue("0x123")
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#vaultAddress-error").exists()).toBe(true)
    })
    it("Should display an error if admin addresses are invalid ETH address", async () => {
      wrapper = shallowMount(CreateToken)
      expect(wrapper.find("#admin-addresses-error").exists()).toBe(false)
      const vaultInput = wrapper.find("input[name='adminAddresses']")

      // all addresses invalid
      vaultInput.setValue("0x123, 0x456, 0x789")
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#admin-addresses-error").exists()).toBe(true)

      // one address valid
      vaultInput.setValue("0x123530E9eA179066961fF4424668B04587DC0456, 0x456, 0x789")
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#admin-addresses-error").exists()).toBe(true)

      // one address invalid
      vaultInput.setValue("0x123530E9eA179066961fF4426648B04587DC0456, 0x456530E9eA179066961fF4424668B04587DC0456, 0x789")
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#admin-addresses-error").exists()).toBe(true)

      // first address invalid
      vaultInput.setValue("0x123, 0x456530E9eA1790664961fF442668B04587DC0456, 0x789530E9eA179066961fF4442668B04587DC0456")
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#admin-addresses-error").exists()).toBe(true)

      // all addresses valid
      vaultInput.setValue("0x123530E9eA179066961fF442668B045879DC0456, 0x456530E9eA179066961fF4426968B04587DC0456, 0x789530E9eA1790669461fF442668B04587DC0456")
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#admin-addresses-error").exists()).toBe(false)
    })
  })
})

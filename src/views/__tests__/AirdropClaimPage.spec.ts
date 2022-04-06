import { shallowMount } from "@vue/test-utils"
import AirdropClaimPage from "@/views/AirdropClaimPage.vue"
import { SimpleTokenFactory } from '@/contracts/SimpleTokenFactory';
import api from "../../services/api"

jest.mock("vue-router", () => ({
  useRoute: jest.fn(() => ({
    params: { tokenId: "1", airdropId: "1" },
  })),
  useRouter: jest.fn(() => ({ name: "Home" })),
}))
jest.mock("../../services/api")
jest.mock("ethers", () => ({
  BigNumber: {
    from: jest.fn((value: any) => "BN" + value)
  }
}))
jest.mock("../../services/getProviderInfo", () => ({
  getProviderAndSigner: jest.fn(() => ({
      signer: {} as any,
      provider: {} as any,
      error: false
    }))
  })
)
const mockClaimFunction = jest.fn();
const mockTokenContract = {
  claimTokens: mockClaimFunction,
}
jest.mock("../../contracts/SimpleTokenFactory")
SimpleTokenFactory.mockImplementation(() => {
  return {
    attach: jest.fn(() => mockTokenContract),
  }
})

describe("<AirdropClaimPage \\>", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it("mounts", () => {
    const wrapper = setupTest()
    expect(wrapper).toBeTruthy()
  })
  describe("Search Bar", () => {
    it("Shows an error message if the address is not in the airdrop", async () => {
      const wrapper = setupTest({ apiReturnsSuccess: false })
      expect(wrapper.find("#search-error").exists()).toBe(false)
      const inputBar = wrapper.find("#address-input")
      await inputBar.setValue("0x4a26A766D46736994e838445b9833e313608490d")
      const submitButton = wrapper.find("#submit-button")
      await submitButton.trigger("click")
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#search-error").exists()).toBe(true)
    })
    it("Displays the claim amount if the address is elegible", async () => {
      const wrapper = setupTest()
      expect(wrapper.find("#claim-section").exists()).toBe(false)
      const inputBar = wrapper.find("#address-input")
      await inputBar.setValue("0x4B4E9835E6519e81ad07d491D347955C7117a08E")
      const submitButton = wrapper.find("#submit-button")
      await submitButton.trigger("click")
      await wrapper.vm.$nextTick()
      const claimSection = wrapper.find("#claim-section")
      expect(claimSection.exists()).toBe(true)
      await wrapper.vm.$nextTick()
      expect(claimSection.text()).toContain("18000000000000000000000")
    })
    it("Hides the input bar after succesfully getting a claim amount", async () => {
      const wrapper = setupTest()
      const inputBar = wrapper.find("#address-input")
      await inputBar.setValue("0x4B4E9835E6519e81ad07d491D347955C7117a08E")
      const submitButton = wrapper.find("#submit-button")
      await submitButton.trigger("click")
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#submit-button").exists()).toBe(false)
      expect(wrapper.find("#address-input").exists()).toBe(false)
    })
  })
  describe("Claiming Airdrop", () => {
    beforeEach(() => {
      (window as any).ethereum = jest.fn()
    })
    it("Shows a button to execute airdrop claim after requesting address claim", async () => {
      const wrapper = setupTest()
      expect(wrapper.find("#send-claim").exists()).toBe(false)
      const inputBar = wrapper.find("#address-input")
      await inputBar.setValue("0x4B4E9835E6519e81ad07d491D347955C7117a08E")
      const submitButton = wrapper.find("#submit-button")
      await submitButton.trigger("click")
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#send-claim").exists()).toBe(true)
    })
    it("Shows a button to execute airdrop claim after requesting address claim", async () => {
      const wrapper = setupTest()
      expect(wrapper.find("#send-claim").exists()).toBe(false)
      const inputBar = wrapper.find("#address-input")
      await inputBar.setValue("0x4B4E9835E6519e81ad07d491D347955C7117a08E")
      const submitButton = wrapper.find("#submit-button")
      await submitButton.trigger("click")
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#send-claim").exists()).toBe(true)
    })
    it("Sends a request to user when send-claim is pressed", async () => {
      const wrapper = setupTest()
      const inputBar = wrapper.find("#address-input")
      await inputBar.setValue("0x4B4E9835E6519e81ad07d491D347955C7117a08E")
      const submitButton = wrapper.find("#submit-button")
      await submitButton.trigger("click")
      await wrapper.vm.$nextTick()
      await wrapper.find("#send-claim").trigger("click")
      expect(mockClaimFunction).toHaveBeenCalledWith("BN18000000000000000000000", ["1", "2"])
    })
  })
})

function setupTest(options = { apiReturnsSuccess: true }) {
  const returnBodyError = { error: "this airdrop is not available for this address" }
  const returnBodySuccess = { claim: "18000000000000000000000", merkleProof: ["1", "2"] }
  const mockResolvedValue = {
    status: options.apiReturnsSuccess ? 200 : 404,
    json: jest.fn(() => {
      return options.apiReturnsSuccess ? returnBodySuccess : returnBodyError
    })
  }
  api.getAirdropClaim = jest.fn().mockResolvedValue(mockResolvedValue)
  api.getTokenData = jest.fn().mockResolvedValue({
    address: "0x4B4E9835E6519e81ad07d491D347955C7117a08E",
    name: "Test Token",
    symbol: "TST"
  })
  return shallowMount(AirdropClaimPage)
}

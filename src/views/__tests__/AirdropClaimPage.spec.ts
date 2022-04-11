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
  },
  utils: {
    formatEther: jest.fn((val) => val / 10 ** 18) 
  }
}))
jest.mock("../../services/getProviderInfo", () => ({
  getProviderAndSigner: jest.fn(() => ({
      signer: { getAddress: jest.fn(() => "0x4B4E9835E6519e81ad07d491D347955C7117a08E")} as any,
      error: false
    }))
  })
)
const mockStore = {
  getters: {
    "authUser/isAuthenticated": jest.fn(() => false),
  },
}
jest.mock("vuex", () => ({
  useStore: jest.fn(() => mockStore),
}))
jest.mock("../../contracts/SimpleTokenFactory")
jest.mock("currency.js", () => ({
   __esModule: true, 
  default: jest.fn(jest.fn((val) => ({ format : () => "$" + val })))
}))

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
      expect(wrapper.find("#claim-button-section").exists()).toBe(false)
      const inputBar = wrapper.find("#address-input")
      await inputBar.setValue("0x4B4E9835E6519e81ad07d491D347955C7117a08E")
      const submitButton = wrapper.find("#submit-button")
      await submitButton.trigger("click")
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()
      const claimSection = wrapper.find("#claim-button-section")
      expect(claimSection.exists()).toBe(true)
      expect(claimSection.text()).toContain("$18000")
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
      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#send-claim").exists()).toBe(true)
    })
    it("Shows a button to execute airdrop claim after requesting address claim", async () => {
      const wrapper = setupTest()
      const inputBar = wrapper.find("#address-input")
      await inputBar.setValue("0x4B4E9835E6519e81ad07d491D347955C7117a08E")
      const submitButton = wrapper.find("#submit-button")
      await submitButton.trigger("click")
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#send-claim").exists()).toBe(true)
    })
    it("Sends a request to tokenContract when send-claim is pressed", async () => {
      const wrapper = setupTest()
      const inputBar = wrapper.find("#address-input")
      await inputBar.setValue("0x4B4E9835E6519e81ad07d491D347955C7117a08E")
      const submitButton = wrapper.find("#submit-button")
      await submitButton.trigger("click")
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()
      await wrapper.find("#send-claim").trigger("click")
      expect(mockClaimFunction).toHaveBeenCalledWith("BN18000000000000000000000", ["1", "2"])
    })
    it("Displays a loading message when the claim function has been called", async () => {
      const wrapper = setupTest()
      const inputBar = wrapper.find("#address-input")
      await inputBar.setValue("0x4B4E9835E6519e81ad07d491D347955C7117a08E")
      const submitButton = wrapper.find("#submit-button")
      await submitButton.trigger("click")
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#transaction-executing").exists()).toBe(false)
      await wrapper.find("#send-claim").trigger("click")
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#transaction-executing").exists()).toBe(true)
    })
    it("Displays success message after succesful claim", async () => {
      const wrapper = setupTest()
      const inputBar = wrapper.find("#address-input")
      await inputBar.setValue("0x4B4E9835E6519e81ad07d491D347955C7117a08E")
      const submitButton = wrapper.find("#submit-button")
      await submitButton.trigger("click")
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()
      await wrapper.find("#send-claim").trigger("click")
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#transaction-success").exists()).toBe(false)
      await new Promise(resolve => setTimeout(resolve, 1))
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#transaction-executing").exists()).toBe(false)
      expect(wrapper.find("#transaction-success").exists()).toBe(true)
      expect(wrapper.find("#transaction-error").exists()).toBe(false)
    })
    it("Displays error message after unsuccesful claim", async () => {
      const wrapper = setupTest({ contractClaimSuccess: false })
      const inputBar = wrapper.find("#address-input")
      await inputBar.setValue("0x4B4E9835E6519e81ad07d491D347955C7117a08E")
      const submitButton = wrapper.find("#submit-button")
      await submitButton.trigger("click")
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))
      await wrapper.vm.$nextTick()
      await wrapper.find("#send-claim").trigger("click")
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#transaction-error").exists()).toBe(false)
      await new Promise(resolve => setTimeout(resolve, 1))
      await wrapper.vm.$nextTick()
      expect(wrapper.find("#transaction-executing").exists()).toBe(false)
      expect(wrapper.find("#transaction-success").exists()).toBe(false)
      expect(wrapper.find("#transaction-error").exists()).toBe(true)
    })
  })
  describe("Redirecting to register", () => {
    let wrapper
    beforeEach(async () => {
      wrapper = setupTest()
      const inputBar = wrapper.find("#address-input")
      await inputBar.setValue("0x4B4E9835E6519e81ad07d491D347955C7117a08E")
      const submitButton = wrapper.find("#submit-button")
      await submitButton.trigger("click")
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 1))
      await wrapper.vm.$nextTick()
      await wrapper.find("#send-claim").trigger("click")
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 1))
      await wrapper.vm.$nextTick()
      console.log(wrapper.html())
    })
    it("Should show user a message to register their address if not logged in", async () => {
      expect(wrapper.find("#transaction-success").exists()).toBeTruthy()
    })
  })
})

const mockClaimFunction = jest.fn(() => {
    return Promise.resolve({ wait: () => Promise.resolve() })
  }
);
const mockTokenContractSuccess = {
  claimTokens: mockClaimFunction
}
const mockClaimFunctionFail = jest.fn(() => {
  return new Promise((_, reject) => setTimeout(() => reject({ code: '' }), 0))}
);
const mockTokenContractFail = {
  claimTokens: mockClaimFunctionFail,
}
function setupTest(options = {} as setupOptions) {
  options.apiReturnsSuccess = options.apiReturnsSuccess !== undefined ? false : true
  options.contractClaimSuccess = options.contractClaimSuccess !== undefined ? false : true
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
  SimpleTokenFactory.mockImplementation(() => {
    return {
      attach: jest.fn(() => {
        return options.contractClaimSuccess ? mockTokenContractSuccess : mockTokenContractFail
      }),


    }
  })
  return shallowMount(AirdropClaimPage)
}

type setupOptions = {
  apiReturnsSuccess?: boolean;
  contractClaimSuccess?: boolean;
}
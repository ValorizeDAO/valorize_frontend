import { shallowMount } from "@vue/test-utils"
import AirdropClaimPage from "@/views/AirdropClaimPage.vue"
import api from "../../services/api"

jest.mock("vue-router", () => ({
  useRoute: jest.fn(() => ({
    params: { tokenId: "1", airdropId: "1" },
  })),
  useRouter: jest.fn(() => ({ name: "Home" })),
}))
jest.mock("../../services/api")

describe("<AirdropClaimPage \\>", () => {
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
      expect(claimSection.text()).toContain("18000000000000000000000")
    })
  })
})

function setupTest(options = { apiReturnsSuccess: true }) {
  const returnBodyError = { error: "this airdrop is not available for this address" }
  const returnBodySuccess = { claim: "18000000000000000000000", merkleProof: [""] }
  const mockResolvedValue = {
    status: options.apiReturnsSuccess ? 200 : 404,
    json: jest.fn(() => {
      console.log(options.apiReturnsSuccess); 
      return options.apiReturnsSuccess ? returnBodySuccess : returnBodyError
    })
  }
  api.getAirdropClaim = jest.fn().mockResolvedValue(mockResolvedValue)
  return shallowMount(AirdropClaimPage)
}

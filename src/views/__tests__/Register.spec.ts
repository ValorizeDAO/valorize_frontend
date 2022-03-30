import { shallowMount, mount, DOMWrapper, VueWrapper } from "@vue/test-utils"
import Register from "@/views/Register.vue"
import api from "../../services/api"
import auth from "../../services/authentication"
import { createRouterMock, injectRouterMock } from "vue-router-mock"

jest.mock("vuex", () => ({
  useStore: jest.fn(() => ({
    commit: jest.fn(),
  })),
}))
jest.mock("../../services/api", () => ({
  get: jest.fn().mockResolvedValue({
    status: 404,
    json: jest.fn(),
  }),
}))
jest.mock("../../services/authentication", () => ({
  register: jest.fn(),
}))
describe("<Register \\>", () => {
  const router = createRouterMock()
  beforeEach(() => {
    injectRouterMock(router)
  })
  it("mounts", () => {
    const wrapper = shallowMount(Register)
    expect(wrapper).toBeTruthy()
  })
  describe("Submit Button", () => {
    it("should be disabled when all fields are empty", () => {
      const wrapper = shallowMount(Register)
      const submitButton = wrapper.find(
        "input[type='submit']",
      ) as DOMWrapper<HTMLInputElement>
      expect(submitButton.element.disabled).toBe(true)
    })

    it("should need all fields filled to be enabled", async () => {
      const wrapper = mount(Register)
      await wrapper.find("input[name='username']").setValue("fakename")
      await wrapper.find("input[name='email']").setValue("test@test.com")
      await wrapper.find("input[name='password']").setValue("test")
      await wrapper.find("input[name='password2']").setValue("test")
      await new Promise((resolve) => setTimeout(resolve, 500))
      await wrapper.vm.$nextTick()
      const submitButton = wrapper.find(
        "input#submit-registration",
      ) as DOMWrapper<HTMLInputElement>
      expect(submitButton.element.disabled).toBe(false)
    })
    it("should be disabled if one password is unlike the other", async () => {
      const wrapper = shallowMount(Register)
      await wrapper.find("input[name='username']").setValue("fakename")
      await wrapper.find("input[name='email']").setValue("test@test.com")
      await wrapper.find("input[name='password']").setValue("test")
      await wrapper.find("input[name='password2']").setValue("test2")
      const submitButton = wrapper.find(
        "input[type='submit']",
      ) as DOMWrapper<HTMLInputElement>
      expect(submitButton.element.disabled).toBe(true)
    })
  })
  describe("Username", () => {
    it("should check the backend whether a username is available", async () => {
      const wrapper = shallowMount(Register)
      await wrapper.find("input[name='username']").setValue("fakename")
      await new Promise((resolve) => setTimeout(resolve, 500))
      await wrapper.vm.$nextTick()
      expect(api.get).toHaveBeenCalledWith("/api/v0/users/fakename")
    })
    it("should throw an error if the username is not available", async () => {
      api.get = jest.fn().mockResolvedValue({
        status: 200,
        json: jest.fn(),
      })
      const wrapper = shallowMount(Register)
      let errorText = (await wrapper.find(
        ".text-red-700",
      )) as DOMWrapper<HTMLDivElement>
      expect(errorText.exists()).toBeFalsy()
      await wrapper.find("input[name='username']").setValue("fakename")
      await new Promise((resolve) => setTimeout(resolve, 500))
      await wrapper.vm.$nextTick()
      errorText = (await wrapper.find(
        ".text-red-700",
      )) as DOMWrapper<HTMLDivElement>
      expect(errorText.exists()).toBeTruthy()
      expect(errorText.text()).toBe("* fakename is not available")
    })
  })
  describe("Register Success", () => {
    beforeAll(() => {
      auth.register = jest.fn().mockResolvedValue({
        status: 201,
        json: jest.fn(),
      })
    })
    it("should redirect user to dashboard if registration is successful", async () => {
      const wrapper = shallowMount(Register) as VueWrapper<any> & { router: any }
      await wrapper.find("input[name='username']").setValue("fakename")
      await wrapper.find("input[name='email']").setValue("test@test.com")
      await wrapper.find("input[name='password']").setValue("test")
      await wrapper.find("input[name='password2']").setValue("test")
      await new Promise((resolve) => setTimeout(resolve, 500))
      await wrapper.vm.$nextTick()
      await wrapper.find("form").trigger("submit")
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(auth.register).toHaveBeenCalledWith("fakename", "test@test.com", "test")
      expect(wrapper.router.push).toHaveBeenCalledWith(expect.objectContaining({ path: "/dashboard" }))
    })
  })
})

import { shallowMount } from "@vue/test-utils"
import EditProfilePage from "@/views/EditProfilePage.vue"

jest.mock("../../services/authentication", () => ({}))

jest.mock("vue-router", () => ({
  useRoute: jest.fn(() => ({
    query: { redirectUri: "a", registerAddress: "b" },
  })),
  useRouter: jest.fn(() => ({ name: "Home" })),
}))
const testUser = {
  id: 1,
  name: "test",
  email: "test@email.com",
  about: "test",
  isAlphaUser: false,
}
const mockStore = {
  state: {
    authUser: {
      user: testUser,
    },
  },
  getters: {
    "authUser/hasToken": jest.fn(() => true),
    "authUser/user": jest.fn(() => testUser),
    "authUser/profileImage": jest.fn(() => "fake_url.jpg"),
  },
}
jest.mock("vuex", () => ({
  useStore: jest.fn(() => mockStore),
}))

describe("<EditProfilePage \\>", () => {
  it("mounts", () => {
    const wrapper = shallowMount(EditProfilePage, {
      global: {
        stubs: ["router-link"],
      },
    })
    expect(wrapper).toBeTruthy()
  })
})

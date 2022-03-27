import { shallowMount } from "@vue/test-utils"
import EditProfilePage from "@/views/EditProfilePage.vue"

jest.mock("../../services/authentication", () => ({}));

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
};
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
};
jest.mock("vuex", () => ({
  useStore: jest.fn(() => mockStore),
}));

describe("<EditProfilePage \\>", () => {
  it("mounts", () => {
    const wrapper = shallowMount(EditProfilePage, {
      global: {
        stubs: ["router-link"],
      },
    })
    expect(wrapper).toBeTruthy()
  })
  describe("Alpha Users", () => {
    it("Does not let a non-alpha user deploy a token", () => {
      const wrapper = shallowMount(EditProfilePage, {
        global: {
          stubs: ["router-link"],
        },
      })
      const tokenLaunchComponent = wrapper.find("create-token-stub")
      expect(tokenLaunchComponent.exists()).toBe(false)
    })
    it("lets alpha users see the <CreateToken \\> component", () => {
      mockStore.state.authUser.user.isAlphaUser = true;
      jest.mock("vuex", () => ({
        useStore: jest.fn(() => mockStore),
      }));
      const wrapper = shallowMount(EditProfilePage, {
        global: {
          stubs: ["router-link"],
        },
      });
      const tokenLaunchComponent = wrapper.find("create-token-stub");
      expect(tokenLaunchComponent.exists()).toBe(true);
    });
  });
});

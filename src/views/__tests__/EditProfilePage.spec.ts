import { shallowMount, DOMWrapper } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import EditProfilePage from "@/views/EditProfilePage.vue";
import Vue, { useStore } from "vuex";
import auth from "../../services/authentication";

jest.mock("../../services/authentication", () => ({}));
const mockedAuth = mocked(auth, true);
const mockStore = {
  state: {
    authUser: {
      user: {
        id: 1,
        name: "test",
        email: "test@email.com",
        about: "test",
        isAlphaUser: false,
      },
    },
  },
  getters: {
    "authUser/hasToken": jest.fn(() => true),
    "authUser/profileImage": jest.fn(() => "fake_url.jpg"),
  },
};
jest.mock("vuex", () => ({
  useStore: jest.fn(() => mockStore),
}));

describe("<EditProfilePage \\>", () => {
  it("mounts", () => {
    const wrapper = shallowMount(EditProfilePage);
    expect(wrapper).toBeTruthy();
  });
  it("renders as expected", () => {
    const wrapper = shallowMount(EditProfilePage);
    expect(wrapper.html()).toMatchSnapshot();
  });
  describe("Alpha Users", () => {
    it("Does not let a non-alpha user deploy a token", () => {
      const wrapper = shallowMount(EditProfilePage);
      const tokenLaunchComponent = wrapper.find("create-token-stub");
      expect(tokenLaunchComponent.exists()).toBe(false);
    });
    it("lets alpha users see the <CreateToken \\> component", () => {
      mockStore.state.authUser.user.isAlphaUser = true;
      jest.mock("vuex", () => ({
        useStore: jest.fn(() => mockStore),
      }));
      const wrapper = shallowMount(EditProfilePage);
      console.log(wrapper.html());
      const tokenLaunchComponent = wrapper.find("create-token-stub");
      expect(tokenLaunchComponent.exists()).toBe(true);
    });
  });
});

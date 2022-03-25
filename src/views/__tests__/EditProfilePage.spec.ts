import { shallowMount, DOMWrapper } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import EditProfilePage from "@/views/EditProfilePage.vue";
import Vuex, { Store, createStore } from "vuex";
import auth from "../../services/authentication";

jest.mock("../../services/authentication", () => ({}));
const mockedAuth = mocked(auth, true);
jest.mock("vuex", () => ({
  useStore: jest.fn(() => ({
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
  })),
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
});

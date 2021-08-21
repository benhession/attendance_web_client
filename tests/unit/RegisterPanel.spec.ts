import RegisterPanel from "@/components/RegisterPanel.vue";
import { mount } from "@vue/test-utils";
import MockObjects from "./MockObjects";
import ToastService from "primevue/toastservice";
import { store, key } from "@/store";
import Panel from "primevue/panel";
import Button from "primevue/button";
import { GlobalMountOptions } from "@vue/test-utils/dist/types";

const globalMountOptions: GlobalMountOptions = {
  plugins: [ToastService, [store, key]],
  components: {
    Panel,
    Button,
  },
};

describe("RegisterPanel.vue", () => {
  it("loads", () => {
    const wrapper = mount(RegisterPanel, {
      global: globalMountOptions,
      props: {
        selectedClass: MockObjects.completedClass,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("has QR Code Button if class is upcoming", () => {
    const wrapper = mount(RegisterPanel, {
      global: globalMountOptions,
      props: {
        selectedClass: MockObjects.upcomingClass,
      },
    });

    const qrButton = wrapper.findComponent(Button);

    expect(qrButton.exists()).toBe(true);
    expect(qrButton.html().includes("QR Code")).toBe(true);
  });

  it("has QR Code Button if class is in-progress", () => {
    const wrapper = mount(RegisterPanel, {
      global: globalMountOptions,
      props: {
        selectedClass: MockObjects.inProgressClass,
      },
    });

    const qrButton = wrapper.findComponent(Button);

    expect(qrButton.exists()).toBe(true);
    expect(qrButton.html().includes("QR Code")).toBe(true);
  });

  it("does not have QR Code Button if class is completed", () => {
    const wrapper = mount(RegisterPanel, {
      global: globalMountOptions,
      props: {
        selectedClass: MockObjects.completedClass,
      },
    });

    const qrButton = wrapper.findComponent(Button);

    expect(qrButton.html().includes("QR Code")).toBe(false);
  });
});

import { GlobalMountOptions } from "@vue/test-utils/dist/types";
import ToastService from "primevue/toastservice";
import { key, store } from "@/store";
import Panel from "primevue/panel";
import Button from "primevue/button";
import { mount } from "@vue/test-utils";
import MockObjects, { absentStudent, attendedStudent } from "./MockObjects";
import RegisterItem from "@/components/RegisterItem.vue";

const globalMountOptions: GlobalMountOptions = {
  plugins: [ToastService, [store, key]],
  components: {
    Panel,
    Button,
  },
};

describe("RegisterItem.vue", () => {
  it("loads", () => {
    const wrapper = mount(RegisterItem, {
      global: globalMountOptions,
      props: {
        student: attendedStudent,
        theClass: MockObjects.completedClass,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("has absent class if student has not attended", () => {
    const wrapper = mount(RegisterItem, {
      global: globalMountOptions,
      props: {
        student: absentStudent,
        theClass: MockObjects.completedClass,
      },
    });

    expect(wrapper.find(".absent").exists()).toBe(true);
    expect(wrapper.find(".attended").exists()).toBe(false);
  });

  it("has attended class if student has attended", () => {
    const wrapper = mount(RegisterItem, {
      global: globalMountOptions,
      props: {
        student: attendedStudent,
        theClass: MockObjects.completedClass,
      },
    });

    expect(wrapper.find(".absent").exists()).toBe(false);
    expect(wrapper.find(".attended").exists()).toBe(true);
  });

  it("doesn't have mark attended button if class is upcoming", () => {
    const wrapper = mount(RegisterItem, {
      global: globalMountOptions,
      props: {
        student: absentStudent,
        theClass: MockObjects.upcomingClass,
      },
    });

    const attendButton = wrapper.findComponent(Button);

    expect(attendButton.exists()).toBe(false);
  });

  it("has mark attended button if class is in-progress", () => {
    const wrapper = mount(RegisterItem, {
      global: globalMountOptions,
      props: {
        student: absentStudent,
        theClass: MockObjects.inProgressClass,
      },
    });

    const attendButton = wrapper.findComponent(Button);

    expect(attendButton.exists()).toBe(true);
    expect(attendButton.text()).toEqual("Mark attended");
  });

  it("has mark attended button if class is completed", () => {
    const wrapper = mount(RegisterItem, {
      global: globalMountOptions,
      props: {
        student: absentStudent,
        theClass: MockObjects.completedClass,
      },
    });

    const attendButton = wrapper.findComponent(Button);

    expect(attendButton.exists()).toBe(true);
    expect(attendButton.text()).toEqual("Mark attended");
  });

  it("doesn't have button if student has attended in-progress class", () => {
    const wrapper = mount(RegisterItem, {
      global: globalMountOptions,
      props: {
        student: attendedStudent,
        theClass: MockObjects.inProgressClass,
      },
    });

    const attendButton = wrapper.findComponent(Button);

    expect(attendButton.exists()).toBe(false);
  });

  it("doesn't have button if student has attended completed class", () => {
    const wrapper = mount(RegisterItem, {
      global: globalMountOptions,
      props: {
        student: attendedStudent,
        theClass: MockObjects.completedClass,
      },
    });

    const attendButton = wrapper.findComponent(Button);

    expect(attendButton.exists()).toBe(false);
  });
});

<template>
  <header class="p--d-flex p-jc-between">
    <div>Attend - Web Client</div>
    <Button
      label="Logout"
      class="p-button-raised p-button-text p-button-secondary"
      id="logoutButton"
      @click="logout"
    />
  </header>

  <div class="p-d-flex">
    <PanelMenu :model="menuContent" class="p-md-3" />
    <RegisterPanel v-if="classIsSelected" :selected-class="selectedClass" />
    <Panel v-else header="The register will be displayed here" class="p-md-9">
      <p>Select a class from the menu</p>
    </Panel>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { computed, defineComponent, Ref, ref } from "vue";
import { ACTIONS, useStore } from "@/store";
import { PanelMenuFormatter, MenuItem } from "@/utilities/PanelMenuFormatter";
import { TutorClass } from "@/model/TutorClass";
import RegisterPanel from "@/components/RegisterPanel.vue";

export default defineComponent({
  name: "Classes",
  components: { RegisterPanel },
  setup() {
    const router = useRouter();
    const store = useStore();

    // reactive references
    const selectedClass: Ref<TutorClass | undefined> = ref<TutorClass>();
    const menuContent = ref<MenuItem[]>();

    // computed properties
    const classIsSelected = computed<boolean>(() => {
      return selectedClass.value !== undefined;
    });

    // functions
    function logout(): void {
      store
        .dispatch(ACTIONS.LOG_OUT)
        .then(() => router.push({ path: "/" }))
        .catch((e) => console.log(e));
    }

    // logic on load
    if (store.getters.getLoggedIn === false) {
      router.push({ path: "/" });
    } else {
      store
        .dispatch(ACTIONS.FETCH_TUTOR_MODULES)
        .then(() => {
          menuContent.value = PanelMenuFormatter.formatByYear(
            store.getters.getModules,
            selectedClass
          );
        })
        .catch((e) => {
          console.log(e);
          store.dispatch(ACTIONS.LOG_OUT).then(() => {
            router.push({ path: "/" });
          });
        });
    }

    return { logout, menuContent, classIsSelected, selectedClass };
  },
});
</script>

<style scoped>
#logoutButton {
  background-color: var(--teal-50);
}
</style>

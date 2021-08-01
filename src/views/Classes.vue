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
    <Panel header="Selected Class title" class="p-md-9">
      <p>{{ panelContent }}</p>
    </Panel>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { ACTIONS, useStore } from "@/store";
import { PanelMenuFormatter, MenuItem } from "@/utilities/PanelMenuFormatter";

export default {
  name: "Classes",
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const router = useRouter();
    const store = useStore();

    // reactive references
    const panelContent = ref<string>("Empty");
    const menuContent = ref<MenuItem[]>();

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
            panelContent
          );
        })
        .catch((e) => {
          console.log(e);
          store.dispatch(ACTIONS.LOG_OUT).then(() => {
            router.push({ path: "/" });
          });
        });
    }

    return { logout, menuContent, panelContent };
  },
};
</script>

<style>
#logoutButton {
  background-color: var(--teal-50);
}
</style>

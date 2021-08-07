<template>
  <header class="p--d-flex p-jc-between">
    <toast />
    <div>Attend - Web Client</div>
    <Button
      label="Logout"
      class="p-button-raised p-button-text p-button-secondary"
      id="logoutButton"
      @click="logout"
    />
  </header>

  <div class="p-d-flex">
    <div class="p-sm-3 p-d-flex p-flex-column">
      <Fieldset legend="Next Class" class="info p-mb-2">
        <p v-if="upcomingClasses.length === 0">No Upcoming Classes</p>
        <a v-else @click="nextClassClicked">
          {{ upcomingClasses[0].moduleCode }}: {{ upcomingClasses[0].name }}
        </a>
      </Fieldset>
      <PanelMenu :model="menuContent" class="p-mb-2" />
    </div>
    <RegisterPanel v-if="classIsSelected" :selected-class="selectedClass" />
    <Panel v-else header="The register will be displayed here" class="p-md-9">
      <p>Please select a class from the menu</p>
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
import { TutorModule } from "@/model/TutorModule";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

export default defineComponent({
  name: "Classes",
  components: { RegisterPanel, Toast },
  setup() {
    const router = useRouter();
    const store = useStore();
    const toast = useToast();

    // reactive references
    const selectedClass: Ref<TutorClass | undefined> = ref<TutorClass>();
    const menuContent = ref<MenuItem[]>();

    // computed properties
    const modules = computed<TutorModule[]>(() => {
      return store.getters.getModules;
    });

    const classIsSelected = computed<boolean>(() => {
      return selectedClass.value !== undefined;
    });

    const upcomingClasses = computed<TutorClass[]>(() => {
      let tutorClasses = new Array<TutorClass>();

      modules.value.forEach((mod) => {
        mod.classes.forEach((tutorClass) => {
          tutorClasses.push(tutorClass);
        });
      });

      return tutorClasses
        .filter((tutorClass) => {
          return tutorClass.isCurrentOrUpcoming();
        })
        .sort((a, b) => {
          return a.startTime > b.startTime ? 1 : -1;
        });
    });

    // functions
    function logout(): void {
      store
        .dispatch(ACTIONS.LOG_OUT)
        .then(() => router.push({ path: "/" }))
        .catch((e) => console.error(e));
    }

    function nextClassClicked() {
      selectedClass.value = upcomingClasses.value[0];
      store.dispatch(ACTIONS.FETCH_TUTOR_MODULES).catch((e: Error) => {
        console.error("Error fetching tutors modules: ", e.message);

        if (e.message === "UPDATE_ACCESS_TOKEN: refresh token is expired") {
          store.dispatch(ACTIONS.LOG_OUT).then(() => {
            router.push({ path: "/" });
          });
        } else {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Unable to get updated class list: ".concat(e.message),
            life: 3000,
          });
        }
      });
    }

    // logic on load
    if (store.getters.getLoggedIn === false) {
      router.push({ path: "/" });
    } else {
      store
        .dispatch(ACTIONS.FETCH_TUTOR_MODULES)
        .then(() => {
          menuContent.value = PanelMenuFormatter.formatByYear(
            modules.value,
            selectedClass
          );
        })
        .catch((e) => {
          console.error(e);
          store.dispatch(ACTIONS.LOG_OUT).then(() => {
            router.push({ path: "/" });
          });
        });
    }

    return {
      logout,
      menuContent,
      classIsSelected,
      selectedClass,
      upcomingClasses,
      nextClassClicked,
    };
  },
});
</script>

<style scoped>
#logoutButton {
  background-color: var(--teal-50);
}

a {
  text-decoration: underline;
  cursor: pointer;
}
</style>

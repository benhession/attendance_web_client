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
    <PanelMenu :model="items" class="p-md-2" />
    <Panel header="Selected Class title" class="p-md-10">
      <p>{{ panelContent }}</p>
    </Panel>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  name: "Classes",
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const router = useRouter();

    function logout(): void {
      router.push({ path: "/" });
    }

    const panelContent = ref<string>("Empty");
    const items = ref([
      {
        key: "0",
        label: "File",
        icon: "pi pi-fw pi-file",
        items: [
          {
            key: "0_0",
            label: "New",
            icon: "pi pi-fw pi-plus",
            items: [
              {
                key: "0_0_0",
                label: "Bookmark",
                icon: "pi pi-fw pi-bookmark",
                command: () => {
                  panelContent.value = "Bookmark clicked";
                },
              },
              {
                key: "0_0_1",
                label: "Video",
                icon: "pi pi-fw pi-video",
                command: () => {
                  panelContent.value = "Video clicked";
                },
              },
            ],
          },
          {
            key: "0_1",
            label: "Delete",
            icon: "pi pi-fw pi-trash",
          },
          {
            key: "0_2",
            label: "Export",
            icon: "pi pi-fw pi-external-link",
          },
        ],
      },
      {
        key: "1",
        label: "Edit",
        icon: "pi pi-fw pi-pencil",
        items: [
          {
            key: "1_0",
            label: "Left",
            icon: "pi pi-fw pi-align-left",
          },
          {
            key: "1_1",
            label: "Right",
            icon: "pi pi-fw pi-align-right",
          },
          {
            key: "1_2",
            label: "Center",
            icon: "pi pi-fw pi-align-center",
          },
          {
            key: "1_3",
            label: "Justify",
            icon: "pi pi-fw pi-align-justify",
          },
        ],
      },
      {
        key: "2",
        label: "Users",
        icon: "pi pi-fw pi-user",
        items: [
          {
            key: "2_0",
            label: "New",
            icon: "pi pi-fw pi-user-plus",
          },
          {
            key: "2_1",
            label: "Delete",
            icon: "pi pi-fw pi-user-minus",
          },
          {
            key: "2_2",
            label: "Search",
            icon: "pi pi-fw pi-users",
            items: [
              {
                key: "2_2_0",
                label: "Filter",
                icon: "pi pi-fw pi-filter",
                items: [
                  {
                    key: "2_2_0_0",
                    label: "Print",
                    icon: "pi pi-fw pi-print",
                  },
                ],
              },
              {
                key: "2_2_1",
                icon: "pi pi-fw pi-bars",
                label: "List",
              },
            ],
          },
        ],
      },
      {
        key: "3",
        label: "Events",
        icon: "pi pi-fw pi-calendar",
        items: [
          {
            key: "3_0",
            label: "Edit",
            icon: "pi pi-fw pi-pencil",
            items: [
              {
                key: "3_0_0",
                label: "Save",
                icon: "pi pi-fw pi-calendar-plus",
              },
              {
                key: "3_0_0",
                label: "Delete",
                icon: "pi pi-fw pi-calendar-minus",
              },
            ],
          },
          {
            key: "3_1",
            label: "Archieve",
            icon: "pi pi-fw pi-calendar-times",
            items: [
              {
                key: "3_1_0",
                label: "Remove",
                icon: "pi pi-fw pi-calendar-minus",
              },
            ],
          },
        ],
      },
    ]);
    return { logout, items, panelContent };
  },
};
</script>

<style>
#logoutButton {
  background-color: var(--teal-50);
}
</style>

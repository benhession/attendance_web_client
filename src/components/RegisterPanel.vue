<template>
  <Panel :header="classTitle" class="p-sm-9">
    <div class="p-d-flex p-jc-between">
      <div class="p-d-flex p-d-inline">
        <p><b>Date:</b> {{ selectedClass.startTime.format("MMMM Do YYYY") }}</p>
        <p class="p-ml-2">|</p>
        <p class="p-ml-2">
          <b>Time:</b> {{ selectedClass.startTime.format("h:mm a") }}
        </p>
      </div>
      <div>
        <p
          v-if="selectedClass.classStatus === ClassStatus.UPCOMING"
          style="color: var(--upcoming-colour)"
        >
          <b>Upcoming</b>
        </p>
        <p
          v-else-if="selectedClass.classStatus === ClassStatus.IN_PROGRESS"
          style="color: var(--in-progress-colour)"
        >
          <b>In Progress</b>
        </p>
        <p
          v-else-if="selectedClass.classStatus === ClassStatus.PREVIOUS"
          style="color: var(--previous-colour)"
        >
          <b>Complete</b>
        </p>
      </div>
    </div>

    <p class="p-mt-0 p-mb-5"><b>Location: </b>{{ theClass.location }}</p>
    <div
      v-if="selectedClass.classStatus !== ClassStatus.PREVIOUS"
      class="p-d-flex"
    >
      <Button class="p-mb-3" @click="fetchQrImageB64">QR Code </Button>
    </div>

    <div v-if="selectedClass.classStatus !== ClassStatus.UPCOMING">
      <p class="p-mb-1">Key:</p>
      <div class="p-d-flex p-align-center">
        <div class="legend-colour-box attended-box p-mr-2" />
        <p class="p-mr-2">Attended</p>
        <div class="legend-colour-box absent-box p-mr-2" />
        <p class="p-mr-2">Absent</p>
      </div>
    </div>

    <p>Students:</p>

    <RegisterItem
      v-for="student in theStudents"
      :key="student.studentId"
      :student="student"
      :theClass="theClass"
    />
  </Panel>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, watch } from "vue";
import { ClassStatus, TutorClass } from "@/model/TutorClass";
import RegisterItem from "@/components/RegisterItem.vue";
import qrImageService from "@/services/qrImageService";
import { useRouter } from "vue-router";
import { ACTIONS, useStore } from "@/store";
import { useToast } from "primevue/usetoast";
import { SSEListenerService } from "@/services/SSEListenerService";
import { TutorModule } from "@/model/TutorModule";

export default defineComponent({
  name: "RegisterPanel",
  components: { RegisterItem },
  props: {
    selectedClass: {
      name: "selectedClass",
      type: TutorClass,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();
    const toast = useToast();

    // props
    const theProps = toRefs(props);
    const theSelectedClass = ref(theProps.selectedClass);

    // computed properties
    const classTitle = computed<string>(() => {
      return theClass.value.moduleCode.concat(": ").concat(theClass.value.name);
    });

    const theStudents = computed(() => {
      return theClass.value.students;
    });

    const modules = computed<TutorModule[]>(() => {
      return store.getters.getModules;
    });

    const theClass = computed(() => {
      let c = theSelectedClass.value;

      modules.value.forEach((module) => {
        module.classes.forEach((aClass) => {
          c = aClass.classId === c.classId ? aClass : c;
        });
      });

      return c;
    });

    // functions
    function fetchQrImageB64() {
      qrImageService
        .fetchQRImage(theClass.value.classId)
        .then((imgString) => {
          const routeData = router.resolve({
            name: "QrWindow",
            query: {
              qrImageB64: imgString,
              classTitle: classTitle.value,
            },
          });

          window.open(routeData.href, "_blank");
        })
        .catch((e: Error) => {
          toast.add({
            severity: "error",
            summary: "Error getting QR code",
            detail: e.message,
            life: 3000,
          });
          store.dispatch(ACTIONS.FETCH_TUTOR_MODULES).catch((e: Error) => {
            console.error("Error fetching tutors modules: ", e.message);

            if (e.message === "UPDATE_ACCESS_TOKEN: refresh token is expired") {
              store.dispatch(ACTIONS.LOG_OUT).then(() => {
                router.push({ path: "/" });
              });
            } else {
              toast.add({
                severity: "error",
                summary: "Error getting updated class list",
                detail: e.message,
                life: 3000,
              });
            }
          });
        });
    }

    watch(theClass, () => {
      if (theClass.value.classStatus === ClassStatus.IN_PROGRESS) {
        if (theClass.value.classId !== SSEListenerService.getIdOfConnection()) {
          store
            .dispatch(ACTIONS.UPDATE_ACCESS_TOKEN)
            .then(() => {
              SSEListenerService.startConnection(
                store.getters.getAccessToken,
                theClass.value.classId
              );
            })
            .catch((e) => {
              if (
                e.message === "UPDATE_ACCESS_TOKEN: refresh token is expired"
              ) {
                store.dispatch(ACTIONS.LOG_OUT).then(() => {
                  router.push({ path: "/" });
                });
              } else {
                toast.add({
                  severity: "error",
                  summary: "Error getting updated class list",
                  detail: e.message,
                  life: 3000,
                });
              }
            });
        }
      } else {
        SSEListenerService.closeConnection();
      }
    });

    return {
      theClass,
      classTitle,
      theStudents,
      ClassStatus,
      fetchQrImageB64,
    };
  },
});
</script>

<style scoped>
.legend-colour-box {
  height: 40px;
  width: 40px;
  margin-left: 1em;
}

.attended-box {
  background-color: var(--attended-colour);
  border-radius: 4px;
}

.absent-box {
  background-color: var(--absent-colour);
  border-radius: 4px;
}
</style>

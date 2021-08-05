<template>
  <Panel :header="classTitle" class="p-md-9">
    <p class="error-info">{{ errorMessage }}</p>

    <div class="p-d-flex p-jc-between">
      <div class="p-d-flex p-d-inline">
        <p><b>Date:</b> {{ theClass.startTime.format("MMMM Do YYYY") }}</p>
        <p class="p-ml-2">|</p>
        <p class="p-ml-2">
          <b>Time:</b> {{ theClass.startTime.format("h:mm a") }}
        </p>
      </div>
      <div>
        <p
          v-if="theClass.classStatus === ClassStatus.UPCOMING"
          style="color: var(--upcoming-colour)"
        >
          <b>Upcoming</b>
        </p>
        <p
          v-else-if="theClass.classStatus === ClassStatus.IN_PROGRESS"
          style="color: var(--in-progress-colour)"
        >
          <b>In Progress</b>
        </p>
        <p
          v-else-if="theClass.classStatus === ClassStatus.PREVIOUS"
          style="color: var(--previous-colour)"
        >
          <b>Complete</b>
        </p>
      </div>
    </div>

    <p class="p-mt-0 p-mb-5"><b>Location: </b>{{ theClass.location }}</p>
    <div v-if="theClass.classStatus !== ClassStatus.PREVIOUS" class="p-d-flex">
      <Button class="p-mb-3" @click="fetchQrImageB64">QR Code </Button>
    </div>

    <div v-if="theClass.classStatus !== ClassStatus.UPCOMING">
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
import { TutorClass, ClassStatus } from "@/model/TutorClass";
import RegisterItem from "@/components/RegisterItem.vue";
import qrImageService from "@/services/qrImageService";
import { useRouter } from "vue-router";
import { ACTIONS, useStore } from "@/store";

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

    // props
    const theProps = toRefs(props);
    const theClass = ref(theProps.selectedClass);

    // reactive references
    const errorMessage = ref<string>("");

    // computed properties
    const classTitle = computed<string>(() => {
      return theClass.value.moduleCode.concat(": ").concat(theClass.value.name);
    });

    const theStudents = computed(() => {
      return theClass.value.students;
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
          errorMessage.value = "Error getting QR code: ".concat(e.message);
          store.dispatch(ACTIONS.FETCH_TUTOR_MODULES);
        });

      // watchers
      watch(theClass, () => {
        errorMessage.value = "";
      });
    }

    return {
      theClass,
      classTitle,
      theStudents,
      ClassStatus,
      errorMessage,
      fetchQrImageB64,
    };
  },
});
</script>

<style scoped>
.error-info {
  color: var(--error-colour);
  text-align: center;
}

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

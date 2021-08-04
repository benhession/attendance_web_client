<template>
  <div v-if="theClass.classStatus === ClassStatus.UPCOMING">
    <div class="upcoming p-d-flex p-jc-between p-align-center">
      <p>{{ fullName }} ({{ student.studentId }})</p>
    </div>
  </div>
  <div v-else>
    <div v-if="student.attended" class="attended p-d-flex p-align-center">
      <p>{{ fullName }} ({{ student.studentId }})</p>
    </div>
    <div v-else class="absent p-d-flex p-jc-between p-align-center">
      <p>{{ fullName }} ({{ student.studentId }})</p>
      <Button class="p-button-outlined" id="attendButton">
        Mark attended
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { StudentAttended } from "@/model/StudentAttended";
import { computed, defineComponent, ref, toRefs } from "vue";
import { ClassStatus, TutorClass } from "@/model/TutorClass";

export default defineComponent({
  name: "RegisterItem",
  props: {
    student: {
      name: "student",
      type: StudentAttended,
      required: true,
    },
    theClass: {
      name: "theClass",
      type: TutorClass,
      required: true,
    },
  },
  setup(props) {
    // props
    const theProps = toRefs(props);
    const theStudent = ref(theProps.student);

    // computed properties
    const fullName = computed<string>(() => {
      return theStudent.value.forename
        .concat(" ")
        .concat(theStudent.value.surname);
    });

    return { fullName, ClassStatus };
  },
});
</script>

<style scoped>
.attended {
  background-color: var(--attended-colour);
  padding: 0.5em;
  height: 3em;
  margin: 1em 0 0 1em;
  border-radius: 4px;
}

.absent {
  color: whitesmoke;
  background-color: var(--absent-colour);
  padding: 0.5em;
  height: 3em;
  margin: 1em 0 0 1em;
  border-radius: 4px;
}

.upcoming {
  padding: 0.5em;
  height: 3em;
  margin: 1em 0 0 1em;
  border: 1px solid lightgray;
  border-radius: 4px;
}

#attendButton {
  color: whitesmoke;
}
</style>

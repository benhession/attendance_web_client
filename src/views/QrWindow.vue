<template>
  <div v-if="qrImageB64 !== ''" class="p-d-flex p-jc-center">
    <div class="p-flex-column">
      <h3 class="p-text-center title">{{ classTitle }}</h3>
      <img :src="qrImageB64" alt="QR Image" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "QrWindow",
  props: {
    qrImageB64: {
      name: "qrImageB64",
      type: String,
      default: "",
    },
    classTitle: {
      name: "classTitle",
      type: String,
      default: "",
    },
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    // logic on load
    if (store.getters.getLoggedIn === false) {
      router.push({ path: "/" });
    }

    return {};
  },
});
</script>

<style scoped>
.title {
  position: absolute;
  width: 100%;
  left: 50%;
  transform: translate(-50%);
  text-align: center;
}

img {
  width: 100%;
  margin-top: 3em;
}
</style>

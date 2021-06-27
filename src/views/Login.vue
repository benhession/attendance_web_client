<template>
  <header class="p--d-flex p-jc-between">
    <div>Attend - Web Client</div>
    <div>v0.1</div>
  </header>

  <div class="p-fluid">
    <div class="p-sm-offset-0 p-sm-12 p-md-offset-3 p-md-6 p-col">
      <div class="p-field">
        <label for="username">Username</label>
        <InputText id="username" type="text" class="p-shadow-1" />
      </div>
      <div class="p-field">
        <label for="password">Password</label>
        <password
          id="password"
          class="p-shadow-1"
          :feedback="false"
          toggleMask
        />
      </div>
      <div class="p-md-offset-9 p-md-3" style="padding: 0">
        <Button
          id="submitButton"
          label="Submit"
          @click="router.push({ name: 'Classes' })"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";

export default {
  name: "Login",
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const router = useRouter();
    return { router };
  },
};
</script>
<style>
header {
  width: 100%;
  height: 10vh;
  background-color: var(--blue-200);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  margin-bottom: 5vh;
}

#submitButton {
  margin-top: 2vh;
}
</style>

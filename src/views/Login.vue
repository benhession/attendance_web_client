<template>
  <header class="p--d-flex p-jc-between">
    <div>Attend - Web Client</div>
    <div>v0.1</div>
  </header>

  <div class="p-fluid">
    <div class="p-sm-offset-0 p-sm-12 p-md-offset-3 p-md-6 p-col">
      <div class="p-field">
        <label for="username">Username</label>
        <InputText
          id="username"
          type="text"
          class="p-shadow-1"
          v-model="username"
        />
      </div>
      <div class="p-field">
        <label for="password">Password</label>
        <password
          id="password"
          class="p-shadow-1"
          :feedback="false"
          toggleMask
          v-model="password"
        />
      </div>
      <div class="p-md-offset-9 p-md-3" style="padding: 0">
        <Button id="submitButton" label="Submit" @click="login" />
      </div>
      <p v-if="errorMessage !== ''" id="infoMessage">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { ACTIONS, useStore } from "@/store";
import { ref } from "vue";

export default {
  name: "Login",
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    // constants
    const router = useRouter();
    const store = useStore();

    // reactive references
    const username = ref("");
    const password = ref("");
    const errorMessage = ref("");

    // functions
    function login() {
      store
        .dispatch(ACTIONS.LOG_IN, [username.value, password.value])
        .then(() => router.push({ name: "Classes" }))
        .catch((e) => {
          if (e.message === "Request failed with status code 401") {
            errorMessage.value = "Please enter a valid username and password.";
          } else if (e.message === "User does not have tutor privileges") {
            errorMessage.value =
              "You must have tutor privileges to use this application.";
          } else {
            console.error(e);
          }
        });
    }

    // on load logic
    if (store.getters.getLoggedIn) {
      router.push({ name: "Classes" });
    }

    return { router, username, password, login, errorMessage };
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

#infoMessage {
  width: 100%;
  color: red;
  text-align: center;
}
</style>

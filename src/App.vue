<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

header {
  width: 100%;
  height: 3em;
  background-color: var(--blue-200);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  margin-bottom: 2vh;
  border-radius: 2px;
}

:root {
  --attended-colour: #85ffa7;
  --absent-colour: #eb6363;
  --upcoming-colour: #40199e;
  --in-progress-colour: #eb740f;
  --previous-colour: #1a9e19;
  --error-colour: red;
}
</style>

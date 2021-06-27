import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PrimeVue from "primevue/config";

import "primeflex/primeflex.css"; // flex
import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import PanelMenu from "primevue/panelmenu";
import Panel from "primevue/panel";

const app = createApp(App);
app.use(store).use(router);
app.use(PrimeVue);

app.component("Button", Button);
app.component("InputText", InputText);
app.component("Password", Password);
app.component("PanelMenu", PanelMenu);
app.component("Panel", Panel);

app.mount("#app");

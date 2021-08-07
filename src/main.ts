import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store, key } from "@/store";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";

import "primeflex/primeflex.css"; // flex
import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import PanelMenu from "primevue/panelmenu";
import Panel from "primevue/panel";
import Fieldset from "primevue/fieldset";

const app = createApp(App);
app.use(store, key);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);

app.component("Button", Button);
app.component("InputText", InputText);
app.component("Password", Password);
app.component("PanelMenu", PanelMenu);
app.component("Panel", Panel);
app.component("Fieldset", Fieldset);
app.component("qrcode");

app.mount("#app");

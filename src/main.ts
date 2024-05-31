import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './request'
import "@/fonts/Gadugi.ttf";
import VueApexCharts from "vue3-apexcharts";

createApp(App).use(store).use(router).use(VueApexCharts).mount('#app')
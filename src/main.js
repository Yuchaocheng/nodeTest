import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "@/assets/font/iconfont.css"
import axios from "./http/axios"

Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$axios = axios


console.log(router, 22);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
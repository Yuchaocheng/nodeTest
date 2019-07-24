import axios from "axios"
import router from "../router"
import store from "@/store.js"
let instance = axios.create({
    baseURL: "/self",
    timeout: 5000
})

// 添加请求拦截器
instance.interceptors.request.use(config => {
        // 在发送请求之前做些什么
        return config
    }, error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    })
    // 添加响应拦截器
instance.interceptors.response.use(response => {
    // 对响应数据做点什么
    return response;
}, error => {
    if (error.response) {
        if (error.response.status === 402) {
            store.commit('setPermission', false)
            router.replace('/');
            /* 登出的时候刷新一下，让路由变为默认的静态路由 */
            router.go(0)
        }
    }
    // 对响应错误做点什么
    return Promise.reject(error);
});
export default instance
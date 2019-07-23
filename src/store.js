import Vue from 'vue'
import Vuex from 'vuex'
import { staticRouter, router } from "./router"
import axios from "./http/axios"
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        permission: false,
        routers: staticRouter,
        addRouters: []
    },
    mutations: {
        /* 设置路由 */
        setRouters(state, addRouter) {
            state.addRouters = addRouter
            state.routers = staticRouter.concat(addRouter)
        },
        /* 设置权限 */
        setPermission(state, flag) {
            state.permission = flag
        }
    },
    actions: {
        /* 验证权限 */
        checkPermission({ commit }) {
            return new Promise((resolve, reject) => {
                axios.get('/check').then(res => {
                    if (res.data.ok) {
                        commit('setPermission', true)
                        resolve()
                    } else {
                        commit('setPermission', false)
                        reject()
                    }
                }).catch(error => {
                    commit('setPermission', false)
                    reject()
                })
            })
        }
    }
})
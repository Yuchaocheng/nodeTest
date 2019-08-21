import Vue from "vue"
import Router from "vue-router"
import store from "./store"


Vue.use(Router)

//静态路由
const staticRouter = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ( /* webpackChunkName: "login" */ '@com/layout/login.vue'),
    },
    {
        path: '/404',
        component: () =>
            import ('@com/layout/404.vue'),
    },
]

//动态添加的路由
const asyncRouter = [{
        path: '/node',
        name: 'node',
        component: () =>
            import ( /* webpackChunkName: "node" */ '@/views/node/index.vue')
    },
    {
        path: '/chatroom',
        name: 'chatroom',
        component: () =>
            import ( /* webpackChunkName: "chatroom" */ '@/views/node/chatroom.vue')
    },
    {
        path: '/index',
        name: 'HelloWorld',
        component: () =>
            import ( /* webpackChunkName: "HelloWorld" */ '@com/HelloWorld.vue'),
    },
    {
        path: '/newVue',
        name: 'newVue',
        component: () =>
            import ( /* webpackChunkName: "newVue" */ '@/views/newVue/index.vue')

    },
    {
        path: '/about',
        name: 'about',
        component: () =>
            import ( /* webpackChunkName: "about" */ '@/views/newVue/About.vue')

    },
    {
        path: '/interview',
        name: 'interview',
        component: () =>
            import ( /* webpackChunkName: "about" */ '@/views/interview/index.vue')

    },
    { path: '*', redirect: '/404' }
]
let router = new Router({
    routes: staticRouter
});


/* 不用登陆就能进入的路由 */
let whiteList = staticRouter.map(item => item.path)

/* 导航守卫next后面的代码会继续执行,next方法带参数要非常小心，它会重复进入导航守卫。所以要有判断条件使其再进入时不执行上一次的next代码 */
router.beforeEach((to, from, next) => {
    /* 有权限 */
    if (store.state.permission) {
        /* 登录成功了，则添加动态路由，已经add过路由就不在继续add，否则会死循环 */
        if (store.state.addRouters.length === 0) {
            store.commit('setRouters', asyncRouter)
            router.addRoutes(asyncRouter);
            /* addRouters后需必须写next(),否则无法保证立即跳转的路由已经add到Router中*/
            next(to.path)
        } else {
            if (to.path === '/login' || to.path === '/') {
                next(from.path)
            } else {
                next()
            }
        }
    }
    /* 没有权限 */
    else {
        if (whiteList.includes(to.path)) {
            next()
        } else {
            /* 页面刷新 */
            store.dispatch('checkPermission').then(() => {
                next(to.path)
            }).catch(() => {
                next('/')
            })
        }
    }
})
export { staticRouter, asyncRouter }
export default router
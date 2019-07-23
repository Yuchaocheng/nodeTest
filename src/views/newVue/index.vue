<template>
  <div class="new-vue" id="new-vue">
    <!-- 自定义事件名因为在html标签里不区分大小写，所以推荐使用匈牙利命名-->
    <div class="test-com">
      <div class="title">组件实例</div>
      <el-button type="primary" size="mini" @click="visible=!visible">Toggle Component</el-button>
      <!-- 如果不加keep-alive，v-if过后的就会全部初始化。keep-alive是只针对vue组件的，对普通dom无效 -->
      <!-- max表示这个keepalive下的最多缓存数量，一旦超过，第一个缓存组件会被销毁 -->
      <keep-alive include="testComponent" :max='10'>
        <test-component @emit-far="reseiveSon" v-if="visible" key="1" ref="TestComponent">
          设置的slot的内容
          <!-- 不写slot就是v-slot:default,v-slot只能写在template上 -->
          <template class="foot2" #foot>
            foot
          </template>
          <!-- slotProps拿到了父组件中的user -->
          <template #last="{ user }">
            {{ user.firstName}}
          </template>
        </test-component>
      </keep-alive>
      通过$root访问根实例message:{{rootNmae}}
    </div>
    <div class="transTest">
      <div class="title">transtion实例</div>
      <div id="demo">
        <button v-on:click="transShow = !transShow">
          Toggle
        </button>
        <transition name="fade">
          <p v-if="transShow">hello</p>
        </transition>
      </div>
    </div>
    <div class="mixinTest">
      <div class="title">mixin实例</div>
      <p>1数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。</p>
      <p>2同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。</p>
      <p>3值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。</p>

    </div>
    <div class="renderTest">
      <div class="title">render函数实例</div>
      <render-test :level="1" key='1'>level1</render-test>
    </div>
  </div>
</template>

<script>
import TestComponent from "@com/TestComponent"
import RenderTest from "@com/RenderTest"
export default {
  components: {
    TestComponent,
    RenderTest
  },
  props: {
    test1: {
      type: String,
      default: ""
    }
  },
  provide() {
    return {
      grandInfo: this.grandInfo
    }
  },
  data() {
    return {
      test: '1',
      transShow: false,
      visible: true,
      grandInfo: {
        name: "孙子信息"
      },
    }
  },
  computed: {
    rootNmae() {
      /* $parent效果类似$root,只是去访问父组件，但是通常这样写并不好，它会让你在维护的时候找不到父组件data变量变化是在哪里引起的 */
      /* 可以访问到根实例，但是根实例为什么不是app.vue？ */
      return this.$root.message
    },
    sonName() {
      /* 访问子组件实例，在计算属性中写$refs并不好，因为它不是响应式的，要写在比如一个点击事件里，这样就没有问题 */
      return this.$refs.TestComponent
    },

  },
  /* 我在项目中应用的不多， 组件数据层还未初始化，这个vue组件内的data、computed、props等内的属性都为undefined，只能进行一些纯js的操作，比方说清一下localstorage */
  beforeCreate() {
  },
  /* data数据初始化, 数据层面的操作（比方说请求接口）可以进行了 */
  created() {
    this.test = '3'
  },
  /* render函数首次被调用， 编译模板，把data里面的数据和模板生成html。在实际的项目中，它和created暴露给开发者的时间点差别不大，因为Vue自己编译的模板还挂载到真实dom，所以和created一样，有关dom的操作还不能进行。*/
  beforeMount() {
  },
  /* mounted要把Vue编译好的html挂载到相应的dom中进行渲染，要操作dom的方法可在这里进行，比方说最常见的是echarts和地图实例的初始化，必须要有dom作为容器，这些对象的实例化就可放在mounted里 */
  mounted() {
    let a = document.getElementById('new-vue')
    console.log(a);
  },
  /* 全data的watch，虚拟DOM重新渲染和打补丁之前 */
  beforeUpdate() {
  },
  /* 虚拟DOM重新渲染之后 */
  updated() {
  },
  /* beforeDestroy (销毁前） 在实例销毁之前调用。实例仍然完全可用,像setTimeOut等需要随着dom一起销毁的对象实例等就要在这里销毁 */
  beforeUpdate() { },
  /* 在实例销毁之后调用,用到的场景很少*/
  destroyed() {
    this.test = '100'
  },
  methods: {
    reseiveSon() {
    },
    /* 强制刷新 */
    forceUpdata() {
      this.$forceUpdate()
    },
  },
}
</script>

<style scoped>
.new-vue {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.title {
  font: 20px;
  font-weight: bold;
  padding: 20px 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<template>
  <div class="test-component">
    <el-button size="small" type="primary" @click="emitFar">自定义事件</el-button>
    <el-input type="textarea" v-model="textArea" size="small"></el-input>
    <div class="showHtml" v-html="textArea"></div>
    <!-- 如果该组件被调用时没有写这个slot，就会展示默认的slot信息 -->
    <slot>默认的slot内容</slot>
    <div class="foot">
      <slot name="foot"></slot>
    </div>
    <div class="last">
      <slot v-bind:user="user" name="last">
        {{ user.lastName }}
      </slot>
    </div>
    <grandson></grandson>
  </div>
</template>

<script>
const Grandson = {
  template: '<li>{{grandInfo.name}}</li>',
  inject: ['grandInfo']
}
export default {
  name: 'testComponent',
  components: {
    Grandson
  },
  /* keep-alive的时候用name来做筛选 */
  data() {
    return {
      textArea: '<span>哈哈</span>',
      user: {
        lastName: "chancheng",
        firstName: "yu"
      },
    }
  },
  mounted() {
  },
  methods: {
    emitFar() {
      this.$emit('emit-far')
    }
  }
}
</script>

<style>
</style>

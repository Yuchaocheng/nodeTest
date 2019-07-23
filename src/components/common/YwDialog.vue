<template>
  <div class="yw-dialog" :style="dialogStyle" v-if="visible" v-drag="canDrag">
    <header>
      <span class="title">{{title}}</span>
      <span class="control-icon">
        <i class="iconfont iconexit" v-if="isFullScreen" @click="backFullScreen"></i>
        <i class="iconfont iconquanping" v-else @click="toFullScreen"></i>
        <i class="iconfont iconguanbi" @click="close"></i>
      </span>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
import vDrag from "@/directives/vDrag.js"
export default {
  directives: {
    drag: vDrag
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    fullScreen: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: '50%'
    },
    height: {
      type: [String, Number],
      default: 'auto'
    },
    left: {
      type: [String, Number],
      default: '20%'
    },
    top: {
      type: [String, Number],
      default: '20%'
    },
    visible: {
      type: Boolean,
      default: false
    },
    canDrag: {
      type: Boolean,
      default: true
    }
  },
  data(vm) {
    return {
      viewWidth: vm.width,
      viewHeight: vm.height,
      viewLeft: vm.left,
      viewTop: vm.top,
      isFullScreen: vm.fullScreen
    }
  },
  computed: {
    dialogStyle() {
      return {
        width: /\D/.test(this.viewWidth) ? this.viewWidth : this.viewWidth + "px",
        height: /\D/.test(this.viewHeight) ? this.viewHeight : this.viewHeight + "px",
        left: /\D/.test(this.viewLeft) ? this.viewLeft : this.viewLeft + "px",
        top: /\D/.test(this.viewTop) ? this.viewTop : this.viewTop + "px",
      }
    },
  },
  watch: {
    isFullScreen: {
      handler(val) {
        if (val) {
          this.viewLeft = 0;
          this.viewTop = 0
          this.viewWidth = "100%"
          this.viewHeight = "100%"
        } else {
          this.viewWidth = this.width
          this.viewHeight = this.height
          this.viewLeft = this.left
          this.viewTop = this.top
        }
      },
      immediate: true
    }
  },
  methods: {
    toFullScreen() {
      this.isFullScreen = true
    },
    backFullScreen() {
      this.isFullScreen = false
    },
    close() {
      this.$emit('close')
      this.$emit('update:visible', false)
    }
  },
}
</script>

<style lang="scss" scoped>
.yw-dialog {
  background: white;
  z-index: 1000;
  position: fixed;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
  > header {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed #9e9e9e;
    padding: 0 20px;
    box-sizing: border-box;
    .title {
      font-size: 14px;
      font-weight: bold;
    }
    .control-icon {
      > i {
        margin-left: 10px;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  > main {
    padding: 10px 20px;
    flex: 1 auto;
  }
  > footer {
    width: 100%;
    height: 40px;
    border-top: 1px dashed #9e9e9e;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>

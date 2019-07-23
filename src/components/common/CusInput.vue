<template>
  <div class="cusInput">
    <div class="customitem" @mouseenter="mouseenter" @mouseleave="mouseleave">
      <input :value="value" @input="InputEvent($event.target.value)" type="text" class="customInput"
        @focus="focus" @blur="blur" :style="style" ref="input">
      <span class="closeSpan" @click="clear" v-show="closeVisible">
        <i class="el-icon-circle-close"></i>
      </span>
      <div class="searchBox" @click="searchClick">
        <i class="el-icon-search"></i>
      </div>
      <div class="input-error" :class="{errorMsg:errorVisible}">
        {{errorMsg}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    check: {
      type: Function,
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      closeVisible: false,
      errorVisible: false,
      errorMsg: "",
      state: {
        focus: false,
        enter: false,
        validate: null
      }
    };
  },
  methods: {
    searchClick() {
      this.$emit('search')
    },
    checkPass() {
      /* 如果不传check函数    默认输出null 即无验证 */
      if (this.check(this.value) === null) return;
      /* 返回true则验证通过 */
      if (this.check(this.value) === true) {
        this.errorVisible = false;
        this.state.validate = true;
      } else {
        this.errorMsg = this.check(this.value);
        this.errorVisible = true;
        this.state.validate = false;
      }
    },
    mouseleave() {
      this.state.enter = false;
      if (!this.state.focus) this.closeVisible = false;
    },
    InputEvent(value) {
      this.closeVisible = value ? true : false;
      this.$emit("input", value);
    },
    blur() {
      this.checkPass();
      if (this.state.enter) return;
      this.state.focus = false;
      this.closeVisible = false;
    },
    focus() {
      this.state.focus = true;
    },
    mouseenter() {
      this.state.enter = true;
      if (this.value) this.closeVisible = true;
    },
    clear() {
      this.$emit("clear");
      this.closeVisible = false;
      this.$refs.input.focus();
    }
  },
  created() { },
  mounted() { },
  computed: {
    style() {
      let output = {};
      if (this.state.validate === null) {
        if (this.state.focus) output.borderColor = "#409eff";
      } else {
        output.borderColor = this.state.validate ? "#67c23a" : "#f56c6c";
      }
      return output;
    }
  },
  watch: {
    value(val) { }
  }
};
</script>

<style lang='scss'>
.cusInput{
  width: 100%;
}
.customitem {
  margin: 0;
  padding: 0;
  padding-top: 4px;
  display: flex;
  align-items: center;
  position: relative;
  flex-wrap: wrap;

  .customInput {
    font-size: 14px;
    color: #606266;
    flex: 1 1 80%;
    position: relative;
    height: 32px;
    line-height: 32px;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    border-right: none;
    outline: 0;
    padding: 0 15px;
    border-radius: 4px 0 0 4px;
    transition: border-color 0.3s;
  }

  .customInput:focus {
    border-color: #409eff;
  }

  .customInput:hover {
    border-color: #c0c4cc;
  }

  .closeSpan {
    padding: 6px;
    display: inline-block;
    line-height: 1;
    position: absolute;
    right: 36px;
    top: 8px;

    // transform: translateX(-28px);
    .el-icon-circle-close {
      opacity: 0.4;
    }

    .el-icon-circle-close:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }

  .searchBox {
    flex: 0 0 32px;
    height: 32px;
    line-height: 32px;
    background: #409eff;
    color: white;
    display: flex;
    justify-content: center;
    border-radius: 0px 4px 4px 0;

    .el-icon-search {
      line-height: inherit;
    }
  }

  .searchBox:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  .input-error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
    overflow: hidden;
    transform: scaleY(0);
    transition: all 0.3s;
    opacity: 0;
    transform-origin: 0 0;
  }

  .input-error.errorMsg {
    transform: scaleY(1);
    opacity: 1;
  }
}
</style>   

<template>
  <div class="viewArea" id="viewArea" @mousewheel="zoom">
    <div class="divider-line" :style="dividerStyle">
      <span class="line-width">{{ dividerText }}</span>
    </div>
    <button @click="initPosition">测试</button>
    <div class="container" id="container">
      <div class="testbox" id="testbox" @mouseover="enterBox" @mousedown="moveBox">
        <i v-for="(item, index) in iList" :key="index" class="selectedI" :class="item.name"
          v-show="isSelected">
          <span class="circle" v-for="subItem in item.spans" :key="subItem.type"
            :class="subItem.className" @mouseenter.stop="enterCircle(subItem.type)"
            @mouseleave.stop="leaveCircle"
            @mousedown.stop="stretchBox($event, subItem.type)"></span>
        </i>
        <div class="canvas" @mouseenter.stop="enterCanvas">
          伸缩框1
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dividerText: "",
      dividerWidth: 0,
      widthText: "",
      heightText: "",
      dividerHeight: 0,
      eventObj: {},
      iList: [
        {
          name: "topI",
          spans: [
            { type: "leftTop", className: "topCircle" },
            { type: "top", className: "centerCircle" },
            { type: "rightTop", className: "rightCircle" }
          ]
        },
        {
          name: "rightI",
          spans: [
            { type: "right", className: "middleCircle" },
            { type: "rightBottom", className: "bottomCircle" }
          ]
        },
        {
          name: "bottomI",
          spans: [
            { type: "bottom", className: "centerCircle" },
            { type: "leftBottom", className: "bottomCircle" }
          ]
        },
        {
          name: "leftI",
          spans: [{ type: "left", className: "middleCircle" }]
        }
      ],
      isSelected: false,
      posData: [
        {
          position: "leftTop",
          cursor: "nw-resize"
        },
        {
          position: "leftBottom",
          cursor: "sw-resize"
        },
        {
          position: "left",
          cursor: "w-resize"
        },
        {
          position: "rightTop",
          cursor: "ne-resize"
        },
        {
          position: "rightBottom",
          cursor: "se-resize"
        },
        {
          position: "right",
          cursor: "e-resize"
        },
        {
          position: "top",
          cursor: "n-resize"
        },
        {
          position: "bottom",
          cursor: "s-resize"
        },
        {
          position: "center",
          cursor: "move"
        }
      ]
    };
  },
  computed: {
    el() {
      return document.getElementById("testbox");
    },
    dividerStyle() {
      // this.$nextTick(() => {
      let container = document.getElementById("container"); //容器元素
      let containerLeft = 0
      let containerTop = 0
      if (container) {
        containerLeft = container.offsetLeft
        containerTop = container.offsetTop
      }
      return {
        width: this.dividerWidth + containerLeft + "px",
        height: this.dividerHeight + containerTop + "px"
      };
      // })
    }
  },
  watch: {
    dividerHeight(val) {
      let scale = this.getScale();
      let height = Number((val / scale).toFixed(0))
      let width = Number((this.dividerWidth / scale).toFixed(0))
      this.dividerText = `${width},${height}`;
    },
    dividerWidth(val) {
      let scale = this.getScale();
      let width = Number((val / scale).toFixed(0))
      let height = Number((this.dividerHeight / scale).toFixed(0))
      this.dividerText = `${width},${height}`;
    }
  },
  mounted() {
    this.initPosition()
    document.addEventListener("click", this.clickSelet);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.clickSelet);
  },
  methods: {
    initPosition() {
      let scale = this.getScale()
      let viewArea = document.getElementById("viewArea"); //可视区元素
      let el = document.getElementById('testbox')
      let scrollLeft = viewArea.scrollLeft
      let scrollTop = viewArea.scrollTop
      el.style.left = (viewArea.offsetWidth / 2 + scrollLeft - el.offsetWidth / 2) + 'px'
      el.style.top = (viewArea.offsetHeight / 2 + scrollTop - el.offsetHeight / 2) + 'px'
      this.dividerWidth = this.el.offsetLeft * scale;
      this.dividerHeight = this.el.offsetTop * scale;
    },
    //获取当前scale倍数
    getScale() {
      let container = document.getElementById("container"); //容器元素
      let transform = "";
      if (!container) {
        return 1
      }
      if (getComputedStyle(container).transform !== "none") {
        transform = getComputedStyle(container).transform.replace(
          /[^\d.,]/g,
          ""
        );
      } else {
        transform = "1, 0, 0, 1, 0, 0";
      }
      return Number(transform.split(",")[0]);
    },
    //缩放容器
    zoom(e) {
      let event = e || window.event;
      if (event.altKey === false) return;
      var delta = 0;
      if (event.wheelDelta) {
        //IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
        delta = event.wheelDelta / 120;
        //因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
        if (window.opera) delta = -delta;
      } else if (event.detail) {
        //FF浏览器使用的是detail,其值为“正负3”
        delta = -event.detail / 3;
      }
      if (delta) {
        this.handleZoom(delta, event);
      }
    },
    handleZoom(delta, e) {
      let el = document.getElementById("container"); //容器元素
      el.style.transformOrigin = `${0}px ${0}px`;
      let scale = this.getScale();
      if (delta > 0) {
        //向上滚动
        if (scale <= 4) {
          //设最大值
          scale += 0.02;
        }
        el.style.transform = `scale(${scale})`;
      } else {
        //向下滚动
        if (scale >= 0.2) {
          //设最小值
          scale -= 0.02;
        }
        el.style.transform = `scale(${scale})`;
      }
      this.dividerWidth = this.el.offsetLeft * scale;
      this.dividerHeight = this.el.offsetTop * scale;
    },
    enterCircle(pos) {
      for (const item of this.posData) {
        if (item.position === pos) {
          this.el.style.cursor = item.cursor;
          break;
        }
      }
    },
    leaveCircle() {
      this.el.style.cursor = "default";
    },
    /* 拉伸box */
    stretchBox(e, pos) {
      let event = e || window.event;
      this.eventObj = event;
      let el = this.el; //本元素
      let viewArea = document.getElementById("viewArea"); //可视区元素
      let width = el.offsetWidth;
      let height = el.offsetHeight;
      let left = el.offsetLeft;
      let top = el.offsetTop;
      let scale = this.getScale();
      if (pos === "left") {
        let right = left + width;
        document.onmousemove = event => {
          let moveX = (this.eventObj.clientX - event.clientX) / scale;
          el.style.left = left - moveX + "px";
          el.style.width = width + moveX + "px";
          this.dividerWidth = el.offsetLeft * scale;
        };
      }
      if (pos === "right") {
        document.onmousemove = event => {
          let moveX = (this.eventObj.clientX - event.clientX) / scale;
          el.style.width = width - moveX + "px";
        };
      }
      if (pos === "top") {
        let bottom = top + height;
        document.onmousemove = event => {
          let moveY = (this.eventObj.clientY - event.clientY) / scale;
          el.style.top = top - moveY + "px";
          el.style.height = height + moveY + "px";
          this.dividerHeight = el.offsetTop * scale;
        };
      }
      if (pos === "bottom") {
        document.onmousemove = event => {
          let moveY = (this.eventObj.clientY - event.clientY) / scale;
          el.style.height = height - moveY + "px";
        };
      }
      if (pos === "rightBottom") {
        document.onmousemove = event => {
          let moveX = (this.eventObj.clientX - event.clientX) / scale;
          let moveY = (this.eventObj.clientY - event.clientY) / scale;
          el.style.width = width - moveX + "px";
          el.style.height = height - moveY + "px";
        };
      }
      if (pos === "leftBottom") {
        let right = left + width;
        document.onmousemove = event => {
          let moveX = (this.eventObj.clientX - event.clientX) / scale;
          let moveY = (this.eventObj.clientY - event.clientY) / scale;
          el.style.left = left - moveX + "px";
          el.style.width = width + moveX + "px";
          el.style.height = height - moveY + "px";
          this.dividerWidth = el.offsetLeft * scale;
        };
      }
      if (pos === "rightTop") {
        let bottom = top + height;
        document.onmousemove = event => {
          let moveX = (this.eventObj.clientX - event.clientX) / scale;
          let moveY = (this.eventObj.clientY - event.clientY) / scale;
          el.style.top = top - moveY + "px";
          el.style.height = height + moveY + "px";
          el.style.width = width - moveX + "px";
          this.dividerHeight = el.offsetTop * scale;
        };
      }
      if (pos === "leftTop") {
        let right = left + width;
        let bottom = top + height;
        document.onmousemove = event => {
          let moveX = (this.eventObj.clientX - event.clientX) / scale;
          let moveY = (this.eventObj.clientY - event.clientY) / scale;
          el.style.top = top - moveY + "px";
          el.style.height = height + moveY + "px";
          el.style.left = left - moveX + "px";
          el.style.width = width + moveX + "px";
          this.dividerWidth = el.offsetLeft * scale;
          this.dividerHeight = el.offsetTop * scale;
        };
      }
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    enterBox(event) {
      this.el.style.cursor = "move";
    },
    leaveBox(event) {
      let el = event.target;
      el.style.cursor = "default";
    },
    moveBox(e) {
      if (this.isSelected === false) return;
      let event = e || window.event;
      this.eventObj = event;
      let el = this.el;
      let width = el.offsetWidth;
      let height = el.offsetHeight;
      let left = el.offsetLeft;
      let top = el.offsetTop;
      let scale = this.getScale();
      document.onmousemove = event => {
        let moveX = (this.eventObj.clientX - event.clientX) / scale;
        let moveY = (this.eventObj.clientY - event.clientY) / scale;
        el.style.left = left - moveX + "px";
        el.style.top = top - moveY + "px";
        this.dividerWidth = this.el.offsetLeft * scale;
        this.dividerHeight = this.el.offsetTop * scale;
        let canLeft = 200
        let canTop = 200
        let canOffset = 5
        if (this.el.offsetLeft <= canLeft + canOffset && this.el.offsetLeft >= canLeft - canOffset) {
          el.style.left = canLeft + 'px'
          this.dividerWidth = this.el.offsetLeft * scale;
        }
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    enterCanvas(e) { },
    clickSelet(event) {
      let el = this.el;
      let target = event.target;
      if (el.contains(target)) {
        this.isSelected = true;
      } else {
        this.isSelected = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.viewArea {
  overflow: auto;
  margin: 0 auto;
  padding: 0;
  position: relative;
  height: 700px;
  width: 1200px;
  border: 1px dashed #ccc;
  .container {
    margin: 20px 0 0 20px;
    background: #eee;
    // border: 1px solid black;
    width: 1920px;
    height: 1080px;
    position: relative;
    .testbox {
      box-sizing: border-box;
      left: 200px;
      top: 100px;
      position: absolute;
      width: 400px;
      height: 200px;
      border: 1px solid black;
      .canvas {
        height: 100%;
      }
      .selectedI {
        display: block;
        background: black;
        position: absolute;
        .circle {
          position: absolute;
          display: block;
          width: 8px;
          height: 8px;
          z-index: 100;
          border-radius: 50%;
          background: steelblue;
          &.centerCircle {
            left: 50%;
            transform: translate(-50%, -50%);
          }
          &.bottomCircle {
            bottom: 0;
            transform: translate(-50%, 50%);
          }
          &.middleCircle {
            top: 50%;
            transform: translate(-50%, -50%);
          }
          &.topCircle {
            transform: translate(-50%, -50%);
          }
          &.rightCircle {
            right: 0;
            transform: translate(50%, -50%);
          }
          &::before {
            content: "";
            position: absolute;
            top: -10px;
            bottom: -10px;
            right: -10px;
            left: -10px;
          }
        }
        &.topI {
          top: 0;
          left: 0;
          height: 1px;
          width: 100%;
        }
        &.bottomI {
          bottom: 0;
          left: 0;
          height: 1px;
          width: 100%;
        }
        &.leftI {
          top: 0;
          left: 0;
          height: 100%;
          width: 1px;
        }
        &.rightI {
          top: 0;
          right: 0;
          height: 100%;
          width: 1px;
        }
      }
    }
  }
  .divider-line {
    z-index: 100;
    position: absolute;
    left: 0;
    right: 0;
    border: 1px dotted #ccc;
    border-left: none;
    border-top: none;
    .line-width {
      position: absolute;
      right: 2px;
      bottom: 2px;
      font-weight: bold;
    }
  }
}
</style>


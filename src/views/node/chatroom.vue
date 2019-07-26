<template>
  <div class="chatroom">
    <div class="roombox">
      <div class="show_message">
        <ul class="msgList">
          <li v-for="(item,index) in msgList" :key="index" :class="item.type">
            <span class="nickname">{{item.nickname}}</span>
            <p class="msg_content">
              <i class="iconfont iconqipao-left" v-if="item.type==='userSelf'"></i>
              <i class="iconfont iconqipao-right" v-else></i>
              {{item.message}}
            </p>
          </li>
        </ul>
      </div>
      <div class="send_message">
        <textarea name="send_message" id="send_message_input" v-model="message"
          @keyup.enter.ctrl="sendMessage"></textarea>
        <div class="send_button" @click="sendMessage">发送</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: '',
      msgList: []
    }
  },
  created() {
    this.websocket()
  },
  mounted() {
  },
  methods: {
    websocket() {
      let token = this.getCookie(document.cookie, 'token')
      this.socket = new WebSocket(`ws://172.16.70.72:3100?token=${token}`);
      //收到消息处理
      this.socket.onmessage = res => {
        console.log(res.data, '接收');
        this.receiveMsg(res.data)
      }
      //监听连接关闭情况
      this.socket.onclose = function (e) {
        console.log("Connection closed");
      }
    },
    //接收消息
    receiveMsg(data) {
      this.msgList.push(JSON.parse(data))
      //让滚动条始终保持在最底部
      this.$nextTick(() => {
        let box = document.querySelector('.show_message')
        box.scrollTop = box.scrollHeight
      })
    },
    //发送消息
    sendMessage() {
      if (this.socket.readyState === WebSocket.OPEN && this.message) {
        this.socket.send(this.message);
        this.message = ""
      }
    },
    //获取token值，如果cookie设置了httpOnly,websocket的身份验证只能在http身份验证时返回用户信息，并保存起来，这里简化一下。
    getCookie(cookie, name) {
      let cookieArr = cookie.split(';');
      let reuslt = cookieArr.map(item => {
        let arr = item.split('=')
        return {
          name: arr[0].trim(), //去除两边的空格，确实会出现空格的情况，虽然我set的时候并没有空格
          value: arr[1],
        }
      });
      let cookieObj = reuslt.find(item => item.name === name)
      if (typeof cookieObj === 'undefined') {
        return false
      } else {
        return cookieObj.value
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.chatroom {
  width: 100%;
  height: 100%;
  display: flex;
  .roombox {
    margin: auto;
    width: 50%;
    height: 70%;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    .show_message {
      overflow: auto;
      height: 66%;
      border-bottom: 1px solid #ccc;
      padding: 4px 10px;
      box-sizing: border-box;
      .msgList {
        li {
          margin-bottom: 10px;
          display: flex;
          .nickname {
            padding: 6px;
            margin-right: 10px;
          }
          .msg_content {
            position: relative;
            padding: 10px;
            background: #eee;
            border-radius: 4px;
            max-width: 90%;
            .iconfont {
              position: absolute;
              left: 0;
              font-size: 20px;
              color: #eee;
              transform: translate(-62%, -10%);
            }
          }
          &.userSelf {
            flex-direction: row-reverse;
            .nickname {
              margin-left: 10px;
            }
            .msg_content {
              background: #5fb878;
              color: white;
              .iconfont {
                color: #5fb878;
                left: unset;
                right: 0;
                transform: translate(62%, -20%);
              }
            }
          }
        }
      }
    }
    .send_message {
      flex: 1 auto;
      display: flex;
      flex-direction: column;
      #send_message_input {
        border: none;
        outline: none;
        width: 100%;
        flex: 1 auto;
        font-size: 16px;
        padding: 4px 10px;
        box-sizing: border-box;
        overflow: auto;
      }
      .send_button {
        font-size: 16px;
        background: rgb(64, 158, 255);
        line-height: 2;
        text-align: center;
        color: white;
        &:hover {
          cursor: pointer;
          background: rgba(64, 158, 255, 0.9);
        }
        &:active {
          background: #3a8ee6;
        }
      }
    }
  }
}
</style>
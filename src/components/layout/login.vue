<template>
  <div class="login">
    <el-form :model="form">
      <el-row class="login-system">
        登录系统
      </el-row>
      <el-row>
        <el-col :span="22" :push="1">
          <el-form-item prop="name">
            <el-input placeholder="账号" v-model="form.name" ref="inputOne"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :push="1">
          <el-form-item prop="password">
            <el-input placeholder="密码" v-model="form.password" type="password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" class="textcol loginbutton collink" :push="1" @click.native="signIn">
          <span>登录</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :push="1" class="textcol noaccount">
          <router-link to="/register">没有账号？去注册</router-link>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import "@/plugin/base64"
export default {
  data() {
    return {
      form: {
        name: '',
        password: '',
        encodePswd: '',
      },
    }
  },
  mounted() {
  },
  methods: {
    /* 设置cookie */
    setCookie(name, value, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toGMTString();
      document.cookie = name + "=" + value + "; " + expires;
    },
    /* 登录 */
    signIn() {
      /* 使用base64进行一定的加密 */
      let password = Base64.encode(this.form.password);
      this.$axios.post('/login', { name: this.form.name, password }).then(res => {
        if (res.data.ok) {
          this.setCookie('token', res.data.token)
          this.$store.commit('setPermission', true)
          this.$router.replace('/node')
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        throw new Error(err)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.login {
  .login-system {
    font-size: 36px;
    text-align: center;
    margin-bottom: 10px;
  }
  background-image: url("../../assets/images/login.jpg");
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-form {
    padding: 20px 0 10px;
    border-radius: 8px;
    background: white;
    margin-top: -200px;
    width: 40%;
    .el-row {
      .loginbutton {
        border-radius: 4px;
        background: rgb(95, 176, 255);
        color: white;
        font-size: 16px;
        &:hover {
          cursor: pointer;
          background: rgba(95, 176, 255, 0.9);
        }
      }
      .noaccount a {
        text-decoration: none;
        color: rgb(95, 176, 255);
        &:hover {
          font-weight: bold;
        }
      }
      .textcol {
        line-height: 40px;
        text-align: center;
      }
    }
  }
}
</style>

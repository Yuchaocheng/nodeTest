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
    <!-- 注册弹框 -->
    <yw-dialog :visible.sync="dialogVisible" title="新增学生信息" width="400" left="5%" top="16%">
      <el-form :model="registerForm" ref="form" label-width="80px">
        <el-form-item label="用户名：" prop='name'>
          <el-input size="small" v-model="registerForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop='password'>
          <el-input size="small" v-model="registerForm.password"></el-input>
        </el-form-item>
        <el-form-item label="头像：" prop='headImg'>
          <el-input size="small" v-model="registerForm.headImg"></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop='telphone'>
          <el-input size="small" v-model="registerForm.telphone"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-foot">
          <el-button size="mini" type="primary" @click='save' v-if="!isReadonly">确定</el-button>
          <el-button size="mini" @click="close">取消</el-button>
        </div>
      </template>
    </yw-dialog>
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
      },
      registerForm: {
        name: '',
        password: '',
        headImg: '',
        telphone: '',
      }
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

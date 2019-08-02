<template>
  <div class="login">
    <!-- 登录 -->
    <div class="login-box">
      <el-row class="login-system">
        {{state==='login'?'登录':'注册'}}
      </el-row>
      <el-form :model="form" class="login-form" v-if="state==='login'">
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
            <span @click="state='register'">没有账号？注册</span>
          </el-col>
        </el-row>
      </el-form>
      <el-form :model="registerForm" ref="form" class="register-form" label-width="80px" v-else>
        <el-form-item label="用户名：" prop='name'>
          <el-input size="small" v-model="registerForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop='password'>
          <el-input size="small" v-model="registerForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="头像：" prop='headImg' id="fileUpload" class="headImg-item">
          <input type="file" accept="image/*" @change='filechange'>
          <img :src="fileInfo.url" alt="" v-if="fileInfo.url" width="100px">
        </el-form-item>
        <el-row type="flex" justify="end">
          <el-button type="primary" size="small" @click="register">确定</el-button>
          <el-button size="small" @click="state='login'">返回</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- 注册 -->
  </div>
</template>

<script>
import "@/plugin/base64"
export default {
  data() {
    return {
      state: 'login',
      fileInfo: {
        file: null,
        url: ''
      },
      form: {
        name: '',
        password: '',
      },
      registerForm: {
        name: '',
        password: '',
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
          this.$store.commit('getUserInfo', res.data.data)
          this.$router.replace('/node')
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        throw new Error(err)
      })
    },
    filechange(e) {
      /* 更改图片时需要释放上一次创建的url对象 */
      if (this.headImgUrl) {
        URL.revokeObjectURL(this.headImgUrl)
      }
      this.fileInfo.file = e.target.files[0];
      let imgSize = this.fileInfo.file.size / 1024;
      //实现预览功能
      this.fileInfo.url = window.URL.createObjectURL(this.fileInfo.file)
      if (imgSize > 200) {
        //这里可以自己做限制图片大小,也可以不做
        this.$message.warning('请上传不超过200KB的图片')
        return
      }
    },
    /* 注册 */
    register() {
      const fd = new FormData();
      fd.append('file', this.fileInfo.file);
      fd.append('name', this.registerForm.name);
      fd.append('password', this.registerForm.password);
      /* Content-Type'为'multipart/form-data'提交的数据被放在了Request Payload中，后端不好拿 */
      /* 设置请求的Content-type字段为application/x-www-form-urlencoded */
      this.$axios.post('/users/addUser', fd, { 'Content-Type': 'multipart/form-data' }).then(res => {
        if (res.data.ok) {
          this.$message.success('注册成功')
          this.state = 'login'
        }
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
  .login-box {
    padding: 20px 0 10px;
    border-radius: 8px;
    background: white;
    margin-top: -200px;
    width: 40%;
    .login-form {
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
        .noaccount > span {
          text-decoration: none;
          color: rgb(95, 176, 255);
          &:hover {
            cursor: pointer;
            font-weight: bold;
          }
        }
        .textcol {
          line-height: 40px;
          text-align: center;
        }
      }
    }
    .register-form {
      padding: 0 20px;
      .headImg-item {
        input {
          display: block;
          padding: 10px 0;
        }
      }
    }
  }
}
</style>

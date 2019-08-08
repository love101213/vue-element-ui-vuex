<template>
<div class="login_container">
     <div class="pic1"></div>
     <div class="pic2"></div>
     <div class="pic3"></div>
     <div class="pic4"></div>
  <div class="login_box">
    <div class="avater_box">
      <img src="../assets/lixian.png" alt="">
    </div>
    <el-form :model="loginForm" ref="form" class="login_form" :rules="loginFormRules">
  <el-form-item prop="username">
    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
  </el-form-item>
  <el-form-item prop="password">
    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
  </el-form-item>
  <el-form-item class="btns">
    <el-button type="primary" @click="loginSubmit">登录</el-button>
    <el-button type="info" @click="loginFormReset">重置</el-button>
  </el-form-item>
      </el-form >
  </div>
</div>
    
  
</template>
<script>
export default {
  data () {
    return {
      // 登录表单数据绑定对象
      loginForm:{
        username:'admin',
        password:'123456'

      },
      loginFormRules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {min:3,max:10,message:'长度在3-10个字符',trigger:'blur'}
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          {min:6,max:15,message:'长度在6-15个字符',trigger:'blur'}
        ]
      
      
        
      }

    };
  },
  methods:{
    loginSubmit() {
      this.$refs.form.validate( async valid=> {
       if(!valid) return
       const {data:res}=await this.$http.post('login',this.loginForm)
      //  此时data=res
      //  console.log(data)
      //  console.log(res)
      //  console.log(data.data.token)
    //   if(data.meta.status !=200) return console.log('登录失败')
    // console.log('登录成功')
    if(res.meta.status !=200) return this.$message.error('登录失败')
    this.$message.success('登录成功')
    window.sessionStorage.setItem('token',res.data.token)
    this.$router.push('/home')
    
      })


    },
    loginFormReset() {
      this.$refs.form.resetFields()
    }
  
  }
}
</script>
<style lang='less' scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
}
.pic1, .pic2,.pic3,.pic4 {
display: inline-block;
}
.pic1 {
  width: 25%;
  height: 100%;
  background: url('../assets/hh1.jpg') repeat center;
 
}
.pic2 {
  width: 25%;
  height: 100%;
  background: url('../assets/hh2.jpeg') repeat center;
}
.pic3 {
  width: 25%;
  height: 100%;
  background: url('../assets/hh3.jpeg') repeat center;
}
.pic4 {
  width: 25%;
  height: 100%;
  background: url('../assets/liixan3.png') repeat center;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #2b4b6b;
  border-radius: 3%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.avater_box {
  width: 130px;
  height: 130px;
  border:1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
   transform: translate(-50%,-50%);
   background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
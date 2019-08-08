<template>
 
   <el-container class="home_container">
  
        <el-header>
          <div>
            <img src="../assets/heima.png" alt="">
            <span>电商后台管理系统</span>
          </div>
          <el-button type="info" @click="logout">退出</el-button>
        </el-header>
  <el-container>
   <el-aside :width="isCollapse ? '64px' : '200px'"> 
     <!--  @click="toggleCollapse"可以改写为@click="isCollapse = !isCollapse"这样更简单一点不用再去定义方法 -->
     <div class="toggle_button" @click="toggleCollapse">|||</div>
      <el-menu  background-color="#333744"
  text-color="#fff" active-text-color="#3E8BDD" :unique-opened=true  :collapse-transition=false :collapse="isCollapse" router  :default-active="activePath">
      <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id" >
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
      <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="saveNavState(subitem.path)">
        <i class="el-icon-menu"></i>
         <span>{{subitem.authName}}</span>
        </el-menu-item>
        </el-submenu>
         </el-menu>
   </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
   </el-container>
</el-container>
 
</template>
<script>
export default {
  data () {
    return {
  menuList:[],
  iconsObj:{
    '125':'iconfont icon-users',
    '103':'iconfont icon-tijikongjian',
    '101':'iconfont icon-shangpin',
    '102':'iconfont icon-danju',
    '145':'iconfont icon-baobiao'
  },
  isCollapse:false,
  activePath:''
    

  
    };
  },
  created() {
    // this.$http.get('menus').then(data => console.log(data))
    this.getMenuList();
    this.activePath=window.sessionStorage.getItem('activePath')

  },
  methods:{
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const {data:res}= await this.$http.get('menus')
      if(res.meta.status !=200) return this.$message.error()
      this.menuList=res.data
      // console.log(res)
    },
     toggleCollapse () {

    this.isCollapse = !this.isCollapse
  },
  saveNavState(activePath) {
    this.activePath="/"+activePath;
    window.sessionStorage.setItem('activePath','/'+activePath)
  }
 
  
  },
 
}
</script>
<style lang='less' scoped>

.home_container {
  height:100%;
  background-clip: #eaedf1;
  }
  
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    padding: 0;
    >div{
      display: flex;
      align-items: center;
      span {
        margin-left: 20px;
      }

    }
  }
.el-aside{
   background-color: #333744;
}
.el-main{
   background-color: #eaedf1;
}
.iconfont {
  margin: 10px;
}
//边框处理?

.toggle_button {
  background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    cursor: pointer;
 
}
.el-menu {
  overflow: hidden;
  border-right:0;
}



  
</style>
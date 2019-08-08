<template>
  <div>
    <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图 -->
  <el-card>
    <el-table  style="width: 100%" border  :data="rightList">
       <el-table-column type="index"></el-table-column>
     <el-table-column prop="authName" label="权限名称" > </el-table-column>
      <el-table-column prop="path" label="路径"> </el-table-column>
       <el-table-column prop="level" label="权限层级">
         <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.level=='0'">一级</el-tag>
        <el-tag type="success" v-else-if="scope.row.level=='1'">二级</el-tag>
      <el-tag type="info"  v-else-if="scope.row.level=='2'">三级</el-tag>
         </template>
          </el-table-column>

    </el-table>
  </el-card>
  </div>
</template>
<script>
export default {
  created () {
    this.getRightList()
  },
  data () {
    return {
  rightList:[]
    };
  },
  methods:{
  async getRightList() {
const {data:res} = await this.$http.get('rights/list')
// console.log(res)
if(res.meta.status != 200) return this.$message.error('获取用户列表失败')
// console.log('获取成功')
this.rightList=res.data;
console.log(this.rightList)






 }

  
  }
}
</script>
<style lang='less' scoped>
.el-card {
  margin: 10px;
}
  
</style>

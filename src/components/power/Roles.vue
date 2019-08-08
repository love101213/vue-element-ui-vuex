<template>
  <div>
 <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
  <!-- 添加角色按钮 -->
   <el-button type="primary">添加用户</el-button>
   <el-table  style="width: 100%" border  :data="userRolesList">
     <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item1,index) in scope.row.children" :key="item1.id" :class="['dbottom',index=='0'?'dbtop':'']">
            <!--渲染一级权限 -->
            <el-col :span="5" >
             <el-tag closable @click="removeRoleById(scope.row,item1.id)">{{item1.authName}}</el-tag>
             <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级和三级权限 -->
            <el-col :span="19" >
              <el-row v-for="(item2,index1) in item1.children" :key="item2.id" :class="[index1=='0'?'':'dbtop']">
                <el-col :span="6">
                  <el-tag type="success" closable @click="removeRoleById(scope.row,item2.id)">{{item2.authName}}</el-tag>
  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id"  closable @click="removeRoleById(scope.row,item3.id)">{{item3.authName}}</el-tag>
         </el-col>
              </el-row>
     </el-col>
          </el-row>
 
        </template>
           </el-table-column>
       <el-table-column type="index"></el-table-column>
     <el-table-column prop="roleName" label="角色名称" > </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
       <el-table-column  label="操作">
         <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" >编辑</el-button>
         <el-button type="warning" size="mini"  icon="el-icon-delete" >删除</el-button> 
          <el-button type="danger" size="mini" icon="el-icon-setting" @click="showRightDialogVisible(scope.row)">分配权限</el-button>
          </template>
         </el-table-column>
  </el-table>
   </el-card>
   <!-- 分配权限的对话框 -->
   <el-dialog
  title="提示"
  :visible.sync="setRightDialogVisible"
  width="50%"
  :before-close="handleClose" @click="setRightDialogClosed">
  <!--  树形控件default-expanded-all默认展开所有节点节点是 show-checkbox否可被选择  每个树节点用来作为唯一标识的属性，node-key="id"整棵树应该是唯一的default-checked-keys="keyArray" 默认勾选的节点的 key 的数组-->
  <el-tree :data="rightList" :props="defaultProps" show-checkbox default-expand-all node-key="id" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>
<script>
export default {
  created () {
    this.getUserRoles()
  },
  data () {
    return {
      roleId:'',
  userRolesList:[],
  // 对话框
  setRightDialogVisible: false,
  rightList:[],
   defaultProps: {
          children: 'children',
          label: 'authName'
        },
        // defKeys:['105','106'],
         defKeys:[],
         
    };
  },
  methods:{
   async getUserRoles() {
const {data:res} = await this.$http.get('roles')
if(res.meta.status != 200) return this.$message.error('获取信息失败')

this.userRolesList=res.data
// console.log(this.userRolesList)
  },
   async removeRoleById(role,righId) {
   const confirm= await  this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        console.log(confirm)
        if(confirm != 'confirm')return this.$message.error('已经取消了删除')
       const {data:res}= await this.$http.delete(`roles/${role.id}/rights/${righId}`)
       if(res.meta.status != 200) return this.$message.error('删除权限失败')
         role.children=res.data
  },
   handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      // 分配权限
     async showRightDialogVisible(role) {
       this.roleId=role.id
const {data:res} = await this.$http.get('rights/tree')
console.log(res)
this.rightList=res.data;
this.getDefKeys(role,this.defKeys)
this.setRightDialogVisible=true
      },
getDefKeys(node,arr) {
      if(! node.children)
return arr.push(node.id)
node.children.forEach(item => this.getDefKeys(item,arr))
      

    },
      // 树形控件
      setRightDialogClosed() {
        this.defKeys=[]
      },
      // 分配权限功能
     async allotRights() {
      const keys=[
     ...this.$refs.treeRef.getCheckedKeys(),
      ...this.$refs.treeRef.getHalfCheckedKeys(),
]
const idStr=keys.join(',')
const {data:res}= await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
if(res.meta.status !=200) return this.$message.error('分配权限失败')
this.$message.success('分配权限成功')
this.getUserRoles()
this.setRightDialogVisible=false


      }
    }

    
  
}
</script>
<style lang='less' scoped>
  .el-card {
  margin: 10px;
}
.el-button {
margin-bottom: 10px;
}
.el-tag {
  margin: 8px;
  cursor: pointer;
}
.dbottom {
  border-bottom: 1px solid #eee;
}
.dbtop {
  border-top: 1px solid #eee;
}
</style>
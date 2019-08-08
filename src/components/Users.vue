<template>
  <div class="el_main_div">
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <!-- 搜索框 添加用户  24栅格-->
<el-row :gutter="20">
  <el-col :span="8">
    <el-input  prefix-icon="el-icon-search"  v-model="userInfo.query" placeholder="请输入内容" clearable @clear="getUserList">
    <el-button icon="el-icon-search" slot="append" @click="getUserList"></el-button>
    </el-input>
    
    
  </el-col>
  <el-col :span="4">
    <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
    </el-col>

</el-row>
<!-- 列表 -->
   <el-table
      :data="userList"
      style="width: 100%"
       border>
       <el-table-column
      type="index"
      >
    </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="140">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
         width="140">
      </el-table-column>
       <el-table-column
        prop="role_name"
        label="角色"
         width="140">
      </el-table-column>
       <el-table-column
        prop="my_state"
        label="状态"
        width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.my_state" @change="userStateChange(scope.row)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        <!-- {{scope.row}} -->
        </template>
      </el-table-column>
       <el-table-column label="操作" style="width:180">
         <template slot-scope="scope">
      
         <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
         <el-button type="warning" size="mini"  icon="el-icon-delete" @click="removeUserInfo(scope.row.id)"></el-button>
        
        <el-tooltip  effect="dark"  placement="top" :enterable="false" content="分配角色">
   <el-button type="danger" size="mini" icon="el-icon-setting" @click="setRoles(scope.row)"></el-button>
</el-tooltip>
        </template>
       </el-table-column>
    </el-table>
     <el-switch v-model="value">
 </el-switch>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userInfo.pagenum"
      :page-sizes="[1,2,5,10]"
      :page-size="userInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :hide-on-single-page="value"
      background>
    </el-pagination>
    <!-- 添加对话框 -->
  
      <el-dialog
       title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
        :before-close="handleClose"
        @close="closeDialogform">
       <el-form :model="addForm" status-icon :rules="addRuleForm" ref="addFormRef" class="demo_ruleForm">
    <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
      <el-input v-model="addForm.username" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
      <el-input v-model="addForm.password" autocomplete="off" ></el-input>
    </el-form-item>
    <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
      <el-input v-model="addForm.email"  autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
      <el-input v-model="addForm.mobile" autocomplete="off" ></el-input>
    </el-form-item>
     </el-form>
       <span slot="footer" class="dialog-footer">
       <el-button type="info"  @click="dialogVisible = false" >取 消</el-button>
      <el-button type="primary" @click="submitForm" >确 定</el-button>
  </span>
</el-dialog>
<!-- 修改用户对话框 -->
<el-dialog
       title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
        :before-close="handleClose"
        @close="editDialogClosed">
       <el-form :model="editForm" status-icon :rules="editRuleForm" ref="editFormRef" class="edit_ruleForm">
    <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
      <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
    </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
      <el-input v-model="editForm.email"  autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
      <el-input v-model="editForm.mobile" autocomplete="off" ></el-input>
    </el-form-item>
     </el-form>
       <span slot="footer" class="dialog-footer">
       <el-button type="info"  @click="editDialogVisible = false" >取 消</el-button>
      <el-button type="primary" @click="editUserInfo" >确 定</el-button>
  </span>
</el-dialog>
<!-- 分配角色 -->
<el-dialog
  title="提示"
  :visible.sync="rolesdialogVisible"
  width="50%"
  :before-close="handleClose"
  @closed="setRolesDialogClosed">
   <p>当前用户:{{roleInfo.username}}</p>
   <p>当前角色:{{roleInfo.role_name}}</p>
   <p>分配新角色:
     <el-select  v-model="selectedRoleId" placeholder="请选择">
       <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" value="item.id"></el-option>
     </el-select>
   </p>
  <span slot="footer" class="dialog-footer">
    <el-button @click="rolesdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRoleInfo">确 定</el-button>
  </span>
</el-dialog>
</el-card>
  </div>
</template>
<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    var checkEmail = (rule,value,callback) => {
      console.log(123)
  const regEmail= /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/
  if(regEmail.test(value)) return callback()
  return callback(new Error('输入合法邮箱'))

   }
   var checkTel=(rule,value,callback) =>{
     const mobile=/(13\d|14[579]|15\d|17[01235678]|18\d)\d{8}/i
     if(mobile.test(value)) return callback()
  return callback(new Error('输入正确手机号'))
   }
   
    return {
     selectedRoleId:'',
      rolesdialogVisible:false,
       roleInfo:{},
      roleList:[],
      dialogVisible: false,
      
      value:false,
  userInfo:{
    query:'',
    pagenum:1,
    pagesize:2
  },
  userList:[],
  total:0,
  formLabelWidth: '80px',
   addForm: {
  username:'',
  password:'',
  email:'',
  mobile:'',
  
},
editForm:{},
editDialogVisible:false,
// 表单验证规则
addRuleForm:{
username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {min:3,max:10,message:'用户名长度在3到10个字之间',trigger:'blur'}
        ],
 password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          {min:6,max:15,message:'长度在6-15个字符',trigger:'blur'}
        ],
 email:[
     {required:true,message:'请输入邮箱',trigger:'blur'},
      { validator: checkEmail, trigger: 'blur'}
    ],
mobile:[
    {required:true,message:'请输入手机号',trigger:'blur'},
  { validator: checkTel, trigger: 'blur'}
]


},
editRuleForm:{
email:[
     {required:true,message:'请输入邮箱',trigger:'blur'},
      { validator: checkEmail, trigger: 'blur'}
    ],
mobile:[
    {required:true,message:'请输入手机号',trigger:'blur'},
  { validator: checkTel, trigger: 'blur'}
]

}
  
 }
  },
  methods:{
    async  getUserList() {
      const {data:res}=await this.$http.get('users',{params:this.userInfo})
      // console.log(res)
      // console.log(res.meta.status)
      if(res.meta.status != 200) return this.$message.error('获取用户列表失败')
      this.userList=res.data.users
      this.total=res.data.total
    
    },
    handleSizeChange(val) {
       this.userInfo.pagesize=val
       this.getUserList()
     

    },
    handleCurrentChange(val) {
 this.userInfo.pagenum=val
       this.getUserList()
    },
    async userStateChange(info) {
      //这里是模板字符串
      const {data:res}= await this.$http.put(`users/${info.id}/state/${info.my_state}`)
      // console.log(res)
      if(res.meta.status != 200) {
        info.my_state = !info.my_state
        return this.$message.error('用户更新失败!')
      }
      
      this.$message.success('用户更新成功')
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      // 重置表单
      closeDialogform() {
        this.$refs.addFormRef.resetFields();
      },
      editDialogClosed() {
this.$refs.editFormRef.resetFields();
      },
      submitForm() {
         this.$refs.addFormRef.validate( async valid => {
           if( !valid) return 
           const {data:res}= await this.$http.post('users',this.addForm)
          //  console.log(res)
          //  console.log(res.meta.status)
          if(res.meta.status != 201) return this.$message.error('添加用户失败')
           
             // 不显示对话框
            this.dialogVisible=false
           
            this.getUserList()
             this.$message.success('添加用户成功')

           
         })
      },
      editUserInfo() {
        this.$refs.editFormRef.validate( async  valid => {
      if(!valid) return
      const {data:res}= await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
      // console.log(res)
      if(res.meta.status != 200) return this.$message.error('更新用户失败')
       this.editDialogVisible=false
        this.getUserList()
      this.$message.success('更新用户成功')

        })

      },
     async  showEditDialog(id) {
    const {data:res} = await this.$http.get('users/'+id)
    // console.log(res)
    // console.log(res.data)
    this.editForm=res.data
    this.editDialogVisible=true
      },
      // 删除用户
   async   removeUserInfo(id) {
// 删除弹框
   const confirm =await  this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .catch(error=> error )
                
       
        // 点击确定是 返回值是confirm
        // 点击取消 返回值是 cancle
        // console.log(confirm)
        if(confirm != 'confirm') return this.$message.info('已取消了删除')
        // console.log('确认删除')
        const {data:res} = await this.$http.delete('users/'+id)
        console.log(res)
        if(res.meta.status != 200) return this.$message.error('用户删除失败')
        this.$message.success('用户删除成功')
        this.getUserList()

      },
      // 分配角色功能的实现
      async setRoles(roleInfo) {
        this.roleInfo=roleInfo
      
   const {data:res}= await this.$http.get('roles')
    console.log(res)
  if(res.meta.status != 200) return this.$message.error('获取角色失败')
  
    this.roleList = res.data
    // console.log(this.roleList)
   this.rolesdialogVisible=true
      },
      // 监听对话框的关闭事件
      setRolesDialogClosed() {
       this.selectedRoleId='',
        this.roleInfo={}


      },
   async setRoleInfo() {
if(!this.selectedRoleId) {return this.$message.error('请选择要分配的角色')}
 const {data:res}= await this.$http.put(`users/${this.roleInfo.id}/role`,{rid:this.selectedRoleId})
console.log(res)
if(res.meta.status != 200) {
  return this.$message.error('修改用户角色失败')
  }
    this.$message.success('更改成功')
    this.getUserList()
    this.rolesdialogVisible=false
}

    }
  
  }

</script>
<style lang='less' scoped>
.el-pagination {
  margin-top: 15px;
}
 .el-breadcrumb {
   margin-bottom: 15px;
  
}
.el-row  {
  padding: 20px 20px 0 20px;
}


  
</style>
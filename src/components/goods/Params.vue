<template>
  <div>
    <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row>
      <el-alert
    title="注意：只允许为第三级分类设置相关参数！"
    type="warning" show-icon :closable="false">
  </el-alert>
    </el-row>
    <el-row class="cate_option">
      <el-col>
        <span>  选择商品分类：</span>
         <!-- 级联选择器 -->
      <!-- options用来指定数据源 -->
      <!-- props指定配置对象 -->
    <el-cascader   :options="cateList" :props="cascaderProp" clearable props.expandTrigger="hover"  v-model="selectedKeys"  @change="handleCateChange" props.checkStrictly></el-cascader>
        </el-col>
    </el-row>
    <!-- tbs标签页 -->
    <template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="many">
       <el-button type="primary" size="mini" :disabled="isBtndisabled" @click="addDialogVisible=true">添加参数</el-button>
       <!-- 动态参数表格 -->
      <el-table  :data="manyTableData"  border style="width: 100%">
         <el-table-column type="expand" >
<!-- 循环渲染tag标签 -->
           <template slot-scope="scope">
             <!-- {{scope.row}} -->
             <el-tag  v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClosed(index,scope.row)">{{item}}</el-tag>
          
           <!-- 输入框 -->
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
           <!-- 添加按钮 -->
           </el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
 </template>
        </el-table-column>
         <el-table-column type="index" >
        </el-table-column>
        <el-table-column  prop="attr_name" label="参数名称" >
        </el-table-column>
         <el-table-column   label="操作" >
             <template slot-scope="scope">
           <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showParams(scope.row.attr_id)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
             </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <!-- 添加静态属性 -->
    <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" size="mini" :disabled="isBtndisabled" @click="addDialogVisible=true">添加属性</el-button>
 <el-table  :data="onlyTableData"  border style="width: 100%">
          <el-table-column type="expand" >
<!-- 循环渲染tag标签 -->
           <template slot-scope="scope">
             <!-- {{scope.row}} -->
             <el-tag  v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClosed(index,scope.row)">{{item}}</el-tag>
          
           <!-- 输入框 -->
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
           <!-- 添加按钮 -->
           </el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
 </template>
        </el-table-column>
         <el-table-column type="index" >
        </el-table-column>
        <el-table-column  prop="attr_name" label="属性名称" >
        </el-table-column>
         <el-table-column   label="操作" >
             <template slot-scope="scope">
           <el-button type="primary" icon="el-icon-edit" size="mini" @click="showParams(scope.row.attr_id)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
             </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
 </el-tabs>
</template>
  </el-card>
  <!-- 添加参数和属性对话框 -->
   <el-dialog
  :title="'添加'+titleText"
  :visible.sync="addDialogVisible"
  width="50%" @click="addDialogClose">
    <el-form :model="addForm"  ref="addFormRef" :label-width="formLabelWidth" :rules="addFormRules">
    <el-form-item :label="titleText" prop="attr_name" >
      <el-input v-model="addForm.attr_name" autocomplete="off"></el-input>
    </el-form-item>
    
 </el-form>
 
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary"  @click="addParams">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改参数对话框 -->
 <el-dialog
  :title="'修改'+titleText"
  :visible.sync="editDialogVisible"
  width="50%" @close="editFormitDialogClose">
    <el-form :model="editForm"  ref="editFormRef" :label-width="formLabelWidth" :rules="editFormRules">
    <el-form-item :label="titleText" prop="attr_name" >
      <el-input v-model="editForm.attr_name" autocomplete="off"></el-input>
    </el-form-item>
    
 </el-form>
 
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary"  @click="editParams">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  // 获取商品分类列表数据
  created () {
    this.getCateList();
  },
  data () {
    return {
  cateList:[],
  selectedKeys:[],
  cascaderProp:{
    value:'cat_id',
    label:'cat_name',
    children:'children'
  },
  activeName:'many',
  manyTableData:[],
  onlyTableData:[],
  addDialogVisible:false,
  addForm:{
    attr_name:''
  },
  formLabelWidth:'80px',
  addFormRules:{
    attr_name:[
      {required:true,message:'请输入参数名称',trigger:'blur'}
    ]
  },
  editDialogVisible:false,
  editForm:{},
  
  editFormRules:{
    attr_name:[
      {required:true,message:'请输入参数名称',trigger:'blur'}
    ]
  },
  // 控制输入框与按钮的显示
  inputVisible:false,
  // 输入框中的值
  inputValue:""
  

    }  },
  computed: {
    isBtndisabled() {
      if(this.selectedKeys.length != 3)   return true
      return false
    
    },
    // 动态计算标题的文本
titleText() {
  if(this.activeName=='many') {
return '动态参数'
  }else {
    return '动态属性'
  }
},
  //当前选中的三级分类的id 函数的调用
    cateId:function () {
if(this.selectedKeys.length === 3) {return this.selectedKeys[2]}
else {
return null
}
 },
  },
  methods:{
    //  获取商品分类列表数据
   async  getCateList() {
    const {data:res}= await  this.$http.get('categories')
    console.log(res)
    if(res.meta.status != 200) return this.$message.error('获取商品列表数据失败')
    this.cateList=res.data
  },
  // 级联选择器的监听事件
    handleCateChange() {
    this.getParamsData()
  
  },
  // 重新获取参数列表数据函数
async getParamsData() {
  // console.log(this.selectedKeys)
  //   console.log(this.selectedKeys[2])
if(this.selectedKeys.length != 3) {
      this.selectedKeys=[]
      this.manyTableData=[]
      this.onlyTableData=[]
      return
    }
   
    //  console.log(this.selectedKeys)
    // 获取参数列表
    const {data:res} =await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
    // console.log(res)
    if(res.meta.status != 200) return this.$message.error('获取参数失败')
    console.log(res.data)
    res.data.forEach(item =>{
     item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
    //  让每一行有自己的inputVisible和inputValue
    item.inputVisible=false
    item.inputValue=''
  })
    if(this.activeName=='many') {
      this.manyTableData=res.data
    }else {
      this.onlyTableData=res.data
    }
},
// 关闭 对话框
addDialogClose() {
this.$refs.addFormRef.resetFields()
},
// 点击完成添加参数操作
addParams () {
 this.$refs.addFormRef.validate( async valid => {
   if(!valid) return
   const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
     attr_name:this.addForm.attr_name,
     attr_sel:this.activeName
   })
  //  console.log(res)
   if(res.meta.status != 201) return this.$message.error('添加参数失败')
   this.$message.success('添加参数成功')
   this.addDialogVisible=false
    this.getParamsData()


 })
},
// 获取参数信息
  async showParams(attr_id) {
const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{params:{attr_sel:this.activeName}})
console.log(res)
if(res.meta.status != 200) return this.$message.error('获取参数信息失败')
this.editForm=res.data
this.editDialogVisible=true
},
editFormitDialogClose () {
this.$refs.editFormRef.resetFields()
},
// 完成修改参数的操作
  editParams() 

{
this.$refs.editFormRef.validate( async valid  => {
  if(!valid) return
  const {data:res}= await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
    attr_name:this.editForm.attr_name,
   attr_sel:this.activeName
  })
  if(res.meta.status != 200) return this.$message.error('修改参数信息失败')
  
this.$message.success('修改参数成功')
this.getParamsData()
this.editDialogVisible=false
})
},
// 删除操作
async removeParams(attr_id) {
 const confirmResult = await this.$confirm('此操作将永久删除该参数，是否继续?','提示',{confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'}).catch(err=>err)
 if(confirmResult != 'confirm') {
   return this.$message.info('已取消的删除')
 }
const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
if(res.meta.status != 200) return this.$message.error('删除参数信息失败')
this.$message.success('删除参数成功')
this.getParamsData()

},



  handleClick() {
        console.log(this.activeName);
        // 切换Tabs面板后重新获取参数列表数据
         this.getParamsData()
      },
      // blur,enter 的都会触发这个事件
   async   handleInputConfirm (row) {
    //  触发事件切换按钮
    // 判断输入内容是都为空字符串
    if(row.inputValue.trim().length === 0) {
      row.inputValue=''
       row.inputVisible=false
       return
    }

    // 不是空字符串进行的处理
       row.attr_vals.push(row.inputValue.trim())
     row.inputValue=''
       row.inputVisible=false
     this.saveattrvals(row)
      },
      // 点击让输入框显示
      showInput (row) {
        row.inputVisible=true
        // $nextTick方法 当页面中的元素被重新渲染之后才会指定回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      // 删除可选参数项
      handleClosed(i,row) {
   row.attr_vals.splice(i,1)
   this.saveattrvals(row)
      },
   async saveattrvals (row) {
 //  发送请求保存数据到后台
      const {data:res}= await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(',')
      })
      if(res.meta.status != 200) return this.$message.error('修改参数信息失败')
this.$message.success('修改参数成功')
      
      }


  }
}
</script>
<style lang='less' scoped>
  .el-card {
    margin: 15px;
  }
  .cate_option {
    margin: 15px 0;
  }
  .el-button {
     margin: 10px 0;
  }
  .input-new-tag {
    width: 120px;
  }
  .el-tag {
    margin: 10px;
  }
</style>
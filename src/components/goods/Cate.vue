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
    <el-button type="primary" @click="showCateDialog">添加分类</el-button>
  </el-row>
     
  <!-- 表格区域 -->
<tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true"  index-text="#" border  :show-row-hover="false">
  <!-- 是否有效 -->
  <template slot="isok" slot-scope="scope">
  
    <i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="color:lightgreen" ></i>
    <i class="el-icon-error" v-else style="color:red"></i>
  </template>
  <!-- 排序 -->
  <template slot="order" slot-scope="scope">
    <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level==1">二级</el-tag>
    <el-tag type="warning" size="mini" v-else-if="scope.row.cat_level==2">三级</el-tag>
  </template>
  <!-- 操作 -->
   <template slot="opt" >
     <el-button type="primary" icon="el-icon-edit">编辑</el-button>
     <el-button type="danger" icon="el-icon-delete">删除</el-button>
   </template>
</tree-table>
   <!-- 分页区域 size-change和current-change事件来处理页码大小和当前页变动时候触发的事件-->
    <el-pagination
    class="treeTable"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
  <!-- 添加分类对话框 -->
  <el-dialog
  title="添加分类"
  :visible.sync="addDialogVisible"
  width="40%"
  :before-close="handleClose"
  @closed="addCateDialogClose">
    <el-form :model="addCateForm"  ref="addCateFormRef" :label-width="formLabelWidth" :rules="addCateFormRules">
    <el-form-item label="分类名称" prop="cat_name" >
      <el-input v-model="addCateForm.cat_name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="父级分类"  >
      <!-- 级联选择器 -->
      <!-- options用来指定数据源 -->
      <!-- props指定配置对象 -->
    <el-cascader   :options="parentList" :props="cascaderProp" clearable props.expandTrigger="hover"  v-model="selectedKeys"  @change="parentCateChange" props.checkStrictly size="medium" ></el-cascader>
    </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  created () {
    this.getGoodsCategories()
  },
  data () {
    return {
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      cateList:[],
      total:0,
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {
         label:'是否有效',
           //表示将当前列定义为模板列
                type:'template',
                //表示当前这一列使用模板的名称isOk是错误的写法
                template:'isok'
        },
        {
         label:'排序',
           //表示将当前列定义为模板列
                type:'template',
                //表示当前这一列使用模板的名称isOk是错误的写法
                template:'order'
        },
        {
         label:'操作',
           //表示将当前列定义为模板列
                type:'template',
                //表示当前这一列使用模板的名称isOk是错误的写法
                template:'opt'
        }
      ],
      addDialogVisible:false,
      formLabelWidth: '80px',
      //分类对话框 参数
      addCateForm:{
        // 分类名称
        cat_name:'',
        // 分类父 ID
        cat_pid:0,
        // 分类层级
        cat_level:0,
      },
      addCateFormRules:{
        cat_name:[
          {required:true,message:'请输入分类名称',trigger:'blur' }
         
         ]
      },
      // 父类空数组
      parentList:[],
      // 配置对象
      cascaderProp:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        // 这个属性可以选择任意一级选项的目的 单选
        checkStrictly: true 
        },
        // 选中分类的id数组
        selectedKeys:[],

     
  
    };
  },
  methods:{
    // 获取商品分类列表
 async getGoodsCategories() {
const {data:res}= await this.$http.get('categories',{params:this.queryInfo})
if(res.meta.status !=200) return this.$message('获取商品分类数据失败')
console.log(res.data.result)
this.cateList=res.data.result
this.total=res.data.total

  },
  handleSizeChange(newSize) {
this.queryInfo.pagesize=newSize
  this.getGoodsCategories()
  },
  handleCurrentChange(newPage) {
    this.queryInfo.pagenum=newPage
      this.getGoodsCategories()
    },
    // 添加分类
    showCateDialog() {
      // /展示父类分类
       this.getParentCateList()
      this.addDialogVisible=true
     
    },
    // 获取父类分类数据
    async getParentCateList() {
      const {data:res}= await this.$http.get('categories',{params:{type:2}})
      console.log(res)
    if(res.meta.status !=200) return this.$message.error('获取父类分类数据失败')
    this.parentList=res.data
      },
// 监听改变事件
   parentCateChange() {
    //  父类id数组

// console.log(this.selectedKeys)
if(this.selectedKeys.length >0) {
  this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
  this.addCateForm.cat_level=this.selectedKeys.length
  return

}else {
  this.addCateForm.cat_pid=0
   this.addCateForm.cat_level=0
}
      },
      //根据分类变化处理表单中的数据 
      // 添加分类功能
    addCate() {
    console.log(this.addCateForm)
     this.$refs.addCateFormRef.validate(async valid => {
       if(!valid) return
      const {data:res}= await this.$http.post('categories',this.addCateForm)
      console.log(res)
       if(res.meta.status != 201){ return this.$message.error('添加数据是失败')
       }
     this.$message.success('添加数据成功')
      this.getGoodsCategories()
      this.addDialogVisible=false
     } ) 
    },
      // 重置表单数据
      addCateDialogClose() {
        console.log(1)
       this.$refs.addCateFormRef.resetFields()
        this.selectedKeys=[]
         this.addCateForm.cat_pid=0
        this.addCateForm.cat_pid=0

      },
    // 对话框关闭之前的确认before-close
     handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    
  }
}
</script>
<style lang='less' scoped>
 

  
</style>
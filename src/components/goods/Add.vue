<template>
  <div>
  <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card>
    <!-- 警示信息 show-icon	是否显示图标 closable是否可关闭 -->
    <el-row class="el_alert"> 
      <el-col>
       <el-alert
          title="添加商品信息"
          type="info"
          center
          show-icon
          :closable="false">
        </el-alert>
     </el-col>
    </el-row>
    <!--  步骤条区域-->
    <!-- finish-status 改变已经完后才能的步骤状态 
    active 步骤条的状态 接收index 宽度space(px)
    align-center:居中对齐-->
   <el-steps :active="active-0" finish-status="success" :space="200"  align-center>
  <el-step title="基本信息" ></el-step>
  <el-step title="商品参数" ></el-step>
  <el-step title="商品属性"  ></el-step>
  <el-step title="商品图片" ></el-step>
  <el-step title="商品内容" ></el-step>
  <el-step title="完成" ></el-step>
  
</el-steps>
<!-- <el-steps :active="active-0" finish-status="success" :space="200"  align-center>
  <el-step title="基本信息"  icon="el-icon-edit"></el-step>
  <el-step title="商品参数" icon="el-icon-upload"></el-step>
  <el-step title="商品属性"  icon="el-icon-more"></el-step>
  <el-step title="商品图片" icon="el-icon-picture"></el-step>
  <el-step title="商品内容"  icon="el-icon-s-help"></el-step>
  <el-step title="完成"  icon="el-icon-star-on"></el-step>
  
</el-steps> -->
<!-- 左侧tab栏 tabPosition="left|right|top|bottom"设置tab的四个 方向-->
<!-- label-position=表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width -->
<el-form :model="addForm" :rules="rulesForm" ref="ruleFormRef" label-width="100px" class="demo-ruleForm" label-position="top" >
 <el-tabs :tab-position="tabPosition" v-model="active" :before-leave="beforeTabLeave" @tab-click="tabClicked">
    <el-tab-pane label="基本信息" name="0">
<el-form-item label="商品名称"  prop="goods_name">
  <el-input v-model="addForm.goods_name" ></el-input>
</el-form-item>
<el-form-item label="商品价格"  prop="goods_price">
  <el-input v-model="addForm.goods_price" type="number"></el-input>
</el-form-item>
<el-form-item label="商品重量"  prop="goods_weight">
  <el-input v-model="addForm.goods_weight"></el-input>
</el-form-item>
<el-form-item label="商品数量"  prop="goods_number">
  <el-input v-model="addForm.goods_number"></el-input>
</el-form-item>
<!-- 级联选择器 -->
<el-form-item label="商品分类"  prop="goods_cat" >
   <el-cascader
    v-model="addForm.goods_cat"
    :options="cateList"
    props.expandTrigger="hover"
    :props="cateProps"
    @change="handleChange" size="medium"  props.checkStrictly clearable></el-cascader>
  
</el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数"  name="1">
      <el-form-item :label="item.attr_name" v-for="item in tabMany" :key="item.attr_id">
        <el-checkbox-group v-model="item.attr_vals">
    <el-checkbox :label="cb" v-for="(cb,index) in item.attr_vals" :key="index" border></el-checkbox>
    
  </el-checkbox-group>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性"  name="2">
       <el-form-item :label="item.attr_name" v-for="item in tabOnly" :key="item.attr_id">
       <el-input v-model="item.attr_vals"></el-input>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片"  name="3">
      <!-- upload上传图片 action上传的地址on-preview点击文件列表中已上传的文件时的钩子on-remove文件列表移除文件时的钩子  file-list  上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}] list-type设置文件列表的样式  headers设置上传的请求头部-->
      <el-upload
  class="upload-demo"
  :action="uploadURL"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
 list-type="picture"
 :headers="headersObj"
 :on-success="handleSuccess">
  <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </el-tab-pane>
     <el-tab-pane label="商品内容"  name="4">
       <!-- 富文本编辑器 -->
       <quill-editor v-model="addForm.goods_introduce" >
  </quill-editor>
  <!-- 按钮 -->
  <el-button  type="primary" class="add" @click="addBtn">添加商品</el-button>
     </el-tab-pane>
  </el-tabs>
  </el-form>
 
  <!-- 对应添加商品的表格 -->
  
  </el-card>
  <!-- 图片预览对话框 -->
  <el-dialog  title="图片预览" :visible.sync="previewVisible" width="50%">
    <img :src="previewUrl" alt="" class="previewImg">
  </el-dialog>
  </div>
</template>
<script>
// 引入lodash  _cloneDeep() 深拷贝
  import  _ from 'lodash'
export default {
  
  created () {
    this.getCateList()
  },
  data () {
    return {
      //步骤条
      active:'0',
      tabPosition:'left',
      addForm:{
        goods_name:'',
        goods_price:0,
        goods_number:0,
        goods_weight:0,
        // 商品分类数组
        goods_cat:[],
        // 图片信息
        pics:[],
    // 商品描述
    goods_introduce:'',
    // 商品的参数（数组)
    attrs:[]


      },
      rulesForm:{
        goods_name:[
          {required:true,message:'请输入商品名称',trigger:'blur'}
        ],
        goods_price:[
           {required:true,message:'请输入商品价格',trigger:'blur'}
        ],
        goods_number:[
          {required:true,message:'请输入商品数量',trigger:'blur'}
        ],
        goods_weight:[
          {required:true,message:'请输入商品重量',trigger:'blur'}
        ],
        goods_cat:[
           {required:true,message:'请输入商品分类',trigger:'blur'}
        ]
      },
      cateList:[],
      // 级联选择器的配置对象
      cateProps:{
        label:'cat_name',
        value:'cat_id',
        children:'children',
        checkStrictly:true

      },
      // 获取动态参数
      tabMany:[],
      // 获取静态参数
      tabOnly:[],
      // 图片文件上传地址
      uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
      // 请求头
       headersObj:{
        Authorization:window.sessionStorage.getItem('token')
       },
      //  图片预览
      previewVisible:false,
      // 图片路径
      previewUrl:""


  
    };
  },
  methods:{
    // 获取商品列表数据
  async  getCateList() {
 const {data:res}= await this.$http.get('categories')
 if(res.meta.status !=200) return this.$message.error('获取商品列表失败')
 this.cateList=res.data
 console.log(this.cateList)
    },
    // 获取商品分类 级联选择器改变触发
    handleChange() {
// console.log(this.addForm.goods_cat)
if(this.addForm.goods_cat.length != 3) {
  this.addForm.goods_cat=[]
}
    },
    //阻止标签页的切换
  beforeTabLeave(activeName,oldActiveName ) {
     
      // console.log(oldActiveName)
      //  console.log(activeName)
      // return false

      if(oldActiveName==='0' && this.addForm.goods_cat.length != 3) {
        this.$message.error('请选择商品分类')
        return false
      }

    },
    // 获取动态参数
async   tabClicked() {
// console.log(this.active)
if(this.active === '1') {
  const {data:res}= await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
if(res.meta.status != 200) return this.$message.error('获取动态参数失败')

// console.log(this.tabMany)
res.data.forEach(item => {
  item.attr_vals=item.attr_vals.trim()===0? []:item.attr_vals.split(',')
})
this.tabMany=res.data
console.log(this.tabMany)

}
if(this.active === '2') {
 const {data:res}= await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
if(res.meta.status != 200) return this.$message.error('获取静态态参数失败')
 this.tabOnly=res.data
 console.log(this.tabOnly)
}



},
// 上传图片预览
handlePreview(file) {
  console.log(111)
  this.previewUrl=file.response.data.url
  this.previewVisible=true
  },
  // 删除图片
  handleRemove(file) {
    console.log(file)
    console.log(file.response.data.tmp_path)
    const filePath= file.response.data.tmp_path
    const index= this.addForm.pics.findIndex(x => x.pic===filePath)
    this.addForm.pics.splice(index,1)
    console.log(this.addForm)

  },
  // 监听成功事件
 handleSuccess(response) {
console.log(response)
  const picInfo={pic:response.data.tmp_path}
  this.addForm.pics.push(picInfo)
  console.log( this.addForm.pics)
 },
//  表单预验证
addBtn() {
this.$refs.ruleFormRef.validate( async valid => {
  if(!valid) return this.$message.error('请填写必要的表单')
  const form = _.cloneDeep(this.addForm)
  form.goods_cat=form.goods_cat.join(',')
  // console.log(form)
  // 处理动态参数
  this.tabMany.forEach(item => {
    const newInfo={
      attr_id:item.attr_id,
      attr_value:item.attr_vals.join('')
    }
    this.addForm.attrs.push(newInfo)
  })
  // 处理静态参数
   this.tabOnly.forEach(item => {
    const newInfo={
      attr_id:item.attr_id,
      attr_value:item.attr_vals
    }
    this.addForm.attrs.push(newInfo)
  })
  // 将到attr赋值到form中
  form.attrs=this.addForm.attrs
  console.log(form)
  // 发起请求添加商品 商品名称必须是唯一的
  const {data:res}= await this.$http.post('goods',form)
  console.log(res)
  if(res.meta.status != 201) return this.$message.error('添加商品失败')
  this.$message.success('添加商品成功')
  this.$router.push('/goods')


})
}
 

  },
  computed: {
    cateId() {
      if(this.addForm.goods_cat.length===3) {
        return this.addForm.goods_cat[2]
      }else {
        return null
      }
    }
  }
}
</script>
<style lang='less' scoped>
  .el-step_title {
    font-size: 13px;
}
.el-checkbox {
  margin: 0 8px !important;
}
.previewImg {
  width: 100%;
}
</style>
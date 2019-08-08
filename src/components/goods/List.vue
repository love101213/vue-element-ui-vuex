<template>
  <div>
    <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card>
    <el-row  :gutter="20">
      <el-col :span="8">
      <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable  @clear="getGoodsData">
  
    <el-button slot="append" icon="el-icon-search" @click="getGoodsData"></el-button>
  </el-input>
      </el-col>
       <el-col :span="4" >
        <el-button type="primary" @click="goAddPage">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格渲染 -->
    <el-table :data="getGoodList"  border stripe="" > 
<el-table-column  type="index"></el-table-column>
<el-table-column  label="商品名称" prop="goods_name"></el-table-column>
<el-table-column  label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
<el-table-column  label="商品重量" prop="goods_weight"  width="100px"></el-table-column>
<el-table-column  label="创建时间" prop="add_time"  width="160px">
  <template slot-scope="scope">
    {{scope.row.add_time | dateFormate}}
  </template>
</el-table-column>
<el-table-column  label="操作"   width="150px">
   <template slot-scope="scope">
  <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.goods_id)"></el-button>
  </template>

</el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <!-- page-sizes每页显示个数选择器的选项设置
     page-size每页显示条目个数 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[ 5, 10, 15,20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
  </div>
</template>
<script>
export default {
  created () {
    this.getGoodsData()
  },
  data () {
    return {
      // 存放获取列表数据的数组
      getGoodList:[],
      // 参数
 queryInfo:{
 query:'',
pagenum:1,
pagesize:10,
      },
      // 数据总数
      total:0,
  
    };
  },
  methods:{
    async  getGoodsData () {
   const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
   console.log(res)
   if(res.meta.status !=200) return this.$message.error('获取商品数据失败')
   console.log('成功')
   this.getGoodList=res.data.goods
  this.total=res.data.total
  }  ,
  // 分页书法的事件
  // 页码大小变化pageSize 
   handleSizeChange(newSize) {
       this.queryInfo.pagesize=newSize
        this.getGoodsData()
      },
      // 页面变动时候currentPage
      handleCurrentChange(newPage) {
       this.queryInfo.pagenum=newPage
        this.getGoodsData()

      },
      // 删除商品
     async deleteGoods(id) {
const confirm = await  this.$confirm('此操作将永久性删除该文件，是否继续?','提示',
 {confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
 }).catch(err => err)
 if(confirm != 'confirm') return this.$message.info('已经取消了删除')
 const {data:res}=await this.$http.delete(`goods/${id}`)
 console.log(res)
 if(res.meta.status != 200) return this.$message.error('删除失败')
 this.$message.success('删除成功')
 this.getGoodsData()

      },
      // 跳转到添加商品页面
      goAddPage ( ) {
      this.$router.push('/goods/add')
      }
  
  }
}
</script>
<style lang='less' scoped>
  
</style>
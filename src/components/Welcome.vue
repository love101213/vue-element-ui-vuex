<template>
  <div>
    <h3> Welcome</h3>
    <!-- echarts -->
  <div id="main" style="width: 700px;height:400px;"></div>
  <!-- 走马灯 -->
  <div class="block">
    <span class="demonstration" >Gun 神</span>
    <el-carousel trigger="click" height="600px" indicator-position="outside"  type="card" autoplay >
      <el-carousel-item v-for="(item,index) in pic" :key="index">
       <img :src="item.url" alt="">
      </el-carousel-item>
    </el-carousel>
  </div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
     name: 'carrousel',
  data () {
    return {
  option:{},
 pic:[
     {url:require('../assets/hh1.jpg')},
      {url:require('../assets/hh2.jpeg')},
       {url:require('../assets/hh3.jpeg')},
        {url:require('../assets/weiixn.jpg')},
 ]
    
    
   
  }
  },
  methods:{
  
  },
  computed: {
     
  },
  mounted () {
     
    // echarts实例 
    var myChart = echarts.init(document.getElementById('main'));
    // 配置项和数据
   this.option = {
    backgroundColor: '#2c343c',

    title: {
        text: 'Customized Pie',
        left: 'center',
        top: 20,
        textStyle: {
            color: '#ccc'
        }
    },

    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
            colorLightness: [0, 1]
        }
    },
    series : [
        {
            name:'访问来源',
            type:'pie',
            radius : '55%',
            center: ['50%', '50%'],
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:274, name:'联盟广告'},
                {value:235, name:'视频广告'},
                {value:400, name:'搜索引擎'}
            ].sort(function (a, b) { return a.value - b.value; }),
            roseType: 'radius',
            label: {
                normal: {
                    textStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                }
            },
            itemStyle: {
                normal: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }
    ]
};
    //  使用刚指定的配置项和数据显示图表
    myChart.setOption(this.option);
  }
}
</script>
<style lang='less' scoped>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
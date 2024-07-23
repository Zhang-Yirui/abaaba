<template>
  <div class="app-container">
    <el-card style="margin-top: 40px">
      <el-row>
        <el-col :span="6">
          <el-statistic :value="salesTotal" title="总销售额统计"></el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic :value="commissionsTotal" title="总提成统计"></el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic :value="salesMonth" title="本月总销售额统计"></el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic :value="commissionsMonth" title="本月总提成统计"></el-statistic>
        </el-col>
      </el-row>
    </el-card>

    <!-- echarts柱形图 -->

    <div id="main" class="main_container" style="margin-top: 80px"></div>

  </div>
</template>

<script>
import { selectStatistics } from "@/api/orders/manage";
import * as echarts from 'echarts';

export default {
  name: "Statistic",
  data() {
    return {
      totalSales: 10000,
      totalCommission: 500,
      monthlySales: 3000,
      monthlyCommission: 200,
      salesTotal:'',
      commissionsTotal:'',
      salesMonth:'',
      commissionsMonth:'',
      salesMonthList:[],
      months: [],
      counts: [],
    };
  },
  mounted() {
    this.init();
  },
  created() {


  },
  methods: {

    init() {
      var that = this;
      selectStatistics().then(response => {
        this.salesTotal=response.data.salesTotal;
        this.commissionsTotal=response.data.commissionsTotal;
        this.salesMonth=response.data.salesMonth;
        this.commissionsMonth=response.data.commissionsMonth;
        response.data.salesMonthList.map(item=>{
          that.months.push(item.month);
          that.counts.push(item.salesAmount);
        })


        this.initCharts();
      });
    },

    initCharts() {
      var that = this;
      // 初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));
      // var myChart = this.$echarts.init(document.getElementById("main"));

      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        title: {
          text: "本年度月销售额统计",
        },
        xAxis: {
          type: 'category',
          data: that.months
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: that.counts,
            type: 'bar'
          }
        ]
      };
      myChart.setOption(option);
    },
  },

};
</script>
<!-- 柱形图3-->
<style lang="scss" scoped>
.main_container {
  width: 100%;
  height: 400px;
  overflow: hidden;
}
</style>

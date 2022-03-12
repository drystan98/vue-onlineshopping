<template>
  <div>

    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区-->
    <el-card>

      <!--搜索区-->
      <el-row>
        <el-col :span="8">
          <el-input @clear="getOrderList" clearable v-model="queryInfo.query" placeholder="请输入内容">
            <el-button @click="getOrderList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--展示区表格-->
      <el-table border stripe :data="orderList">
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <!--订单编号-->
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <!--订单价格-->
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <!--是否付款-->
        <el-table-column label="是否付款" prop="pay_status">
          <!--作用域插槽对tag标签进行渲染-->
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <!--是否发货-->
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <!--下单时间-->
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            <!--时间过滤-->
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <!--操作-->
        <el-table-column label="操作">
          <!--作用域插槽对操作选项进行渲染-->
          <template>
            <!--修改地址-->
            <el-button @click="showBox" size="mini" type="primary" icon="el-icon-edit"></el-button>
            <!--物流信息-->
            <el-button @click="showProgressBox" size="mini" type="success" icon="el-icon-location"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5,10,15,20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>

    <!--修改订单地址对话框-->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%">
      <!--修改地址表单-->
      <el-form
        @close="addressDialogClosed"
        :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <!--省市区/县联动菜单-->
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1" clearable>
          </el-cascader>
        </el-form-item>
        <!--详细地址-->
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
         <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--展示物流进度对话框-->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%">
      <!--时间线-->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">取 消</el-button>
         <el-button type="primary" @click="progressVisible = false">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
    // 导入省市联动的js
    import citydata from "./citydata";

    export default {
        name: "Order",

        data() {
            return {
                // 订单列表
                orderList: [],

                // 查询参数对象
                queryInfo: {
                    // 搜索选项
                    query: '',
                    // 当前页码
                    pagenum: 1,
                    // 每页显示的条数
                    pagesize: 10
                },

                // 总数量
                total: 0,

                // 控制修改地址对话框的显示与隐藏
                addressVisible: false,

                // 修改地址表单的对象
                addressForm: {
                    address1: [],
                    address2: ''
                },

                // 修改地址表单的校验对象
                addressFormRules: {
                    address1: [
                        {
                            required: true, message: '请选择一个省市区/县', trigger: 'blur'
                        }
                    ],
                    address2: [
                        {
                            required: true, message: '请输入详细地址', trigger: 'blur'
                        }
                    ]
                },

                // 导入的省市数据
                cityData: citydata,

                //
                progressVisible: false,

                // 物流进度数组
                // 因为查询物流对象的接口不好用所以直接赋值
                progressInfo: [
                    {
                        "time": "2018-05-10 09:39:00",
                        "ftime": "2018-05-10 09:39:00",
                        "context": "已签收,感谢使用顺丰,期待再次为您服务",
                        "location": ""
                    },
                    {
                        "time": "2018-05-10 08:23:00",
                        "ftime": "2018-05-10 08:23:00",
                        "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                        "location": ""
                    },
                    {
                        "time": "2018-05-10 07:32:00",
                        "ftime": "2018-05-10 07:32:00",
                        "context": "快件到达 [北京海淀育新小区营业点]",
                        "location": ""
                    },
                    {
                        "time": "2018-05-10 02:03:00",
                        "ftime": "2018-05-10 02:03:00",
                        "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                        "location": ""
                    },
                    {
                        "time": "2018-05-09 23:05:00",
                        "ftime": "2018-05-09 23:05:00",
                        "context": "快件到达 [北京顺义集散中心]",
                        "location": ""
                    },
                    {
                        "time": "2018-05-09 21:21:00",
                        "ftime": "2018-05-09 21:21:00",
                        "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                        "location": ""
                    },
                    {
                        "time": "2018-05-09 13:07:00",
                        "ftime": "2018-05-09 13:07:00",
                        "context": "顺丰速运 已收取快件",
                        "location": ""
                    },
                    {
                        "time": "2018-05-09 12:25:03",
                        "ftime": "2018-05-09 12:25:03",
                        "context": "卖家发货",
                        "location": ""
                    },
                    {
                        "time": "2018-05-09 12:22:24",
                        "ftime": "2018-05-09 12:22:24",
                        "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                        "location": ""
                    },
                    {
                        "time": "2018-05-08 21:36:04",
                        "ftime": "2018-05-08 21:36:04",
                        "context": "商品已经下单",
                        "location": ""
                    }
                ],


            }
        },

        created() {
            this.getOrderList()
        },

        methods: {

            /*获取订单列表*/
            async getOrderList() {
                // 发起查询请求
                const {data: res} = await this.$http.get(
                    `orders`,
                    {
                        params: this.queryInfo
                    }
                )
                if (res.meta.status !== 200) {
                    return this.$message.error('获取订单列表失败!')
                }
                this.orderList = res.data.goods
                this.total = res.data.total
            },

            /*监听pageszie改变的事件*/
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getOrderList()
            },

            /*监听pagenum的改变事件*/
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getOrderList()
            },

            /*展示修改地址的对话框*/
            showBox() {
                this.addressVisible = true
            },

            /*关闭对话框时触发的操作*/
            addressDialogClosed() {
                this.$refs.addressFormRef.resetFields()
            },

            /*展示物流进度对话框*/
            showProgressBox() {
                // this.getProgressInfo()
                this.progressVisible = true
            },

            /*获取物流进度*/
            async getProgressInfo() {
                const {data: res} = await this.$http.get(`/kuaidi/sadsdsd`)
                console.log(res)
                if (res.meta.status !== 200) {
                    return this.$message.error('获取物流进度失败!')
                }
                this.progressInfo = res.data
            }
        },

        computed: {}
    }
</script>

<style scoped>
  .el-cascader {
    width: 100%;
  }
</style>

<template>
  <div>

    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>

      <!--功能区-->
      <el-row :gutter="20">
        <!--搜索框-->
        <el-col :span="8">
          <el-input @clear="getGoodsList" clearable v-model="queryInfo.query" placeholder="请输入内容">
            <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <!--添加商品按钮-->
        <el-col :span="4">
          <!--通过路由导航跳转到添加商品的页面-->
          <el-button @click="goAddPage" type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <!--展示区表格-->
      <el-table border stripe :data="goodlist">
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <!--商品名称-->
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <!--商品价格-->
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <!--商品数量-->
        <el-table-column label="商品数量" prop="goods_number" width="70px"></el-table-column>
        <!--创建时间-->
        <el-table-column label="创建时间" width="140px">
          <template slot-scope="scope">
            <!--时间过滤-->
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <!--操作-->
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button @click="showEditDialog" size="mini" type="primary" icon="el-cion-edit">编辑</el-button>
            <el-button @click="removeById(scope.row.goods_id)" size="mini" type="danger" icon="el-cion-delete">删除
            </el-button>
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

    <!--编辑对话框-->
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="50%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
    export default {
        name: "List",
        data() {
            return {

                //商品参数信息
                goodlist: [],

                // 查询参数对象
                queryInfo: {
                    // 要输入的搜索关键字
                    query: '',
                    // 页码
                    pagenum: 1,
                    // 每页的数量
                    pagesize: 10
                },

                //商品总数量
                total: 0,

                // 控制编辑对话框的显示与隐藏
                editDialogVisible: false
            }
        },

        created() {
            //调用获取商品列表函数
            this.getGoodsList()
        },

        methods: {
            /*根据分页获取对应的商品列表*/
            async getGoodsList() {
                const {data: res} = await this.$http.get(
                    `goods`,
                    {
                        params: this.queryInfo
                    }
                )
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品列表失败!')
                }
                // 赋值商品列表
                this.goodlist = res.data.goods
                // 赋值总数量
                this.total = res.data.total

            },

            /*监听pageszie改变的事件*/
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getGoodsList()
            },

            /*监听pagenum的改变事件*/
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getGoodsList()
            },

            /*显示编辑对话框*/
            showEditDialog() {
                this.editDialogVisible = true
            },

            /*根据id删除对应的商品*/
            async removeById(id) {
                const confirmResult = await this.$confirm(
                    '此操作将永久删除该商品, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).catch(err => err)
                if(confirmResult !== 'confirm'){
                    return  this.$message.info('已取消删除')
                }
                const {data:res} = await this.$http.delete(`goods/${id}`)
                console.log(res)
                if(res.meta.status !== 200){
                    return this.$message.error('删除商品失败!')
                }
                this.$message.success('已成功删除商品!')
                this.getGoodsList()
            },

            /*跳转到指定路由页面*/
            goAddPage(){
                this.$router.push('/goods/add')
            }
        }
    }
</script>

<style scoped>

</style>

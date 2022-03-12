<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡牌视图-->
    <el-card>
      <!--按钮区域-->
      <el-row>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="showAddCateDialog">
            添加分类
          </el-button>
        </el-col>
      </el-row>

      <!--表格区域-->
      <tree-table
        style="margin-top: 15px"
        :show-row-hover="false"
        border
        index-text="#"
        :show-index="true"
        :expand-type="false"
        :selection-type="false"
        :data="catelist"
        :columns="columns"
      >
        <!--是否有效(模板作用域插槽按需渲染)-->
        <template slot="isok" slot-scope="scope">
          <i
            style="color: lightgreen;"
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"></i>
          <i
            style="color: lightcoral;"
            class="el-icon-error"
            v-else></i>
        </template>
        <!--排序(模板作用域插槽按需渲染)-->
        <template slot="order" slot-scope="scope">
          <el-tag
            size="mini"
            v-if="scope.row.cat_level === 0">
            一级
          </el-tag>
          <el-tag
            type="success"
            size="mini"
            v-if="scope.row.cat_level === 1">二级
          </el-tag>
          <el-tag
            type="warning"
            size="mini"
            v-if="scope.row.cat_level === 2">三级
          </el-tag>
        </template>
        <!--操作模板(模板作用域插槽按需渲染)-->
        <template
          slot="opt">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit">
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete">
            删除
          </el-button>
        </template>
      </tree-table>

      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3,5,10,15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--添加分类对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%">
      <!--添加分类的表单-->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px">
        <el-form-item
          label="分类名称"
          prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!--Cascader 级联选择器
        options：指定数据源parentCateList
        props:指定一个具体的配置对象cascaderProps
       -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="addCateDialogClosed">取 消</el-button>
        <el-button
          type="primary"
          @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "Cate",
        data() {
            return {

                // 查询分类数据列表的参数
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },

                // 商品分类数据列表
                catelist: [],

                //总数据条数
                total: 0,

                //为table指定列的定义
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name',
                        width: '400px',
                    },
                    {
                        label: '是否有效',
                        //当前列定义为模板列
                        type: 'template',
                        //当前这一列使用模板名称
                        template: 'isok',
                    },
                    {
                        label: '排序',
                        //当前列定义为模板列
                        type: 'template',
                        //当前这一列使用模板名称
                        template: 'order',
                    },
                    {
                        label: '操作',
                        //当前列定义为模板列
                        type: 'template',
                        //当前这一列使用模板名称
                        template: 'opt',
                        width: '200'
                    }
                ],

                //控制添加分类对话框显示与隐藏
                addCateDialogVisible: false,

                //添加分类的表单数据对象
                addCateForm: {
                    //分类名称
                    cat_name: '',
                    //父级分类id
                    cat_pid: 0,
                    //分类层级，默认一级分类
                    cat_level: 0

                },

                //添加分类表单的验证规则则对象
                addCateFormRules: {
                    cat_name: [
                        {
                            required: true, message: '请输入分类名称', trigger: 'blur'
                        },
                        {
                            min: 1, max: 10, message: '分类名称长度在1~10字符之间', trigger: 'blur'
                        }
                    ]
                },

                //父级分类列表
                parentCateList: [],

                //指定级联选择器的配置属性
                cascaderProps: {
                    //菜单的id,id不可重复
                    value: 'cat_id',
                    //菜单显示使用哪个属性
                    label: 'cat_name',
                    //指定父子嵌套使用哪个属性
                    children: 'children'
                    //其他属性值

                },

                // 选中的父类分类的id数组
                selectedKeys: []

            }
        },

        created() {

            // 获取分类列表
            this.getCateList()

        },

        methods: {

            /*获取分类列表*/
            async getCateList() {
                // 发起查询请求
                const {data: res} = await this.$http.get(
                    'categories',
                    {
                        params: this.queryInfo
                    }
                )
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg)
                }
                // 提示信息
                // this.$message.success(res.meta.msg)
                //把数据列表赋值给catelist
                this.catelist = res.data.result
                // 把总数据条数赋值给total
                this.total = res.data.total
            },

            /*监听pagesize改变的事件*/
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },

            /*监听pagenum的改变*/
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getCateList()
            },

            /*展示添加分类对话框*/
            showAddCateDialog() {
                //先获取父级分类的数据列表
                this.getParentCateList()
                //再展示对话框
                this.addCateDialogVisible = true
            },

            /*获取父级分类的数据列表*/
            async getParentCateList() {
                const {data: res} = await this.$http.get(
                    'categories',
                    {
                        params: {type: 2}
                    }
                )
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg)
                }
                this.parentCateList = res.data
            },

            /*选择项发生变化时触发函数*/
            parentCateChange() {
                if (this.selectedKeys.length > 0) {
                    // 父级分类id
                    this.addCateForm.cat_pid =
                        this.selectedKeys[this.selectedKeys.length - 1]
                    //为当前分类的等级赋值
                    this.addCateForm.cat_level =
                        this.selectedKeys.length
                    return
                } else {
                    // 父级分类id
                    this.addCateForm.cat_pid = 0
                    //为当前分类的等级赋值
                    this.addCateForm.cat_level = 0
                }
            },

            /*点击按钮添加新的分类*/
            addCate() {
                //1:验证表单是否正确?
                //validate回调函数
                this.$refs.addCateFormRef.validate(async valid => {
                    //验证失败直接return
                    if (!valid) return
                    // 验证成功向服务器发送post请求
                    // 参数直接传上面定义的对象addCateForm,它包含:
                    // cat_pid 分类父 ID,cat_name 分类名称,cat_level 分类层级
                    const {data: res} =
                        await this.$http.post('categories', this.addCateForm)
                    //判断返回状态
                    //!=201失败
                    if(res.meta.status !== 201){
                        return this.$message.error('添加分类失败!')
                    }
                    //成功插入,返回提示信息
                    this.$message.success('添加分类成功!')
                    //关闭对话框
                    this.addCateDialogVisible = false
                    //重新获取分类列表
                    this.getCateList()
                    //重置对话框
                    this.resetCateDialog()
                })
            },

            /*关闭对话框时的事件,重置表单数据*/
            addCateDialogClosed() {
                this.resetCateDialog()
                this.addCateDialogVisible = false
            },

            /*重置对话框*/
            resetCateDialog(){
                // 重置表单
                this.$refs.addCateFormRef.resetFields()
                //重置级联选择器
                this.selectedKeys = []
                this.addCateForm.cat_level = 0
                this.addCateForm.cat_pid = 0
            }

        }
    }
</script>

<style scoped>

  .el-cascader {
    width: 100%;
  }

</style>

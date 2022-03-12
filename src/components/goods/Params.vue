<template>
  <div>

    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <!--头部警告区-->
      <el-alert
        show-icon
        :closable="false"
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning">
      </el-alert>
      <!--选择商品分类区-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类</span>
          <!--选择商品分类的级联选择框-->
          <el-cascader
            clearable
            expandTrigger="hover"
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!--Tab页签区-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">

        <!--添加动态参数的面板-->
        <el-tab-pane label="动态参数" name="many">
          <!--添加参数按钮-->
          <el-button
            @click="addDialogVisible=true"
            :disabled="isBtnDisabled"
            type="primary"
            size="mini">
            添加参数
          </el-button>
          <!--动态参数表格-->
          <el-table
            :data="manyTableData"
            border
            stripe>
            <!--展开行-->
            <el-table-column type="expand">
              <!--作用域插槽接受该行数据-->
              <template slot-scope="scope">
                <!--循环创建tag标签-->
                <el-tag
                  closable
                  @close="handleClose(i,scope.row)"
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i">
                  {{item}}
                </el-tag>
                <!--输入文本框-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--添加按钮-->
                <el-button
                  v-else class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  type="primary" icon="el-icon-edit" size="mini">
                  编辑
                </el-button>
                <el-button
                  @click="removeParams(scope.row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!--添加静态属性的面板-->
        <el-tab-pane label="静态属性" name="only">
          <!--添加属性按钮-->
          <el-button
            @click="addDialogVisible=true"
            :disabled="isBtnDisabled"
            type="primary"
            size="mini">
            添加属性
          </el-button>
          <el-table
            :data="onlyTableData"
            border
            stripe>
            <!--展开行-->
            <el-table-column type="expand">
              <!--作用域插槽接受该行数据-->
              <template slot-scope="scope">
                <!--循环创建tag标签-->
                <el-tag
                  closable
                  @close="handleClose(i,scope.row)"
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i">
                  {{item}}
                </el-tag>
                <!--输入文本框-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--添加按钮-->
                <el-button
                  v-else class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini">
                  编辑
                </el-button>
                <el-button
                  @click="removeParams(scope.row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--添加参数的对话框-->
    <el-dialog
      @close="addDialogClosed"
      :title="'添加'+ titleText"
      :visible.sync="addDialogVisible"
      width="50%">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改参数对话框-->
    <el-dialog
      @close="editDialogClosed"
      :title="'修改'+ titleText"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogClosed">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "Params",

        data() {
            return {

                //商品分类列表
                catelist: [],

                //级联选择框配置对象
                cateProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },

                //级联选择框选择的选项id
                selectedCateKeys: [],

                //默认被激活的页签叶的名称
                activeName: 'many',

                // 动态数据源
                manyTableData: [],

                // 静态数据源
                onlyTableData: [],

                // 控制添加对话框的显示与隐藏
                addDialogVisible: false,

                //添加参数表单对象
                addForm: {
                    attr_name: ''
                },

                // 添加表单校验规则
                addFormRules: {
                    attr_name: [
                        {
                            required: true, message: '请输入参数名称!', trigger: 'blur'
                        }
                    ]
                },

                // 控制修改参数对话框的显示与隐藏
                editDialogVisible: false,

                //修改参数表单对象
                editForm: {
                    attr_name: ''
                },

                //修改参数表单验证对象
                editFormRules: {
                    attr_name: [
                        {
                            required: true, message: '请输入参数名称!', trigger: 'blur'
                        }
                    ]
                },

                // 控制按钮 与文本框的切换显示
                inputVisible: false,

                // 文本框中输入的内容
                inputValue: '',

                //
            }
        },

        created() {
            this.getCateList()
        },

        methods: {

            /*获取所有的商品分类列表*/
            async getCateList() {
                const {data: res} = await this.$http.get('categories')
                if (res.meta.status !== 200)
                    return this.$message.error('获取商品分类列表失败!')
                this.catelist = res.data
            },

            /*级联选择框选项变化触发函数*/
            async handleChange() {
                this.getParamsData()

            },

            /*Tab页签点击事件的处理函数*/
            handleTabClick() {
                this.getParamsData()
            },

            /*获取参数的列表数据*/
            async getParamsData() {
                //如果选中的不是三级分类就重置数组
                if (this.selectedCateKeys.length !== 3) {
                    this.selectedCateKeys = []
                    this.manyTableData = []
                    this.onlyTableData = []
                    return
                }
                // 根据所选分类的id和当前所处的面板获取对应的参数
                //参数id可以直接用 ${},
                //sel通过 only 或 many 来获取分类静态参数还是动态参数
                const {data: res} =
                    await this.$http.get(
                        `categories/${this.cateId}/attributes`,
                        {
                            params: {sel: this.activeName}
                        })

                if (res.meta.status !== 200) {
                    return this.$message.error('获取参数列表失败!')
                }
                console.log(res.data)
                // 循环遍历每一个attr_vals项
                res.data.forEach(item => {
                    // 要用三元表达式,当vals项为空时直接分隔会有问题
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                    // 控制文本框的显示与隐藏
                    item.inputVisible = false
                    // 文本框中输入的值
                    item.inputValue = ''
                })
                // 根据类型分类存储
                if (this.activeName === 'many') {
                    this.manyTableData = res.data
                } else {
                    this.onlyTableData = res.data
                }

            },

            /*监听添加参数对话框的关闭事件*/
            addDialogClosed() {
                // 关闭对话框时要重置表单
                this.$refs.addFormRef.resetFields()
                this.addDialogVisible = false
            },

            /*点击按钮添加参数*/
            addParams() {
                // 表单预先验证
                this.$refs.addFormRef.validate(async valid => {
                    // 验证失败直接返回
                    if (!valid) return
                    // 验证成功则发起请求
                    const {data: res} = await this.$http.post(
                        `categories/${this.cateId}/attributes`,
                        {
                            attr_name: this.addForm.attr_name,
                            attr_sel: this.activeName
                        })
                    //判断响应状态
                    //响应失败
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加失败,请重试!')
                    }
                    //响应成功
                    this.$message.success('添加成功!')
                    //重新获取数据
                    this.getParamsData()
                    //关闭对话框
                    this.addDialogVisible = false
                })
            },

            /*点击按钮展示修改对话框,并将原数据加载到输入框*/
            async showEditDialog(attr_id) {
                // 根据id查询参数
                //:id-->从计算属性中获得分类id
                //:attrId属性id-->从作用域插槽获取
                //attr_sel-->activeName查询当前参数信息
                //attr_vals-->可以没有
                const {data: res} = await this.$http.get(
                    `categories/${this.cateId}/attributes/${attr_id}`,
                    {
                        // 新的参数对象
                        params: {
                            attr_sel: this.activeName,
                        }
                    })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取参数失败!')
                }
                // 保存到editForm为以后的修改参数做准备
                this.editForm = res.data
                this.editDialogVisible = true
            },

            /*监听修改参数对话框的关闭事件*/
            editDialogClosed() {
                //重置表单对象
                this.$refs.editFormRef.resetFields()
                // 关闭对话框
                this.editDialogVisible = false
            },

            /*点击按钮修改参数*/
            editParams() {
                // 参数校验
                this.$refs.editFormRef.validate(async valid => {
                    // 校验失败直接返回
                    if (!valid) return
                    // 校验成功,发送"编辑提交参数"请求
                    // :attrId-->从editForm获取
                    const {data: res} = await this.$http.put(
                        `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                        {
                            attr_name: this.editForm.attr_name,
                            attr_sel: this.activeName
                        })
                    if (res.meta.status !== 200) {
                        return this.$message.error('修改参数失败!')
                    }
                    this.$message.success('修改参数成功!')
                    this.getParamsData()
                    this.editDialogVisible = false
                })
            },

            /* 删除参数*/
            async removeParams(attr_id) {
                // 弹框提示是否要删除
                const confirmResult = await this.$confirm(
                    '此操作将永久删除该参数, 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(err => err)

                // 用户取消此操作
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }
                //删除的业务逻辑
                const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除参数失败!')
                }
                this.getParamsData()
                this.$message.success('已删除参数!')
            },

            /*文本框失去焦点或者按下Enter键出发*/
            async handleInputConfirm(row) {
                //优化
                if (row.inputValue.trim().length === 0) {
                    row.inputValue = ''
                    row.inputVisible = false
                    return
                }
                // 如果没有return则证明输入的内容需要后续处理
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible = false
                //发起请求,保存
                this.saveAttrVals(row)

            },

            /*点击按钮切换文本输入框*/
            showInput(row) {
                row.inputVisible = true
                // 让文本框自动获得焦点
                // $nextTick方法作用:当页面上元素被重新渲染之后才会执行回调函数中的代码
                //
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            /*删除对应的参数可选项*/
            handleClose(i, row) {
                // splice删除数据
                row.attr_vals.splice(i, 1)
                this.saveAttrVals(row)
            },

            /*将对attr_vals保存到数据库*/
            async saveAttrVals(row) {
                // 发起请求保存操作
                const {data: res} = await this.$http.put(
                    `categories/${this.cateId}/attributes/${row.attr_id}`,
                    {
                        attr_sel: row.attr_sel,
                        attr_name: row.attr_name,
                        attr_vals: row.attr_vals.join(' ')
                    }
                )
                console.log(res)
                if (res.meta.status !== 200) {
                    return this.$message.error('修改参数项失败!')
                }
                this.$message.success('修改参数项成功!')

            }

        },

        //计算属性
        computed: {

            /*如果按钮需要禁用返回true,否则返回false*/
            isBtnDisabled() {
                if (this.selectedCateKeys.length !== 3) {
                    return true
                }
                return false
            },

            // 当前选择的三级分类id
            cateId() {
                if (this.selectedCateKeys.length === 3) {
                    return this.selectedCateKeys[2]
                }
                return null
            },

            // 动态计算标题文本
            titleText() {
                if (this.activeName === 'many')
                    return '动态参数'
                else
                    return '静态属性'
            },

            //
        }

    }
</script>

<style scoped>
  .cat_opt {
    margin: 15px 0;
  }

  .el-cascader {
    margin: 0 10px;
  }

  .el-tag {
    margin: 5px 5px;
  }

  .el-input {
    width: 120px
  }
</style>

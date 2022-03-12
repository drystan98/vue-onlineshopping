<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加区-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            clearable
            @clear="getUserList"
            placeholder="请输入内容"
            v-model="queryInfo.query">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!--用户列表区-->
      <el-table
        stripe
        border
        :data="userlist"
        style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <!--作用域插槽-->
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <!--{{scope.row}}-->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!--作用域插槽-->
        <el-table-column
          width="180px"
          label="操作">
          <template
            slot-scope="scope">
            <!--修改按钮-->
            <el-button
              @click="showEditDialog(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"></el-button>
            <!--删除按钮-->
            <el-button @click="removeUserById(scope.row.id)" type="danger" icon="el-icon-delete"
                       size="mini"></el-button>
            <!--分配角色-->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false">
              <el-button
                @click="setRole(scope.row)"
                type="warning"
                icon="el-icon-setting"
                size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--添加用户的对话框-->
    <el-dialog
      @close="addDialogClosed"
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <!--内容主体区域-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改用户信息对话框-->
    <el-dialog
      @close="editDialogClosed"
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--分配用户角色权限对话框-->
    <el-dialog
      @close="setRoleDialogClosed"
      title="分配角色权限"
      :visible.sync="setRoleDialogVisible"
      width="70%">
      <p>当前用户：{{userInfo.username}}</p>
      <p>当前角色：{{userInfo.role_name}}</p>
      <p>
        分配角色：
        <el-select
          v-model="selectedRoleId"
          placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span
        slot="footer"
        class="dialog-footer">
         <el-button
           @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "Users",
        data() {

            /*验证邮箱的自定义规则*/
            var checkEmail = (rule, value, cb) => {
                //验证邮箱的正则表达式
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if (regEmail.test(value)) {
                    //合法邮箱
                    return cb()
                }
                //验证失败时
                cb(new Error('请输入合法的邮箱'))
            }

            /*验证手机号的自定义规则*/
            var checkMobile = (rule, value, cb) => {
                //验证手机的正则表达式
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if (regMobile.test(value)) {
                    //合法手机号
                    return cb()
                }
                //不合法
                cb(new Error('请输入合法的手机号'))
            }

            return {
                // 获取用户列表的参数对象
                queryInfo: {
                    query: '',
                    // 当前页数
                    pagenum: 1,
                    // 当前每页显示多少条数据
                    pagesize: 5
                },

                //用户列表
                userlist: [],

                //总数
                total: 0,

                //控制添加用户的对话框的显示与隐藏
                addDialogVisible: false,

                // 添加用户的表单数据
                addForm: {
                    // 用户名
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },

                //添加表单的验证规则对象
                addFormRules: {
                    username: [
                        {
                            required: true, message: '请输入用户名', trigger: 'blur'
                        },
                        {
                            min: 3, max: 10, message: '用户名长度在3~10字符之间', trigger: 'blur'
                        }
                    ],
                    password: [
                        {
                            required: true, message: '请输入密码', trigger: 'blur'
                        },
                        {
                            min: 3, max: 10, message: '密码长度在3~10字符之间', trigger: 'blur'
                        }
                    ],
                    email: [
                        {
                            required: true, message: '请输入邮箱', trigger: 'blur'
                        },
                        {
                            validator: checkEmail, trigger: 'blur'
                        }
                    ],
                    mobile: [
                        {
                            required: true, message: '请输入手机号', trigger: 'blur'
                        },
                        {
                            validator: checkMobile, trigger: 'blur'
                        }
                    ]
                },

                //控制修改用户对话框的显示与隐藏
                editDialogVisible: false,

                // 查询到的用户信息对象
                editForm: {},

                //修改表单的验证规则对象
                editFormRules: {
                    email: [
                        {
                            required: true, message: '请输入邮箱', trigger: 'blur'
                        },
                        {
                            validator: checkEmail, trigger: 'blur'
                        }
                    ],
                    mobile: [
                        {
                            required: true, message: '请输入手机号', trigger: 'blur'
                        },
                        {
                            validator: checkMobile, trigger: 'blur'
                        }
                    ]
                },

                //控制分配角色对话框的显示与隐藏
                setRoleDialogVisible: false,

                // 需要被分配角色的用户信息
                userInfo: {},

                //角色列表
                roleList: [],

                // 已选择的角色
                selectedRoleId: ''
            }
        },

        /*生命周期函数*/
        created() {
            //发起请求
            this.getUserList()
        },

        methods: {

            /*获取用户列表*/
            async getUserList() {
                // 使用axios请求,包含一系列参数，这些参数params定义在queryInfo中
                const {data: res} = await this.$http.get('users', {params: this.queryInfo})
                if (res.meta.status !== 200) return this.$message.error('获取用户列表失败!')
                this.userlist = res.data.users
                this.total = res.data.total

                //console.log(res)
            },

            /*监听pagesize改变的事件*/
            handleSizeChange(newSize) {
                //console.log(newSize)
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },

            /*监听页码值改变的事件*/
            handleCurrentChange(newPage) {
                //console.log(newPage)
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },

            /*监听switch开关的改变*/
            async userStateChange(userinfo) {
                //console.log(userinfo)
                //调用改变状态的后端api接口
                const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
                //console.log(res)
                if (res.meta.status !== 200) {
                    // 失败时要取反，保证用户状态没有发生改变
                    userinfo.mg_state = !userinfo.mg_state
                    return this.$message.error('更新用户状态失败！')
                }
                this.$message.success('更新用户状态成功!')
            },

            /*监听添加用户对话框的关闭事件*/
            addDialogClosed() {
                this.$refs.addFormRef.resetFields();
            },

            /*添加用户时的校验*/
            addUser() {
                this.$refs.addFormRef.validate(async valid => {
                    // console.log(valid)
                    if (!valid) return
                    // 可以发起添加用户的网络请求
                    const {data: res} = await this.$http.post('users', this.addForm)
                    //非201添加失败
                    if (res.meta.status !== 201) {
                        this.$message.error('添加用户失败！')
                    }
                    //201添加成功
                    this.$message.success('添加用户成功！')
                    //添加成功时关闭对话框
                    this.addDialogVisible = false
                    //重新获取用户列表
                    this.getUserList()
                })
            },

            /*展示编辑用户的对话框*/
            async showEditDialog(id) {
                this.editDialogVisible = true
                // console.log(id)
                // 根据ID查询用户信息
                const {data: res} = await this.$http.get('users/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('查询用户信息失败！')
                }
                this.editForm = res.data
                this.editDialogVisible = true
            },

            /*监听修改用户对话框的关闭事件*/
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },

            /*修改用户信息并提交*/
            editUserInfo() {
                //提交前先校验
                this.$refs.editFormRef.validate(async valid => {
                    // console.log(valid)
                    //校验失败，直接返回
                    if (!valid) return
                    //校验成功，发起修改用户信息的数据请求
                    const {data: res} = await this.$http.put('users/' + this.editForm.id, {
                        email: this.editForm.email,
                        mobile: this.editForm.mobile
                    })
                    // 非200，修改失败，提示失败
                    if (res.meta.status !== 200) {
                        return this.$message.error('更新用户信息失败！')
                    }
                    //隐藏对话框，
                    this.editDialogVisible = false
                    //刷新用户列表
                    this.getUserList()
                    //提示修改成功
                    this.$message.success('修改用户数据成功！')
                })
            },

            /*根据id删除*/
            async removeUserById(id) {
                // console.log(id)
                //弹框询问用户是否删除
                await this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    // 删除请求
                    const {data: res} = await this.$http.delete('users/' + id)
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除用户失败！')
                    }
                    //刷新用户列表
                    this.getUserList()
                    //提示删除成功信息
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

                // 如果用户确认删除返回字符串confirm
                // 如果用户取消删除返回字符串cancle
                // console.log(confirmResult)
            },

            /*展示分配角色的对话框*/
            async setRole(userInfo) {
                //在展示对话框之前获取角色列表
                const {data: res} = await this.$http.get('roles')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取角色列表失败！')
                }
                this.roleList = res.data
                this.userInfo = userInfo
                this.setRoleDialogVisible = true

            },

            /*点击按钮分配角色*/
            async saveRoleInfo() {
                if (!this.selectedRoleId) {
                    return this.$message.warning('请选择要分配的角色！')
                }
                const {data: res} = await this.$http.put(
                    `users/${this.userInfo.id}/role`,
                    {
                        rid: this.selectedRoleId
                    }
                )
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.getUserList()
                this.setRoleDialogVisible = false
            },

            /*监听分配角色对话框的事件*/
            setRoleDialogClosed() {
                this.selectedRoleId = ''
                this.userInfo = {}
            },

            
        }
    }
</script>

<style scoped>

</style>

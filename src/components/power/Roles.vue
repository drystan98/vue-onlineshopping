<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card>
      <!--添加角色按钮区域-->
      <el-row>
        <el-col :span="4">
          <el-button type="primary">
            添加角色
          </el-button>
        </el-col>
      </el-row>

      <!--角色列表区域-->
      <el-table
        stripe
        border
        :data="rolelist">
        <!--展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!--<pre>{{scope.row}}</pre>-->
            <!--栅格系统布局-->
            <el-row
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom',i1 === 0 ? 'bdtop':'','vcenter'] ">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag
                  @close="removeRightById(scope.row,item1.id)"
                  closable>
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <!--通过for循环嵌套渲染二级权限-->
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '':'bdtop','vcenter']">
                  <el-col :span="6">
                    <el-tag
                      @close="removeRightById(scope.row,item2.id)"
                      closable
                      type="success">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      @close="removeRightById(scope.row,item3.id)"
                      closable
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      type="warning">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="180px">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          width="180px">
        </el-table-column>
        <el-table-column
          label="操作"
          width="300px">
          <template
            slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting"
                       @click="showSetRightDialog(scope.row)">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--分配权限对话框-->
    <el-dialog
      @close="setRightDialogClosed"
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%">
      <!--树形控件-->
      <el-tree
        ref="treeRef"
        :default-checked-keys="defKeys"
        default-expand-all
        node-key="id"
        show-checkbox
        :props="treeProps"
        :data="rightslist"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "Roles",

        data() {
            return {

                // 所有角色列表数据
                rolelist: [],

                //控制权限分配 对话框的显示与隐藏
                setRightDialogVisible: false,

                // 所有权限数据
                rightslist: [],

                // 树形对象绑定对象
                treeProps: {
                    label: 'authName', //节点用哪个属性命名
                    children: 'children'  //父子节点通过什么属性嵌套
                },

                // 默认选中的节点id值数组
                defKeys: [],

                //当前即将分配权限的角色
                roleId: ''
            }
        },

        created() {
            this.getRolesList()
        },

        methods: {

            /*获取所有角色列表*/
            async getRolesList() {
                const {data: res} = await this.$http.get('roles')
                if (res.meta.status !== 200) {
                    this.$message.error('获取角色列表失败！')
                }
                this.rolelist = res.data
            },

            /*根据id删除对应权限*/
            async removeRightById(role, rightId) {
                // 弹窗提示是否删除
                const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('取消了删除！')
                }
                const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除权限失败！')
                }
                role.children = res.data
            },

            /*通过递归的形式，获取角色下所有三级权限的id并保存到数组中*/
            getLeafKeys(node, arr) {
                //如果当前node节点不包含children属性，则是三级节点
                if (!node.children) {
                    return arr.push(node.id)
                }
                //递归
                node.children.forEach(item => this.getLeafKeys(item, arr))
            },

            /*展示分配权限对话框*/
            async showSetRightDialog(role) {
                this.roleId = role.id
                // 调用api获取所有权限数据
                const {data: res} = await this.$http.get('rights/tree')
                if (res.meta.status !== 200) {
                    this.$message.error('获取权限数据失败！')
                }
                // 把获取到的权限数据保存到data中
                this.rightslist = res.data
                // 递归获取三级节点id
                this.getLeafKeys(role, this.defKeys)
                this.setRightDialogVisible = true
            },

            /*监听分配权限对话框的关闭事件*/
            setRightDialogClosed() {
                this.defKeys = []
            },

            /*点击为角色分配权限*/
            async allotRights() {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedNodes()
                ]
                const idStr = keys.join(',')
                const {data: res} =
                    await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
                if (res.meta.status !== 200) {
                    return this.$message.error('分配权限失败！')
                }
                this.$message.success('分配权限成功！')
                this.getRolesList()
                this.setRightDialogVisible = false
            }
        }
    }
</script>

<style scoped>

  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }


</style>

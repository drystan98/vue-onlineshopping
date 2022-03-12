<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡牌视图-->
    <el-card>
      <!--数据表格-->
      <el-table
        stripe
        border
        :data="rightsList">
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <!--数据列-->
        <el-table-column
          prop="authName"
          label="权限名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
          width="180">
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级"
          width="180">
          <!--作用域插槽定义权限等级格式-->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>

    </el-card>


  </div>
</template>

<script>
    export default {
        name: "Rights",
        data() {
            return {
                /*权限列表*/
                rightsList: []
            }
        },
        created() {
            this.getRightsList()
        },
        methods: {
            /*获取权限列表*/
            async getRightsList() {
                const {data: res} = await this.$http.get('rights/list')
                // console.log(res)
                if (res.meta.status !== 200) {
                    return this.$message.error('获取权限列表失败！')
                }
                //将获取的数据挂载到权限列表rightsList[]
                this.rightsList = res.data
            }
        }
    }

</script>

<style lang="less" scoped>

</style>

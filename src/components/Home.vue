<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体区-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--侧边栏菜单区-->
        <el-menu
          :default-active="activePath"
          :router="true"
          :collapse-transition="false"
          :collapse="isCollapse"
          :unique-opened="true"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF">
          <!--一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!--一级菜单模板区-->
            <template slot="title">
              <!--图标-->
              <i :class="iconsObj[item.id]"></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item
              :index="'/'+subItem.path+''"
              v-for="subItem in item.children" :key="subItem.id"
              @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧主体-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    export default {
        data() {
            return {
                //左侧菜单数据
                menulist: [],
                iconsObj: {
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
                },
                //  是否折叠
                isCollapse: false,
                // 被激活的链接地址
                activePath: ''
            }
        },
        created() { //生命周期函数
            this.getMenuList();
            this.activePath = window.sessionStorage.getItem('activePath');
        },
        name: "Home",
        methods: {
            logout() {
                // 清空token
                window.sessionStorage.clear();
                // 跳转到登录页
                this.$router.push('/login');
            },
            // 获取所有菜单
            async getMenuList() {
                // 请求获取列表
                const {data: res} = await this.$http.get('menus');
                // 控制台打印 res
                // console.log(res);
                // 失败
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                // 成功
                this.menulist = res.data;
            },
            // 点击按钮，切换菜单的折叠与展开
            toggleCollapse() {
                this.isCollapse = !this.isCollapse;
            },
            //保存连接的激活状态
            saveNavState(activePath) {
                window.sessionStorage.setItem('activePath', activePath);
                this.activePath = activePath;
            }
        }
    }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #ffffff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border-right: 0px;
    }
  }

  .el-main {
    background-color: #EAEDF1;
  }

  .iconfont {
    margin-right: 10px;
  }

  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;

  }
</style>


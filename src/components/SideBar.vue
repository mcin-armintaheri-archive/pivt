<template>
  <div class="sidebar-container">
    <el-row class="sidebar-layout">
      <el-col class="sidebar-menu" v-bind:class="sidebarShow" :span="22">
        <el-menu default-active="2"  class="sidebar-menu" theme="dark">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>Navigator One</template>
            <el-menu-item-group title="Group One">
              <el-menu-item index="1-1">item one</el-menu-item>
              <el-menu-item index="1-2">item one</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group Two">
              <el-menu-item index="1-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">item four</template>
              <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="2"><i class="el-icon-menu"></i>Navigator Two</el-menu-item>
          <el-menu-item index="3"><i class="el-icon-setting"></i>Navigator Three</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="1">
        <div class="sidebar-toggle" v-on:click="toggleSideBar">
          <i v-bind:class="toggled ? 'el-icon-caret-left' : 'el-icon-caret-right'"></i>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'sidebar',
  props: ['sidebar-widgets'],
  data() {
    return { toggled: true };
  },
  computed: {
    sidebarShow() {
      return {
        'sidebar-menu': true,
        'sidebar-hide': !this.toggled,
      };
    },
  },
  methods: {
    toggleSideBar() {
      this.toggled = !this.toggled;
    },
  },
};
</script>

<!-- TODO: use dropshadow to give "on top" look -->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sidebar-layout {
  width: 100%;
  height: 100%;
}
.sidebar-menu {
  height: 100%;
}
.sidebar-hide {
  display: none;
}
.sidebar-container {
  position: relative;
  min-width: 300px;
  max-width: 500px;
  width: 40%;
  height: 100%;
}
.sidebar-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 60px;
  background-color: #999;
}
</style>

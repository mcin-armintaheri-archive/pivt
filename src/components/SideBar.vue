<template>
  <div class="sidebar-container">
    <el-row class="sidebar-layout">
      <el-col class="sidebar-menu" v-bind:class="sidebarShow" :span="22">
        <el-menu default-active="2"  class="sidebar-menu" theme="dark">
          <div class="add-app-button-container">
            <el-button class="add-app-button" v-if="threeMount" type="primary" @click="newApplicationEvent">
              <i class="el-icon-plus"></i>&nbsp;&nbsp;&nbsp;New Application
            </el-button>
            <el-button class="add-app-button" v-else="threeMount" type="primary" :loading="true">
              Loading
            </el-button>
          </div>
          <el-submenu v-for="sidebarwidget in sidebarWidgets" v-bind:key="sidebarwidget.name" index="1">
            <template slot="title">{{ sidebarwidget.sidebarWidget.name }}: </template>
              <el-menu-item  class="widget-container" index="1">
                <sidebar-widget v-bind:widget-controller="sidebarwidget"></sidebar-widget>
              </el-menu-item>
          </el-submenu>
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
import SidebarWidget from '@/components/SidebarWidget';

export default {
  name: 'sidebar',
  components: {
    'sidebar-widget': SidebarWidget,
  },
  props: ['sidebar-widgets', 'three-mount'],
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
    newApplicationEvent() {
      this.$emit('new-application', {});
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
  z-index: 1;
  position: absolute;
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
.widget-container {
  padding-top: 50px;
}
.add-app-button {
  width: 100%;
  height: 55px;
}
.add-app-button-container {
  margin: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

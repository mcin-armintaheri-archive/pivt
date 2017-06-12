<template>
  <div class="sidebar-container">
    <el-row class="sidebar-layout">
      <el-col class="sidebar-menu" v-bind:class="sidebarShow" :span="22">
        <el-menu default-active="2"  class="sidebar-menu" theme="dark" unique-opened>
          <div class="add-app-button-container">
            <el-button class="add-app-button" v-if="threeMount" type="primary" @click="newApplication">
              <i class="el-icon-plus"></i>&nbsp;&nbsp;&nbsp;New Application
            </el-button>
            <el-button class="add-app-button" v-else="threeMount" type="primary" :loading="true">
              Loading
            </el-button>
          </div>
          <el-submenu
            v-for="(application, idx) in applications"
            :key="idx"
            :index="String(idx)"
          >
            <template slot="title">{{ application.getName() + ' ' + idx }}</template>
            <application-sidebar-widgets
              v-bind:application="application"
              v-bind:appIndex="idx"
            >
            </application-sidebar-widgets>
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
import ApplicationSidebarWidgets from '@/components/ApplicationSidebarWidgets';

export default {
  name: 'sidebar',
  components: {
    'sidebar-widget': SidebarWidget,
    'application-sidebar-widgets': ApplicationSidebarWidgets,
  },
  props: ['applications', 'three-mount'],
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
    newApplication() {
      this.$emit('new-application');
    },
    switchApplication(application) {
      this.$emit('switch-application', application);
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
  overflow-y: auto;
  pointer-events: all;
  height: 100%;
}
.sidebar-hide {
  display: none;
}
.sidebar-container {
  pointer-events: none;
  z-index: 1;
  position: absolute;
  min-width: 300px;
  max-width: 500px;
  width: 40%;
  height: 100%;
}
.sidebar-toggle {
  pointer-events: all;
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

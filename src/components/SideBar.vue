<template>
  <div class="sidebar-container">
    <el-row class="sidebar-layout">
      <el-col class="sidebar-menu" v-bind:class="sidebarShow" :span="22">
        <el-menu
          default-active="2"
          class="sidebar-menu"
          theme="dark"
          unique-opened
          @open="startApplication"
        >
          <div class="button-container">
            <el-button class="sidebar-button" type="primary" @click="newApplication">
              <i class="el-icon-plus"></i>&nbsp;&nbsp;&nbsp;New Application
            </el-button>
          </div>
          <div class="button-container">
            <el-button class="sidebar-button" type="primary" @click="$emit('show-buffer-list')">
              <i class="el-icon-upload2"></i>&nbsp;&nbsp;&nbsp;File Buffer List
            </el-button>
          </div>
          <div class="button-container">
            <el-button class="sidebar-button" type="primary" @click="$emit('show-workspace-load')">
              <icon name="upload"></icon>&nbsp;&nbsp;&nbsp;Load Workspace<br />(Ctrl+O)
            </el-button>
            <el-button class="sidebar-button" type="primary" @click="$emit('show-workspace-save')">
              <icon name="download"></icon>&nbsp;&nbsp;&nbsp;Save Workspace<br />(Ctrl+S)
            </el-button>
          </div>
          <div class="app-menu-scroll">
            <el-submenu
              v-for="(application, idx) in applications"
              :key="idx"
              :index="String(idx)"
            >
              <template slot="title">
                <div class="app-collapse">
                  <div>
                    <span class="app-name">{{ application.getName() }}</span>
                    <span class="edit-button" @click="editAppName($event, application)">
                      <icon name="pencil"></icon>
                    </span>
                  </div>
                  <div class="app-collapse-controls">
                    <el-button type="primary" @click="killApplication($event, application)">
                      <i class="el-icon-close"></i>Remove
                    </el-button>
                  </div>
                </div>
              </template>
              <application-sidebar-widgets
                v-bind:application="application"
                v-bind:appIndex="idx"
              >
              </application-sidebar-widgets>
            </el-submenu>
          </div>
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

/**
 * sidebar renders components responsible for creating a new application,
 * loading files from the client's filesystem, and interacting with
 * the currently instantiated applications.
 * @type {String}
 */
export default {
  name: 'sidebar',
  components: {
    'sidebar-widget': SidebarWidget,
    'application-sidebar-widgets': ApplicationSidebarWidgets,
  },
  props: ['applications', 'three-mount'],
  mounted() {
    window.addEventListener('keydown', (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (String.fromCharCode(event.which).toLowerCase() === 's') {
          this.$emit('show-workspace-save');
          event.preventDefault();
        }
      }
      return false;
    });
  },
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
    editAppName(event, application) {
      event.stopPropagation();
      this.$prompt('Enter a name for the running application.', 'Info', {
        confirmButtonText: 'Done',
        cancelButtonText: 'Cancel',
      }).then((res) => {
        application.setName(res.value);
      }).catch(() => {});
    },
    toggleSideBar() {
      this.toggled = !this.toggled;
    },
    newApplication() {
      this.$emit('new-application');
    },
    killApplication(event, application) {
      event.stopPropagation();
      this.$confirm('Are you sure you want to remove this application?', 'Info', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'info',
      }).then(() => {
        this.$emit('remove-application', application);
        this.$message({
          type: 'success',
          message: 'Application removed.',
        });
      }).catch(() => {});
    },
    startApplication(index) {
      this.$emit('start-application', index);
    },
  },
};
</script>

<!-- TODO: use dropshadow to give "on top" look -->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.workspace-input {
  display: none;
}
.sidebar-container {
  pointer-events: none;
  z-index: 3;
  position: fixed;
  width: 470px;
  min-height: 100%;
}
.sidebar-layout {
  width: 100%;
  height: 100%;
}
.sidebar-menu {
  overflow-y: hidden;
  pointer-events: all;
  height: 100%;
}
.app-menu-scroll {
  height: calc(100vh - 285px);
  overflow-y: auto;
}
.sidebar-hide {
  display: none;
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
.sidebar-button {
  width: 100%;
  height: 55px;
}
.button-container {
  margin: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.app-collapse {
  display: flex;
  justify-content: space-between;
}
.app-collapse-controls {
  margin-right: 20px;
}
.app-name {
  margin-right: 10px;
}
.edit-button {
  border-radius: 5px;
  padding: 4px 8px;
  padding-top: 10px;
}
.edit-button:hover {
  background-color: #678;
}
</style>

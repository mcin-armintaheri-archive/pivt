<template>
  <div class="container">
    <sidebar
      v-bind:applications="appManager.currentApplications"
      v-on:new-application="appSelectDialog = true"
      v-on:remove-application="removeSelectedApplication"
      v-on:start-application="startSelectedApplication"
      v-on:show-buffer-list="showBufferList = true"
      v-on:show-workspace-save="showWorkspaceSave = true"
      v-on:show-workspace-load="$refs.loadInput.$el.querySelector('.add-file-input').click()"
    >
    </sidebar>
    <floating-window-manager v-bind:applications="appManager.currentApplications">
    </floating-window-manager>
    <app-component
      v-for="(application, idx) in appManager.currentApplications"
      :style="`visibility: ${application.isRunning ? 'visible' : 'hidden'}`"
      :key="application.uid"
      :application="application"
    >
    </app-component>
    <el-dialog
      title="Select an application to run!"
      :visible.sync="appSelectDialog"
      size="small"
    >
      <application-select
        v-bind:options="applications"
        v-on:applicationSelect="loadSelectedApplication"
      >
      </application-select>
      <span slot="footer">
        <el-button @click="appSelectDialog = false">Cancel</el-button>
      </span>
    </el-dialog>
    <add-buffer :show-dialog.sync="showBufferList">
    </add-buffer>
    <save-workspace :show-dialog.sync="showWorkspaceSave">
    </save-workspace>
    <load-workspace ref="loadInput"></load-workspace>
  </div>
</template>

<script>
import R from 'ramda';

import SideBar from '@/components/SideBar';
import ThreeView from '@/components/ThreeView';
import AppComponent from '@/components/AppComponent';
import ApplicationSelect from '@/components/ApplicationSelect';
import BufferManagerWidget from '@/components/BufferManagerWidget';
import AddBuffer from '@/components/AddBuffer';
import SaveWorkspace from '@/components/SaveWorkspace';
import LoadWorkspace from '@/components/LoadWorkspace';
import FloatingWindowManager from '@/components/FloatingWindowManager';
import ApplicationManager from '@/extensions/ApplicationManager';
import BufferManager from '@/extensions/BufferManager';

const appManager = ApplicationManager.getInstance();

export default {
  name: 'visualizer',
  components: {
    sidebar: SideBar,
    threeview: ThreeView,
    'app-component': AppComponent,
    'application-select': ApplicationSelect,
    'add-buffer': AddBuffer,
    'save-workspace': SaveWorkspace,
    'load-workspace': LoadWorkspace,
    'buffer-manager-widget': BufferManagerWidget,
    'floating-window-manager': FloatingWindowManager
  },
  mounted() {
    if (window.initializationHandler instanceof Function) {
      window.initializationHandler(ApplicationManager, BufferManager, this.$message);
    }
  },
  data() {
    return {
      appManager,
      appSelectDialog: false,
      showBufferList: false,
      showWorkspaceSave: false
    };
  },
  computed: {
    applications() {
      return R.values(ApplicationManager.APPLICATION_TYPES);
    }
  },
  methods: {
    loadSelectedApplication(application) {
      this.appSelectDialog = false;
      appManager.loadApplication(application);
    },
    removeSelectedApplication(application) {
      appManager.removeApplication(application);
      if (appManager.getApplications().length > 0) {
        appManager.startApplication(appManager.getApplication(0));
      }
    },
    startSelectedApplication(index) {
      appManager.startApplication(appManager.getApplication(index));
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  overflow: hidden;
  margin: 0;
  min-height: 100vh;
  min-width: 100vw;
}
</style>

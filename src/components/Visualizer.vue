<template>
  <div class="container">
    <sidebar
      v-bind:applications="currentApplications"
      v-on:new-application="appSelectDialog = true"
      v-on:remove-application="removeApplication"
      v-on:start-application="startApplication"
      v-on:show-buffer-list="showBufferList = true"
    >
    </sidebar>
    <floating-window-manager v-bind:applications="currentApplications">
    </floating-window-manager>
    <app-component
      v-for="(application, idx) in currentApplications"
      :style="`visibility: ${application.isRunning ? 'visible' : 'hidden'}`"
      :key="idx"
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
  </div>
</template>

<script>
import SideBar from '@/components/SideBar';
import ThreeView from '@/components/ThreeView';
import AppComponent from '@/components/AppComponent';
import ApplicationSelect from '@/components/ApplicationSelect';
import BufferManagerWidget from '@/components/BufferManagerWidget';
import AddBuffer from '@/components/AddBuffer';
import FloatingWindowManager from '@/components/FloatingWindowManager';
import ApplicationManager from '@/extensions/ApplicationManager';

import BrainSlicer from '@/applications/BrainSlicer';
import EEGViewer from '@/applications/EEGViewer';


const appManager = new ApplicationManager();

const APPLICATIONS = [BrainSlicer, EEGViewer];

const appCount = {};

export default {
  name: 'visualizer',
  components: {
    sidebar: SideBar,
    threeview: ThreeView,
    'app-component': AppComponent,
    'application-select': ApplicationSelect,
    'add-buffer': AddBuffer,
    'buffer-manager-widget': BufferManagerWidget,
    'floating-window-manager': FloatingWindowManager,
  },
  data() {
    return {
      currentApplications: [],
      appSelectDialog: false,
      showBufferList: false,
    };
  },
  computed: {
    applications() {
      return APPLICATIONS;
    },
  },
  methods: {
    onThreeViewMounted({ element, renderer }) {
      this.threeViewMountPoint = element;
      this.threeRenderer = renderer;
    },
    loadSelectedApplication(application) {
      this.appSelectDialog = false;
      if (!appCount[application.name]) {
        appCount[application.name] = 0;
      }
      const app = appManager.create(
        appCount[application.name],
        application,
      );
      appCount[application.name] += 1;
      if (this.currentApplications.length === 0) {
        setTimeout(app.run.bind(app), 100); // Run the application after it loads.
      }
      this.currentApplications.push(app);
    },
    removeApplication(application) {
      application.dispose();
      this.currentApplications = this.currentApplications.filter(a => a !== application);
    },
    startApplication(index) {
      this.currentApplications.forEach((a) => { a.stop(); });
      this.currentApplications[index].run();
    },
  },
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

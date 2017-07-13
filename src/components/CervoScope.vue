<template>
  <div class="container">
    <sidebar
      v-bind:applications="runningApplications"
      v-bind:three-mount="threeViewMountPoint !== null"
      v-on:new-application="appSelectDialog = true"
      v-on:remove-application="removeApplication"
      v-on:start-application="startApplication"
      v-on:show-buffer-list="showBufferList = true"
    >
    </sidebar>
    <floating-window-manager v-bind:applications="runningApplications">
    </floating-window-manager>
    <vue-component-view v-bind:applications="runningApplications">
    </vue-component-view>
    <threeview v-on:threeViewMounted="onThreeViewMounted">
    </threeview>
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
import VueComponentView from '@/components/VueComponentView';
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
  name: 'cervo-scope',
  components: {
    sidebar: SideBar,
    threeview: ThreeView,
    'vue-component-view': VueComponentView,
    'application-select': ApplicationSelect,
    'add-buffer': AddBuffer,
    'buffer-manager-widget': BufferManagerWidget,
    'floating-window-manager': FloatingWindowManager,
  },
  data() {
    return {
      threeViewMountPoint: null,
      threeRenderer: null,
      runningApplications: [],
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
      // TODO: make ApplicationManager a singleton.
      this.appSelectDialog = false;
      if (!appCount[application.name]) {
        appCount[application.name] = 0;
      }
      const app = appManager.create(
        appCount[application.name],
        this.threeViewMountPoint,
        this.threeRenderer,
        application,
      );
      appCount[application.name] += 1;
      if (this.runningApplications.length === 0) {
        app.run();
      }
      this.runningApplications.push(app);
    },
    removeApplication(application) {
      application.dispose();
      this.runningApplications = this.runningApplications.filter(a => a !== application);
    },
    startApplication(index) {
      this.runningApplications.forEach((a) => { a.stop(); });
      this.runningApplications[index].run();
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

<template>
  <div class="container">
    <sidebar
      v-bind:sidebar-widgets="[]"
      v-bind:three-mount="threeViewMountPoint !== null"
      v-on:new-application="appSelectDialog = true"
    >
    </sidebar>
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
  </div>
</template>

<script>
import SideBar from '@/components/SideBar';
import ThreeView from '@/components/ThreeView';
import ApplicationSelect from '@/components/ApplicationSelect';
import ApplicationManager from '@/extensions/ApplicationManager';

const appManager = new ApplicationManager();

const brainSlicer = {
  name: 'BrainSlicer',
  scene: 'OrthoPlanes',
  layout: 'XYZPerspectiveQuadView',
  tools: [
    'PixpipeShader',
  ],
  mediators: [],
};

const APPLICATIONS = [brainSlicer];

export default {
  name: 'cervo-scope',
  components: {
    sidebar: SideBar,
    threeview: ThreeView,
    'application-select': ApplicationSelect,
  },
  data() {
    return {
      threeViewMountPoint: null,
      runningApplications: [],
      appSelectDialog: false,
    };
  },
  computed: {
    applications() {
      return APPLICATIONS;
    },
  },
  methods: {
    onThreeViewMounted(container) {
      this.threeViewMountPoint = container;
    },
    loadSelectedApplication(application) {
      this.appSelectDialog = false;
      const app = appManager.create(this.threeViewMountPoint, application);
      app.run();
      this.runningApplications.push(app);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  overflow: hidden;
  margin: 0;
  height: 100vh;
  width: 100vw;
}
</style>

<template>
  <div class="container">
    <sidebar
      v-bind:applications="runningApplications"
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
    'CurveTool',
  ],
  mediators: [],
};

const APPLICATIONS = [brainSlicer];

function S4() {
  /* eslint-disable no-bitwise */
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group

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
      const guid = (
        `${S4()}${S4()}-${S4()}-4${S4().substr(0, 3)}-${S4()}-${S4()}${S4()}${S4()}`
      ).toLowerCase();
      this.appSelectDialog = false;
      const app = appManager.create(this.threeViewMountPoint, application);
      app.uid = guid;
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

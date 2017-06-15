<template>
  <div class="container">
    <sidebar
      v-bind:applications="runningApplications"
      v-bind:three-mount="threeViewMountPoint !== null"
      v-on:new-application="appSelectDialog = true"
      v-on:show-buffer-list="showBufferList = true"
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
    <el-dialog
      title="Active Buffers"
      :visible.sync="showBufferList"
      size="small"
    >
      <buffer-manager-widget>
      </buffer-manager-widget>
      <span slot="footer">
        <el-button @click="showAddBuffer = true">Add</el-button>
        <el-button @click="showBufferList = false">Cancel</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Select a file on your computer."
      :visible.sync="showAddBuffer"
      size="tiny"
    >
      <add-buffer
        v-on:new-file-loading="addBufferLoading = true"
        v-on:new-file-added="newFileAddedHandler"
      >
      </add-buffer>
      <span slot="footer">
        <el-button @click="showAddBuffer = false" :loading="addBufferLoading">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar';
import ThreeView from '@/components/ThreeView';
import ApplicationSelect from '@/components/ApplicationSelect';
import BufferManagerWidget from '@/components/BufferManagerWidget';
import AddBuffer from '@/components/AddBuffer';
import ApplicationManager from '@/extensions/ApplicationManager';

const appManager = new ApplicationManager();

const brainSlicer = {
  name: 'BrainSlicer',
  scene: 'OrthoPlanes',
  layout: 'XYZPerspectiveQuadView',
  tools: [
    {
      name: 'contrast',
      tool: 'CurveTool',
    },
    {
      name: 'materialManager',
      tool: 'PlanesMaterialManager',
    },
  ],
  mediators: [
    {
      mediator: 'OrthoPlanesShaderInjector',
      dependencies: ['scene', 'layout', 'materialManager'],
    },
    {
      mediator: 'QuadViewXYZLayers',
      dependencies: ['scene', 'layout', 'materialManager'],
    },
    {
      mediator: 'OrthoPlanesContrastSettings',
      dependencies: ['contrast', 'materialManager'],
    },
    {
      mediator: 'QuadViewXYZPlaneShifter',
      dependencies: ['scene', 'layout', 'materialManager'],
    },
  ],
};

const APPLICATIONS = [brainSlicer];

export default {
  name: 'cervo-scope',
  components: {
    sidebar: SideBar,
    threeview: ThreeView,
    'application-select': ApplicationSelect,
    'add-buffer': AddBuffer,
    'buffer-manager-widget': BufferManagerWidget,
  },
  data() {
    return {
      threeViewMountPoint: null,
      runningApplications: [],
      appSelectDialog: false,
      showBufferList: false,
      showAddBuffer: false,
      addBufferLoading: false,
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
      // TODO: make ApplicationManager a singleton.
      this.appSelectDialog = false;
      const app = appManager.create(this.threeViewMountPoint, application);
      app.run();
      this.runningApplications.push(app);
    },
    newFileAddedHandler() {
      this.addBufferLoading = false;
      this.showAddBuffer = false;
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

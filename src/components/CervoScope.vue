<template>
  <div class="container">
    <sidebar
      v-bind:sidebar-widgets="sidebarWidgets"
      v-bind:three-mount="threeViewMountPoint !== null"
      v-on:new-application="newApplication"
    >
    </sidebar>
    <threeview v-on:threeViewMounted="onThreeViewMounted">
    </threeview>
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
  },
  data() {
    return {
      threeViewMountPoint: null,
      runningApplications: [],
    };
  },
  computed: {
    sidebarWidgets() {
      return [];
    },
  },
  methods: {
    onThreeViewMounted(container) {
      this.threeViewMountPoint = container;
    },
    loadSelectedApplication(application) {
      const app = appManager.create(this.threeViewMountPoint, application);
      app.run();
      this.runningApplications.push(app);
    },
    newApplication() {
      let selected = null;
      const applicationSelect = (application) => {
        selected = application;
      };
      this.$msgbox({
        title: 'Select an application',
        message: this.$createElement(ApplicationSelect, {
          props: {
            options: APPLICATIONS,
            selected: this.selectedApplication,
          },
          on: { applicationSelect },
        }),
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Load',
      }).then((action) => {
        if (action === 'confirm') {
          this.loadSelectedApplication(selected);
        }
      });
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

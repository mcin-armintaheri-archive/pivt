<template>
  <div class="container" v-if="controller.showAddMeshButton">
    <el-row>
      <el-col>
        <el-button class="load-button" @click="showMeshAdd = true" type="primary">
          <i class="el-icon-caret-top"></i>&nbsp;Add Mesh (MNI .OBJ)
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-for="(m, i) in controller.meshes">
        <div class="overlay-name-container">
          <div class="overlay-name">File Name: {{m.name}}</div>
          <div class="overlay-buttons">
            <el-button type="primary" @click="controller.toggleOctants(i)">
              Toggle Octant
            </el-button>
            <el-button type="primary" @click="controller.removeMesh(i)">
              Remove
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="Select a MNI .OBJ Mesh to view."
      :visible.sync="showMeshAdd"
      size="small"
      :modal.boolean="false"
    >
      <buffer-manager-widget v-on:select-buffer="loadMesh">
      </buffer-manager-widget>
      <span slot="footer">
        <el-button @click="showMeshAdd = false">Cancel</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Please wait! Loading the Mesh."
      :visible.sync="showLoading"
      size="tiny"
      :modal.boolean="false"
      :show-close.boolean="false"
      :close-on-press-escape.boolean="false"
      :close-on-click-modal.boolean="false"
    >
      <h2><icon name="spinner" spin></icon> Loading</h2>
    </el-dialog>
  </div>
</template>

<script>
import BufferManager from '@/extensions/BufferManager';
import BufferManagerWidget from '@/components/BufferManagerWidget';

const buffermanager = BufferManager.getInstance();
/**
 * The sidebar button for opening the controls window.
 */
export default {
  name: 'mni-mesh-sidebar-widget',
  components: {
    'buffer-manager-widget': BufferManagerWidget
  },
  props: ['controller'],
  data() {
    return {
      showLoading: false,
      showMeshAdd: false
    };
  },
  methods: {
    loadMesh(uid) {
      this.showMeshAdd = false;
      this.showLoading = true;
      setTimeout(() => {
        this.controller.addMeshFromBuffer(buffermanager.getBuffer(uid))
          .then(() => { this.showLoading = false; });
      }, 100); // Timeout for the ui to show loading modal.
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.overlay-name-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 15px;
  height: 40px;
  color: #fff;
}
.overlay-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>

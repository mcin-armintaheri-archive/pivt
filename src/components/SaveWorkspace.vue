<template>
    <el-dialog
      title="Included Files"
      :visible.sync="showWorkspaceSave"
      size="small"
    >
      <h4>Applications:</h4>
      <el-checkbox-group class="item-checkbox-group" v-model="appChecklist">
        <el-checkbox
          v-for="app in appManager.getApplications()"
          :label="app.getName()"
          :key="app.getName()"
          @change="checkboxChangeApp(app, $event)"
        ></el-checkbox>
      </el-checkbox-group>
      <h4>File Buffers:</h4>
      <el-checkbox-group class="item-checkbox-group" v-model="bufferChecklist">
        <el-checkbox
          v-for="(buffer, idx) in bufferManager.getBufferList()"
          :label="`${idx}. ${buffer.name}`"
          :key="buffer.checksum + idx"
          @change="checkboxChangeBuffer(buffer, $event)"
        ></el-checkbox>
      </el-checkbox-group>
      <span slot="footer">
        <el-button @click="saveWorkspace">Save</el-button>
        <el-button @click="showWorkspaceSave = false">Cancel</el-button>
      </span>
    </el-dialog>
</template>

<script>
import R from 'ramda';
import ApplicationManager from '@/extensions/ApplicationManager';
import BufferManager from '@/extensions/BufferManager';

const appManager = ApplicationManager.getInstance();
const bufferManager = BufferManager.getInstance();

export default {
  name: 'save-workspace',
  props: ['showDialog'],
  data() {
    return {
      appManager,
      bufferManager,
      showWorkspaceSave: this.showDialog,
      appChecklist: [],
      checkedApps: {},
      bufferChecklist: [],
      checkedBuffers: {},
    };
  },
  methods: {
    saveWorkspace() {
      const apps = R.values(this.checkedApps).map(a => a.serialize());
      const buffers = bufferManager.serialize(R.values(this.checkedBuffers));
      this.showWorkspaceSave = false;
      return { apps, buffers };
    },
    checkboxChangeApp(app, event) {
      if (event.target.checked) {
        this.checkedApps[app.getUid()] = app;
        return;
      }
      delete this.checkedApps[app.getUid()];
    },
    checkboxChangeBuffer(buffer, event) {
      if (event.target.checked) {
        this.checkedBuffers[buffer.checksum] = buffer;
        return;
      }
      delete this.checkedBuffers[buffer.checksum];
    },
  },
  watch: {
    showDialog() {
      this.showWorkspaceSave = this.showDialog;
    },
    showWorkspaceSave() {
      this.$emit('update:showDialog', this.showWorkspaceSave);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item-checkbox-group {
  display: flex;
  flex-direction: column;
}
.el-checkbox {
  margin: 0 20px;
}
</style>

<template>
    <el-dialog
      title="Included Files"
      :visible.sync="showWorkspaceSave"
      size="small"
    >
      <h4>Applications:</h4>
      <el-checkbox-group class="item-checkbox-group" v-model="appChecklist">
        <el-checkbox
          v-for="(app, idx) in appManager.getApplications()"
          :label="`${idx}. ${app.getName()}`"
          :key="app.getName()"
          checked
          @change="checkboxChangeApp(app, $event)"
        ></el-checkbox>
      </el-checkbox-group>
      <h4>File Buffers:</h4>
      <el-checkbox-group class="item-checkbox-group" v-model="bufferChecklist">
        <el-checkbox
          v-for="(buffer, idx) in bufferManager.getBufferList()"
          :label="`${idx}. ${buffer.name}`"
          :key="buffer.checksum + idx"
          checked
          @change="checkboxChangeBuffer(buffer, $event)"
        ></el-checkbox>
      </el-checkbox-group>
      <span slot="footer">
        <el-button @click="saveWorkspace">Save</el-button>
        <el-button @click="showWorkspaceSave = false">Cancel</el-button>
      </span>
      <a class="workspace-download"></a>
    </el-dialog>
</template>

<script>
import R from 'ramda';
import { PixBinEncoder } from 'pixbincodec';
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
      checkedApps: [],
      bufferChecklist: []
    };
  },
  beforeUpdate() {
    this.checkedApps = R.fromPairs(appManager.getApplications().map(a => [a.getUid(), a]));
    this.checkedBuffers = R.fromPairs(bufferManager.getBufferList().map(b => [b.checksum, b]));
  },
  methods: {
    saveWorkspace() {
      const apps = {
        _metadata: { type: 'applications' },
        _data: R.values(this.checkedApps).map(a => a.serialize())
      };
      const buffers = bufferManager.serialize(R.values(this.checkedBuffers));
      this.showWorkspaceSave = false;
      const encoder = new PixBinEncoder();
      encoder.setOption('madeWith', 'PIVT');
      encoder.addInput(apps);
      encoder.addInput(buffers);
      encoder.run();
      const workspaceBuffer = encoder.getOutput();
      const link = this.$el.querySelector('.workspace-download');
      const blob = new Blob([workspaceBuffer], { type: 'octet/stream' });
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      this.$prompt('Enter a file name', 'Save Workspace', {
        confirmButtonText: 'Done',
        cancelButtonText: 'Cancel'
      }).then((res) => {
        const filename = res.value;
        if (filename.match(/^.*\.pixb/)) {
          link.download = filename;
        } else {
          link.download = `${filename}.pixb`;
        }
        link.click();
        this.$message({
          type: 'success',
          message: 'Workspace saved!'
        });
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: 'Workspace saving cancelled'
        });
      });
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
    }
  },
  watch: {
    showDialog() {
      this.showWorkspaceSave = this.showDialog;
    },
    showWorkspaceSave() {
      this.$emit('update:showDialog', this.showWorkspaceSave);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.workspace-download {
  display: none;
}
.item-checkbox-group {
  display: flex;
  flex-direction: column;
}
.el-checkbox {
  margin: 0 20px;
}
</style>

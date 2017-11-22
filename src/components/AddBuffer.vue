<template>
    <el-dialog
      title="Active Buffers"
      :visible.sync="showBufferList"
      size="small"
    >
      <buffer-manager-widget>
      </buffer-manager-widget>
      <input multiple type="file" class="add-file-input" @change="addFiles($event.target)"/>
      <span slot="footer">
        <el-button @click="$el.querySelector('.add-file-input').click()">Add</el-button>
        <el-button @click="$emit('update:showDialog', false)">Cancel</el-button>
      </span>
      <el-dialog
        title="Loading file"
        :visible.sync="addBufferLoading"
        size="tiny"
        :modal="false"
      >
        Please wait. <icon name="spinner" spin></icon>
      </el-dialog>
    </el-dialog>
</template>

<script>
import R from 'ramda';
import BufferManagerWidget from '@/components/BufferManagerWidget';
import BufferManager from '@/extensions/BufferManager';

const buffermanager = BufferManager.getInstance();

export default {
  name: 'add-buffer',
  components: {
    'buffer-manager-widget': BufferManagerWidget
  },
  props: ['showDialog'],
  data() {
    return {
      fileInput: null,
      showBufferList: this.showDialog,
      addBufferLoading: false
    };
  },
  /* If showDialog changes, update showBufferList.
   * If showBufferList changes, update showDialog prop.
   */
  watch: {
    showDialog() {
      this.showBufferList = this.showDialog;
    },
    showBufferList() {
      this.$emit('update:showDialog', this.showBufferList);
    }
  },
  methods: {
    /**
     * When the file input changes, emit a vue-event containing the file
     * reference as payload.
     * @param {[FILE]} file The file reference taken from the input.
     */
    addFiles(input) {
      // TODO: Kind of specific to add a volume for a general buffer adder.
      this.addBufferLoading = true;
      const ps = R.values(input.files).map((file) => {
        const asText = file.name.endsWith('.obj');
        return buffermanager.loadBuffer(file, asText);
      });
      Promise.all(ps).then(() => {
        this.addBufferLoading = false;
        /* eslint-disable no-param-reassign */
        input.value = '';
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.add-file-input {
  display: none;
}
</style>

<template>
  <el-table
    class="buffer-table"
    v-bind:data="labeledBuffers"
    empty-text="There are no buffers."
    @row-click="selectBuffer"
    v-bind:row-style="{cursor: 'pointer'}"
  >
    <el-table-column prop="filename" label="Filename">
    </el-table-column>
    <el-table-column prop="size" label="Size">
    </el-table-column>
  </el-table>
</template>

<script>
// TODO: search bar for buffers.
import BufferManager from '@/extensions/BufferManager';

const filesize = require('file-size');

const buffermanager = BufferManager.getInstance();

/**
 * buffer-manager-widget renders a list of the currently
 * loaded files uploaded by the user. By default it
 * emits a select-buffer event when a file is clicked.
 */
export default {
  name: 'buffer-manager-widget',
  mounted() {
    buffermanager.onBufferLoad(() => {
      this.loadedBuffers = buffermanager.getBufferList();
    });
  },
  data() {
    return {
      loadedBuffers: buffermanager.getBufferList(),
    };
  },
  computed: {
    /**
     * For each loaded buffer create an objects holding the
     * filename, size, and uid of the file. This object
     * is used as the row attributes in the file table.
     * @return {[Array]} list of row attributes of all the loaded buffers.
     */
    labeledBuffers() {
      return this.loadedBuffers.map(buffer => ({
        filename: buffer.name,
        size: filesize(buffer.size).human(),
        uid: buffer.uid,
      }));
    },
  },
  methods: {
    /**
     * If a buffer is selected, emit the uid of the buffer to the
     * parent componenet.
     * @param  {[Object]} row attributes of the clicked file
     */
    selectBuffer(row) {
      this.$emit('select-buffer', row.uid);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.buffer-table {
  width: 100%;
}
</style>

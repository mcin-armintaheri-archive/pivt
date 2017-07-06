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
    labeledBuffers() {
      return this.loadedBuffers.map(buffer => ({
        filename: buffer.name,
        size: filesize(buffer.size).human(),
        uid: buffer.uid,
      }));
    },
  },
  methods: {
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

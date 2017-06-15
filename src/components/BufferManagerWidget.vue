<template>
  <el-table
    class="buffer-table"
    v-bind:data="labeledBuffers"
    empty-text="There are no buffers."
    @row-click="selectBufferEvent"
  >
    <el-table-column prop="filename" label="Filename">
    </el-table-column>
    <el-table-column prop="size" label="Size">
    </el-table-column>
  </el-table>
</template>

<script>
const filesize = require('file-size');

export default {
  name: 'buffer-manager-widget',
  props: ['showBufferList', 'buffers'],
  computed: {
    labeledBuffers() {
      return this.buffers.map(buffer => ({
        filename: buffer.name,
        size: filesize(buffer.size).human(),
        uid: buffer.uid,
      }));
    },
  },
  methods: {
    selectBufferEvent(row) {
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
.el-table__row {
  cursor: pointer;
}
</style>

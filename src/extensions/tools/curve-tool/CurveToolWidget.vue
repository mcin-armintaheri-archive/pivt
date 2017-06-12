<template>
  <div class="container">
    <el-row>
      <el-col :span="24" class="curve-tool-mount">
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-dropdown @command="setType" trigger="click">
          <el-button type="primary">
            Spline Type: {{ splineType }}<i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="natural">Natural</el-dropdown-item>
            <el-dropdown-item command="monotonic">Monotonic</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'curve-tool-widget',
  props: ['controller'],
  mounted() {
    this.controller.initialize(this.$el.querySelector('.curve-tool-mount'));
    this.controller.getSpliner().setSplineType('monotonic');
  },
  data() {
    return { splineType: 'Monotonic' };
  },
  methods: {
    setType(type) {
      this.splineType = type;
      this.splineType = (
        this.splineType[0].toUpperCase() +
        this.splineType.slice(1, this.splineType.length)
      );
      this.controller.getSpliner().setSplineType(type);
      this.controller.getSpliner().draw();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

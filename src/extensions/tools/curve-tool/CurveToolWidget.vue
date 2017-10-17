<template>
  <div class="container">
    <div class="widget-title">
      <h3>{{ this.controller.title }}</h3>
    </div>
    <el-row>
      <el-col :span="12" class="curve-tool-mount">
      </el-col>
      <el-col :span="12">
        <brightness v-bind:controller="controller"></brightness>
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
import Brightness from './Brightness';
/**
 * curve-tool-widget renders the CanvasSpliner's DOM element
 * and allows the user to change the type of the spline.
 */
export default {
  name: 'curve-tool-widget',
  components: {
    brightness: Brightness
  },
  props: ['controller'],
  mounted() {
    this.controller.initialize(this.$el.querySelector('.curve-tool-mount'));
  },
  data() {
    return {};
  },
  methods: {
    setType(type) {
      this.splineType = type;
      this.splineType = (
        this.splineType[0].toUpperCase() +
        this.splineType.slice(1, this.splineType.length)
      );
      this.controller.setSplineType(type);
    }
  },
  computed: {
    splineType() {
      const splineType = this.controller.splineType;
      return (
        splineType[0].toUpperCase() +
        splineType.slice(1, splineType.length)
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

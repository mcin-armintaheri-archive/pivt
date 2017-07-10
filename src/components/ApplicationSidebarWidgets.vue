<template>
  <div>
    <div
      class="sidebar-widget-container"
      v-for="(tool, idx) in application.getTools()"
      v-if="tool.sidebarWidget"
      :key="appIndex + '-' + idx"
    >
      <sidebar-widget
        v-bind:widget-controller="tool"
      >
      </sidebar-widget>
    </div>
  </div>
</template>

<script>
import SidebarWidget from '@/components/SidebarWidget';

/**
 * application-sidebar-widgets renders all the widgets
 * associated with a specific tool running in the application.
 * The widgets are rendered in the order the tool is defined
 * in the application's JSON description.
 * The component is given the instance of the running application
 * and its index in the creation order of the applications.
 */
export default {
  name: 'application-sidebar-widgets',
  components: {
    'sidebar-widget': SidebarWidget,
  },
  props: ['application', 'appIndex'],
  data() {
    return {};
  },
};
</script>

<style scoped>
.sidebar-widget-container {
  margin-top: 10px;
  padding: 5px;
}
</style>

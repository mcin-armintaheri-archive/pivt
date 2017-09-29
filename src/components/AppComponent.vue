<template>
  <div v-bind:class="sidebarShow">
    <application-page :application="application">
    </application-page>
  </div>
</template>

<script>
import ApplicationPage from '@/components/ApplicationPage';

export default {
  name: 'app-component',
  components: {
    'application-page': ApplicationPage
  },
  props: ['application', 'showSidebar'],
  computed: {
    sidebarShow() {
      return {
        'app-component': true,
        'sidebar-showing': this.showSidebar,
        fullscreen: this.application.getPageController().getPageConfig().fullScreen
      };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app-component {
  overflow: hidden;
  position: absolute;
  z-index: 0;
}
.app-component.sidebar-showing {
  margin-left: 431px;
}
.app-component.fullscreen {
  width: 100vw;
  height: 100vh;
}
.app-component.fullscreen.sidebar-showing {
  width: calc(100vw - 431px);
}
</style>

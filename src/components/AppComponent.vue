<template>
  <div class="app-component">
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
  props: ['application']
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app-component {
  overflow: hidden;
  position: absolute;
  z-index: 0;
}
</style>

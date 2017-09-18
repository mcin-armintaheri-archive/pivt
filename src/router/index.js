import Vue from 'vue';
import Router from 'vue-router';
import Visualizer from '@/components/Visualizer';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Visualizer',
      component: Visualizer
    }
  ]
});

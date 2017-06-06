import Vue from 'vue';
import Router from 'vue-router';
import CervoView from '@/components/CervoScope';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CervoView',
      component: CervoView,
    },
  ],
});

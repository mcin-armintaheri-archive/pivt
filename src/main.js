// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import Icon from 'vue-awesome/components/Icon';
import App from './App';
import router from './router';

require('element-ui/lib/theme-default/index.css');
require('vue-awesome/icons');

Vue.use(ElementUI);
Vue.component('icon', Icon);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});

import Vue from 'vue';
import App from './App.vue';
import VueSwal from 'vue-swal';
import VueTippy, { TippyComponent } from 'vue-tippy';

Vue.use(VueSwal);
// Vue.use(VueTippy, {
//   directive: 'tippy', // => v-tippy
//   flipDuration: 0,
//   popperOptions: {
//     modifiers: {
//       preventOverflow: {
//         enabled: true,
//       },
//     },
//   },
// });
Vue.use(VueTippy);
Vue.component('tippy', TippyComponent);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');

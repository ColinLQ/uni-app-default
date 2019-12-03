import { Vue } from 'vue-property-decorator';
import './filters'
import App from './App'

import buttonFixedBottom from '@/components/button-fixed-bottom';
import customCheckbox from '@/components/custom-checkbox';
import actionSheet from '@/components/action-sheet';
import authorizeBtn from '@/components/authorize-btn';
import loadMore from '@/components/load-more';


Vue.component('load-more', loadMore);
Vue.component('button-fixed-bottom', buttonFixedBottom);
Vue.component('custom-checkbox', customCheckbox);
Vue.component('action-sheet', actionSheet);
Vue.component('authorize-btn', authorizeBtn);

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()

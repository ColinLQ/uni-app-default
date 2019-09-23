import { Vue } from 'vue-property-decorator';
import './filters'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()

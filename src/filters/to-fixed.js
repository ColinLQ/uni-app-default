import { Vue } from 'vue-property-decorator';

Vue.filter('toFixed', function (number, length = 2) {
  return Number(number).toFixed(length);
})

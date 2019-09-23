import { Vue } from 'vue-property-decorator';
import dayjs from 'dayjs';

Vue.filter('formatTime', (time, str = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) return '';
  const m = dayjs(time)
  return m.isValid() ? m.format(str) : time
})

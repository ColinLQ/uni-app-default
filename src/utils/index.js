import Vue from 'vue'
import _ from 'lodash'
import { fly } from './fly';
import autoLoading from './auto-loading';
import showToast from './show-toast'
import getCurrentPage from './get-current-page'
import { goBack, goHome, redirect } from './nav';
import sleep from './sleep';

Vue.prototype.$fly = fly
Vue.prototype.$get = _.get

export {
  fly,
  autoLoading,
  showToast,
  getCurrentPage,
  goBack,
  goHome,
  redirect,
  sleep,
}

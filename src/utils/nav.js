import _ from 'lodash';

export function goHome() {
  uni.reLaunch({ url: '/pages/home' });
}

const debouncedRedirect = _.debounce((url) => uni.redirectTo({ url }), 150)

export function redirect(url) {
  debouncedRedirect(url);
}

export function goBack() {
  const pages = getCurrentPages();
  const canBack = pages.length > 1;
  canBack ? uni.navigateBack({ fail: goHome  }) : goHome();
}

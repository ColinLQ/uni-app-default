import _ from 'lodash';

export const tabPages = _.get(__wxConfig, 'tabBar.list', []).map(item => '/' + item.pagePath.replace('.html', ''))

export function getCurrentPage() {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
}

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

export function isTabPage(url = getCurrentPage().route) {
  const reg = new RegExp(url);
  return !!tabPages.find(item => reg.test(item));
}

export function nav(url) {
  if (!url) {
    return goHome();
  }
  const navType = isTabPage(url) ? 'switchTab' : 'navigateTo';
  uni[navType]({ url });
}

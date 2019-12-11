import { SimpleStore } from './helper';

class UiStore extends SimpleStore {
  systemInfo = uni.getSystemInfoSync() || {}

  async fetchData() {
    // 可能不同页面拿到的信息不一致（比如tab页的windowHeight和非tab页的windowHeight）
    this.systemInfo = await uni.getSystemInfo('user')
    return this.systemInfo;
  }

  tryFetchData() {
    // 可能不同页面拿到的信息不一致（比如tab页的windowHeight和非tab页的windowHeight）
    if (JSON.stringify(this.systemInfo) === '{}') {
      return this.fetchData()
    }
  }

  get isIphoneX() {
    const { screenHeight, screenWidth, model } = this.systemInfo;
    return model.toUpperCase().indexOf('IPHONE X') !== -1 || (this.isIOS && (screenHeight / screenWidth === 2436 / 1125));
  }

  get isIOS() {
    const { platform } = this.systemInfo;
    if (platform) {
      return platform.toUpperCase() === 'IOS';
    } else {
      return false;
    }
  }
}

export const uiStore = UiStore.create();

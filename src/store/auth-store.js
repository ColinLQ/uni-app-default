import { SimpleStore } from './helper';
import { fly } from '@/utils';
import _ from 'lodash'

const TOKEN_KEY = 'token';

export class AuthStore extends SimpleStore {
  token = '';
  name = ''
  avatar = ''
  account

  constructor() {
    super();
    this.init();
  }

  async init() {
    this.token = await this.getToken();
  }

  async fetchData() {
    return this.mergeFetched(fly.get('user'))
  }

  async destroyUser() {
    await fly.delete('user');
    await this.login({ force: true });
    return this.fetchData();
  }

  async checkUserInfo() {
    await this.tryFetchData();
    if (!this.name) {
      uni.navigateTo({ url: '/pages/get-user-info' })
      return false;
    }
    if (!_.get(this.account, 'phone')) {
      uni.navigateTo({ url: '/pages/bind/phone' })
      return false;
    }
    return true;
  }

  updateUser(body = {}) {
    return this.mergeFetched(fly.put('user', body));
  }

  async updatePhone(body = {}) {
    const url = _.get(this.account, 'phone') ? 'user/update_phone' : 'user/binding_phone';
    await fly.put(url, body);
    return this.fetchData();
  }

  saveToken(token) {
    this.token = token;
    uni.setStorage({
      key: TOKEN_KEY,
      data: token
    });
  }

  removeToken() {
    this.token = '';
    uni.removeStorageSync(TOKEN_KEY);
  }

  async getToken() {
    let token = this.token;
    if (token) {
      return token;
    }
    try {
      const { data } = await uni.getStorage({ key: TOKEN_KEY });
      token = data;
    } catch (e) {
      token = '';
    }
    return token;
  }

  async login({ force = false } = {}) {
    if (!force) {
      const token = await this.getToken();
      if (token) {
        return;
      }
    }
    const { code } = await uni.login();
    let app_type;
    // #ifdef MP-WEIXIN
      app_type = 'WechatUser'
    // #endif
    // #ifdef MP-ALIPAY
      app_type = 'AlipayUser'
    // #endif
    const { data: { access_token } } = await fly.post('user/auth', { code, app_type });
    this.saveToken(access_token);
  }
}

export const authStore = new AuthStore();

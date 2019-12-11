import { SimpleStore } from './helper';

// scope 对照表
const scopeList = {
  getLocation: 'scope.userLocation',
  chooseLocation: 'scope.userLocation',
  startLocationBackground: 'scope.userLocationBackground',
  chooseAddress: 'scope.address',
  chooseInvoiceTitle: 'scope.invoiceTitle',
  chooseInvoice: 'scope.invoice',
  getWeRunData: 'scope.werun',
  startRecord: 'scope.record',
  saveVideoToPhotosAlbum: 'scope.writePhotosAlbum',
  saveImageToPhotosAlbum: 'scope.writePhotosAlbum',
}

export class AuthorizeStore extends SimpleStore {
  scopeAuthorize = { // 记录哪些权限是被拒绝，拒绝后为 openSetting
    getLocation: false,
    chooseLocation: false,
    startLocationBackground: false,
    chooseAddress: false,
    chooseInvoiceTitle: false,
    chooseInvoice: false,
    getWeRunData: false,
    startRecord: false,
    saveVideoToPhotosAlbum: false,
    saveImageToPhotosAlbum: false,
  }

  checkList = { // 记录检查过的权限
    getLocation: false,
    chooseLocation: false,
    startLocationBackground: false,
    chooseAddress: false,
    chooseInvoiceTitle: false,
    chooseInvoice: false,
    getWeRunData: false,
    startRecord: false,
    saveVideoToPhotosAlbum: false,
    saveImageToPhotosAlbum: false,
  }

  // 检查是否打开对应权限
  async checkScope(name) {
    const scope = scopeList[name];
    // 没有检查过，才检查，避免同一页面，使用相同权限，弹出多次弹窗
    if (scope && !this.checkList[name]) {
      try {
        this.checkList[name] = true;
        await uni.authorize({ scope });
      } catch (e) {
        this.scopeAuthorize[name] = 'openSetting';
      }
    }
  }

  updateScopeAuthorize(name, value) {
    this.scopeAuthorize[name] = value;
  }

  getScope(name) {
    return scopeList[name]
  }
}

export const authorizeStore = AuthorizeStore.create();

import Fly from 'flyio/dist/npm/fly'
import EngineWrapper from 'flyio/dist/npm/engine-wrapper'
import { authStore } from '@/store';
import { apiConfig } from '@/constants'
import showToast from './show-toast'
import _ from 'lodash'
import decoder from './decoder'

function adapter(request, responseCallback) {
  uni.request({
    method: request.method,
    url: request.url,
    dataType: request.dataType || undefined,
    header: request.headers,
    data: request.body || {},
    success(res) {
      responseCallback({
        statusCode: res.statusCode,
        responseText: res.data,
        headers: res.header,
        statusMessage: res.errMsg,
      })
    },
    fail(res) {
      responseCallback({
        responseText: res.data,
        statusCode: res.statusCode || 0,
        statusMessage: res.errMsg
      })
    },
  })
}


let loginPending = false;
let loginPromise = null;

async function handleLogin() {
  !loginPending && (loginPromise = authStore.login({ force: true }));
  loginPending = true;
  try {
    await loginPromise;
  } finally {
    /* eslint-disable-next-line */
    loginPending = false;
  }
}

async function handleAuth(url, options = {}, method) {
  const maxRetry = 5;
  let retry = 0;

  const fn = async() => {
    retry ++;
    if (retry >= maxRetry) {
      throw new Error('登录失败');
    }

    try {
      await handleLogin();
      return await fly[method.toLocaleLowerCase()](url, options);
    } catch (e) {
      if ((e.message || '').startsWith('ignore')) {
        throw e;
      }
      return fn();
    }
  }

  return fn();
}

const fly = new Fly(EngineWrapper(adapter))

fly.config.baseURL = `${apiConfig.apiUrl}`;
fly.config.timeout = 15000

fly.interceptors.request.use(async req => {
  const token = await authStore.getToken();
  req.headers.Authorization = token;
  req.headers['Content-Type'] = 'application/json';

  // 兼容支付宝小程序只能是 get和post 请求
  // #ifdef MP-ALIPAY
  const method = req.method;
  if (method !== 'GET' && method !== 'POST') {
    req.headers['REAL-METHOD'] = method;
    req.method = 'POST'
  }
  // #endif

  return req;
})

fly.interceptors.response.use(
  res => {
    res['isResponse'] = true
    res.meta = {}
    _.forEach(res.headers, (v, k) => {
      v = res.headers[k] = [].concat(v)[0]
      if (/^x-/i.test(k)) {
        const key = _.snakeCase(k.replace(/^x-/i, ''))
        res.meta[key] = decoder(v)
      }
    })
    return res
  },
  err => {
    const { error_message, messages, error, code } = _.get(err, 'response.data', {})
    const newMessage = error_message || messages || error || err.message;

    if (err.status === 401) {
      const { url, body, method } = err.request
      return handleAuth(url, body, method)
    } else if (err.status === 412) {
      uni.navigateTo({ url: '/pages/bind/phone', complete: () => showToast('请先绑定手机') });
      err.message = 'ignore' + newMessage
      err.api_code = code
    } else {
      err.message = newMessage
      err.api_code = code
    }
    return err
  }
)

export { fly }

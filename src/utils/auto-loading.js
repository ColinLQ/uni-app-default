import _ from 'lodash'

const ignoreErrors = /(cancel|ignore|请先登录)/i

async function loading(target, title = '加载中', retry = _.get(this, 'retry', false)) {
  uni.showLoading({
    title, mask: true
  })

  const action = Promise.resolve(target instanceof Function ? target() : target)

  return action
    .finally(uni.hideLoading)
    .catch(err => {
      const msg = err.message || ''
      if (!ignoreErrors.test(msg)) {
        if (retry) {
          uni.showModal({
            title: '请求失败',
            content: msg,
            cancelText: '取消',
            confirmText: '重试',
            success: res => {
              if (res.confirm) loading.call(this, ...arguments)
            }
          })
        } else {
          msg && uni.showModal({
            title: '请求失败',
            content: msg,
            showCancel: false,
            confirmText: '确定',
          })
        }
      }
      throw err
    })
}

function loadingDecorator({ title, retry = _.get(this, 'retry') } = {}) {
  return function (target, name, descriptor) {
    const func = descriptor.value
    descriptor.value = function () {
      return loading(() => func.apply(this, arguments), title, retry)
    }
  }
}

export default function autoLoading(...args) {
  if (args[0] instanceof Promise || args[0] instanceof Function) {
    return loading.call(this, ...args)
  } else if (args.length === 3) {
    return loadingDecorator.call(this)(...args)
  } else {
    return loadingDecorator.call(this, args[0])
  }
}

autoLoading.retry = function () {
  return autoLoading.apply({ retry: true }, arguments)
}

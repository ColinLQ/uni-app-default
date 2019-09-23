// 处理 uni-app promise 错误处理
module.exports = function (source) {
  const code = `
  function handlePromise(promise) {
    return promise;
  }
  `
  return source.replace('function handlePromise', code + 'function handlePromise2')
}

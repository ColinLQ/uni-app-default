export default function(params) {
  if (!params) { throw new Error('title is not defined') }
  const defaultParams = {
    title: '',
    icon: 'none',
    mask: true,
    duration: 1500
  }
  const newParams = typeof params === 'string' ? { title: params } : params;
  return uni.showToast(Object.assign({}, defaultParams, newParams));
}

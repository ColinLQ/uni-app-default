import { SimpleStore } from './simple-store'

export class Collection extends SimpleStore {
  static defaultParams = {
    page: 1,
    per_page: 10,
  }

  meta = { total: 0, page: 1, offset: 0 }
  data = []
  parameter = Object.assign({}, this.constructor.defaultParams, this.params)

  fetchData() {
    this.params.offset = 0
    return this.fetching(async () => {
      const { data, meta } = await this.fetch(this.params)
      this.meta = meta
      this.data = data
    })
  }

  fetchMoreData() {
    if (this.loadMoreStatue !== 'more') { return; }
    this.params.offset = this.data.length
    return this.fetching(async () => {
      const { data, meta } = await this.fetch(this.params)
      this.meta = meta
      this.data.push(...data)
    })
  }

  resetData() {
    this.isFulfilled = false
    this.data = []
  }

  removeItemById(id) {
    const index = this.data.findIndex(item => String(item.id) === String(id));
    index !== -1 && this.data.splice(index, 1);
  }

  get params() {
    return this.parameter
  }

  set params(properties) {
    this.parameter = Object.assign({}, this.constructor.defaultParams, properties)
  }

  get isComplete() {
    return this.isFulfilled && this.data.length >= this.meta.total
  }

  get isEmpty() {
    return this.isFulfilled && this.meta.total === 0
  }

  get loadMoreStatue() {
    if (this.isEmpty) { return 'empty' }
    if (this.isComplete) { return 'noMore' }
    if (this.isFetching) { return 'loading' }
    return 'more'
  }
}

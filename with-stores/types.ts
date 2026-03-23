import Alpine from 'alpinejs'
import { atom, map } from 'nanostores'

import { withStores } from './index.js'

let $count = atom(0)
let $user = map({ age: 30, name: 'Alice' })

Alpine.data(
  'counter',
  withStores({ count: $count, user: $user }, ({ count, user }) => {
    let n: number = count
    let s: string = user.name
    return { n, s }
  })
)

Alpine.data(
  'counter',
  withStores({ count: $count, user: $user }, () => ({
    destroy() {
      this.$dispatch('cleanup')
    },
    increment() {
      let count: number = this.count
      let name: string = this.user.name
      this.$dispatch('increment', { count, name })
    },
    init() {
      let el: HTMLElement = this.$el
      let root: Element = this.$root
      let refs: Record<string, HTMLElement> = this.$refs
      this.$nextTick(() => {})
      this.$dispatch('change', { value: 1 })
      console.log(el, root, refs)
    }
  }))
)

Alpine.data(
  'counter',
  withStores({ count: $count }, () => ({
    init() {
      this.$watch('count', (val: number) => {
        console.log(val)
      })
    }
  }))
)

Alpine.data(
  'counterComponent',
  withStores({ count: $count }, ({ count }) => ({
    init() {
      let el: HTMLElement = this.$el
      this.$watch('count', (val: number) => {
        console.log(val, count, el)
      })
    }
  }))
)

import Alpine from 'alpinejs'
import { atom, map } from 'nanostores'

import { withStores } from './index.js'

let $count = atom(0)
let $user = map({ age: 30, name: 'Alice' })

Alpine.data(
  'counter',
  withStores({ user: $user }, ({ user }) => {
    // THROWS Type 'string' is not assignable to type 'number'
    let name: number = user.name
    return { name }
  })
)

Alpine.data(
  'counter',
  withStores({ count: $count }, () => ({
    init() {
      // THROWS Type 'number' is not assignable to type 'string'
      let value: string = this.count
      console.log(value)
    }
  }))
)

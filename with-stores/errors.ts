import { atom, map } from 'nanostores'

import { withStores } from './index.js'

let $count = atom(0)
let $user = map({ name: 'Alice', age: 30 })

// factory receives correctly-typed initial values
withStores({ user: $user }, ({ user }) => {
  // @ts-expect-error user.name is string, not number
  let name: number = user.name
  return { name }
})

// Correct usage should compile without error
withStores({ count: $count, user: $user }, ({ count, user }) => {
  let n: number = count
  let s: string = user.name
  return { n, s }
})

import Alpine from 'alpinejs'
import { atom, map } from 'nanostores'

import { NanoStores } from '../index.js'
import { withStores } from '../with-stores/index.js'

// Stores
let $counter = atom(0)
let $profile = map<{ name: string; role: string }>({ name: 'Alice', role: 'user' })
let $username = atom('Alice')
let $cart = atom<string[]>([])
let $clicks = atom(0)
let $lastAction = atom('')

// Expose stores as Alpine magics for use in HTML expressions
Alpine.magic('cart', () => $cart)
Alpine.magic('counter', () => $counter)
Alpine.magic('profile', () => $profile)
Alpine.magic('username', () => $username)

// Alpine.data component using withStores
Alpine.data(
  'dashboard',
  withStores({ lastAction: $lastAction, total: $clicks }, () => ({
    click(label: string) {
      $clicks.set($clicks.get() + 1)
      $lastAction.set(`Button ${label}`)
    },
    reset() {
      $clicks.set(0)
      $lastAction.set('')
    }
  }))
)

Alpine.plugin(NanoStores)
Alpine.start()

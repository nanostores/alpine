import Alpine from 'alpinejs'
import { afterEach } from 'vitest'

import { NanoStores } from '../index.js'

Alpine.plugin(NanoStores)
Alpine.start()

afterEach(() => {
  Alpine.destroyTree(document.body)
  document.body.innerHTML = ''
})

export async function mount(html, stores = {}) {
  for (let [name, store] of Object.entries(stores)) {
    Alpine.magic(name, () => store)
  }

  document.body.innerHTML = html
  Alpine.initTree(document.body)

  await Alpine.nextTick()

  return document.body
}

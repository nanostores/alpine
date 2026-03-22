import Alpine from 'alpinejs'
import type { Store } from 'nanostores'
import { afterEach } from 'vitest'

import { NanoStores } from '../index.js'

Alpine.plugin(NanoStores)
Alpine.start()

afterEach(() => {
  Alpine.destroyTree(document.body)
  document.body.innerHTML = ''
})

export async function mount(
  html: string,
  stores: Record<string, Store> = {}
): Promise<HTMLElement> {
  for (let [name, store] of Object.entries(stores)) {
    Alpine.magic(name, () => store)
  }

  document.body.innerHTML = html
  Alpine.initTree(document.body)

  await Alpine.nextTick()

  return document.body
}

export function getEl<T extends Element = Element>(parent: Element, selector: string): T {
  let el = parent.querySelector<T>(selector)
  if (!el) throw new Error(`Element not found: ${selector}`)
  return el
}

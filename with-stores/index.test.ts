import Alpine from 'alpinejs'
import { atom, map, onMount, STORE_UNMOUNT_DELAY } from 'nanostores'
import { expect, it } from 'vitest'

import { getEl, mount } from '../test/helpers.js'
import { withStores } from './index.js'

it('provides initial store values to factory', async () => {
  let $name = atom('Alice')
  let received: string | undefined

  Alpine.data(
    'testInit',
    withStores({ name: $name }, ({ name }) => {
      received = name
      return {}
    })
  )

  await mount('<div x-data="testInit"></div>', {})

  expect(received).toBe('Alice')
})

it('exposes store values as component properties', async () => {
  let $count = atom(5)

  Alpine.data(
    'testProp',
    withStores({ count: $count }, () => ({}))
  )

  let body = await mount('<div x-data="testProp"><span id="out" x-text="count"></span></div>', {})

  expect(getEl(body, '#out').textContent).toBe('5')
})

it('updates component property when atom store changes', async () => {
  let $count = atom(0)

  Alpine.data(
    'testAtomUpdate',
    withStores({ count: $count }, () => ({}))
  )

  let body = await mount(
    '<div x-data="testAtomUpdate"><span id="out" x-text="count"></span></div>',
    {}
  )

  $count.set(42)
  await Alpine.nextTick()

  expect(getEl(body, '#out').textContent).toBe('42')
})

it('updates component property when map store key changes', async () => {
  let $user = map({ name: 'Alice' })

  Alpine.data(
    'testMapUpdate',
    withStores({ user: $user }, () => ({}))
  )

  let body = await mount(
    '<div x-data="testMapUpdate"><span id="out" x-text="user.name"></span></div>',
    {}
  )

  $user.setKey('name', 'Bob')
  await Alpine.nextTick()

  expect(getEl(body, '#out').textContent).toBe('Bob')
})

it('calls user-defined init after subscriptions', async () => {
  let $count = atom(10)
  let initValue: number | undefined

  Alpine.data(
    'testUserInit',
    withStores({ count: $count }, () => ({
      init() {
        initValue = (this as unknown as { count: number }).count
      }
    }))
  )

  await mount('<div x-data="testUserInit"></div>', {})

  expect(initValue).toBe(10)
})

it('calls user-defined destroy on cleanup', async () => {
  let destroyed = false
  let $val = atom('x')

  Alpine.data(
    'testDestroy',
    withStores({ val: $val }, () => ({
      destroy() {
        destroyed = true
      }
    }))
  )

  let body = await mount('<div x-data><div id="comp" x-data="testDestroy"></div></div>', {})

  getEl(body, '#comp').remove()
  await Alpine.nextTick()

  expect(destroyed).toBe(true)
})

it('unsubscribes all stores when component is destroyed', async () => {
  let mounted = false
  let $a = atom(1)

  onMount($a, () => {
    mounted = true
    return () => {
      mounted = false
    }
  })

  Alpine.data(
    'testUnsub',
    withStores({ a: $a }, () => ({}))
  )

  let body = await mount('<div x-data><div id="comp" x-data="testUnsub"></div></div>', {})

  expect(mounted).toBe(true)

  getEl(body, '#comp').remove()
  await new Promise(resolve => setTimeout(resolve, STORE_UNMOUNT_DELAY + 50))

  expect(mounted).toBe(false)
})

it('supports multiple stores simultaneously', async () => {
  let $first = atom('hello')
  let $second = atom('world')

  Alpine.data(
    'testMulti',
    withStores({ first: $first, second: $second }, () => ({}))
  )

  let body = await mount(
    '<div x-data="testMulti"><span id="out" x-text="first + \' \' + second"></span></div>',
    {}
  )

  expect(getEl(body, '#out').textContent).toBe('hello world')

  $first.set('hi')
  $second.set('there')
  await Alpine.nextTick()

  expect(getEl(body, '#out').textContent).toBe('hi there')
})

it('merges factory methods with store values', async () => {
  let $count = atom(0)

  Alpine.data(
    'testMethods',
    withStores({ count: $count }, () => ({
      increment() {
        $count.set((this as unknown as { count: number }).count + 1)
      }
    }))
  )

  let body = await mount(
    '<div x-data="testMethods"><span id="out" x-text="count"></span><button id="btn" @click="increment">+</button></div>',
    {}
  )

  getEl<HTMLButtonElement>(body, '#btn').click()
  await Alpine.nextTick()

  expect(getEl(body, '#out').textContent).toBe('1')
  expect($count.get()).toBe(1)
})

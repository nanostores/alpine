import Alpine from 'alpinejs'
import { atom, computed, map, onMount, STORE_UNMOUNT_DELAY } from 'nanostores'
import { expect, it } from 'vitest'

import { mount } from '../test/helpers.js'

// x-nano directive

it('exposes atom store value in scope on mount', async () => {
  let $counter = atom(42)
  let body = await mount(
    '<div x-data x-nano:count="$counter"><span id="out" x-text="count"></span></div>',
    { counter: $counter }
  )

  expect(body.querySelector('#out').textContent).toBe('42')
})

it('updates scope when atom store changes', async () => {
  let $counter = atom(0)
  let body = await mount(
    '<div x-data x-nano:count="$counter"><span id="out" x-text="count"></span></div>',
    { counter: $counter }
  )

  $counter.set(99)
  await Alpine.nextTick()

  expect(body.querySelector('#out').textContent).toBe('99')
})

it('exposes map store value in scope on mount', async () => {
  let $user = map({ age: 30, name: 'Alice' })
  let body = await mount(
    '<div x-data x-nano:user="$user"><span id="out" x-text="user.name"></span></div>',
    { user: $user }
  )

  expect(body.querySelector('#out').textContent).toBe('Alice')
})

it('updates scope when map store key changes', async () => {
  let $user = map({ name: 'Alice' })
  let body = await mount(
    '<div x-data x-nano:user="$user"><span id="out" x-text="user.name"></span></div>',
    { user: $user }
  )

  $user.setKey('name', 'Bob')
  await Alpine.nextTick()

  expect(body.querySelector('#out').textContent).toBe('Bob')
})

it('exposes computed store value in scope', async () => {
  let $base = atom(10)
  let $doubled = computed($base, v => v * 2)
  let body = await mount(
    '<div x-data x-nano:doubled="$doubled"><span id="out" x-text="doubled"></span></div>',
    { doubled: $doubled }
  )

  expect(body.querySelector('#out').textContent).toBe('20')

  $base.set(5)
  await Alpine.nextTick()

  expect(body.querySelector('#out').textContent).toBe('10')
})

it('supports multiple x-nano directives on one element', async () => {
  let $a = atom('hello')
  let $b = atom('world')
  let body = await mount(
    '<div x-data x-nano:a="$a" x-nano:b="$b"><span id="out" x-text="a + \' \' + b"></span></div>',
    { a: $a, b: $b }
  )

  expect(body.querySelector('#out').textContent).toBe('hello world')

  $a.set('hi')
  $b.set('there')
  await Alpine.nextTick()

  expect(body.querySelector('#out').textContent).toBe('hi there')
})

it('unsubscribes when element is removed', async () => {
  let mounted = false
  let $counter = atom(0)

  onMount($counter, () => {
    mounted = true
    return () => {
      mounted = false
    }
  })

  let body = await mount(
    '<div x-data><div id="wrap" x-nano:count="$counter"><span x-text="count"></span></div></div>',
    { counter: $counter }
  )

  expect(mounted).toBe(true)

  body.querySelector('#wrap').remove()
  await new Promise(resolve => setTimeout(resolve, STORE_UNMOUNT_DELAY + 50))

  expect(mounted).toBe(false)
})

it('does not mount store unnecessarily without subscribers', async () => {
  let mountCount = 0
  let $lazy = atom('initial')

  onMount($lazy, () => {
    mountCount++
    return () => {}
  })

  expect(mountCount).toBe(0)

  await mount('<div x-data x-nano:val="$lazy"><span x-text="val"></span></div>', { lazy: $lazy })

  expect(mountCount).toBe(1)
})

// x-nano-model directive

it('binds atom store two-way via x-nano-model', async () => {
  let $name = atom('Alice')
  let body = await mount(
    '<div x-data x-nano-model:name="$name"><input id="inp" x-model="name"><span id="out" x-text="name"></span></div>',
    { name: $name }
  )

  expect(body.querySelector('#out').textContent).toBe('Alice')
  expect(body.querySelector('#inp').value).toBe('Alice')
})

it('updates display when store changes via x-nano-model', async () => {
  let $name = atom('Alice')
  let body = await mount(
    '<div x-data x-nano-model:name="$name"><span id="out" x-text="name"></span></div>',
    { name: $name }
  )

  $name.set('Bob')
  await Alpine.nextTick()

  expect(body.querySelector('#out').textContent).toBe('Bob')
})

it('updates store when input changes via x-nano-model', async () => {
  let $name = atom('Alice')
  let body = await mount(
    '<div x-data x-nano-model:name="$name"><input id="inp" x-model="name"></div>',
    { name: $name }
  )

  let input = body.querySelector('#inp')
  input.value = 'Charlie'
  input.dispatchEvent(new Event('input'))
  await Alpine.nextTick()

  expect($name.get()).toBe('Charlie')
})

it('unsubscribes x-nano-model when element is removed', async () => {
  let mounted = false
  let $val = atom('x')

  onMount($val, () => {
    mounted = true
    return () => {
      mounted = false
    }
  })

  let body = await mount(
    '<div x-data><div id="wrap" x-nano-model:val="$val"><span x-text="val"></span></div></div>',
    { val: $val }
  )

  expect(mounted).toBe(true)

  body.querySelector('#wrap').remove()
  await new Promise(resolve => setTimeout(resolve, STORE_UNMOUNT_DELAY + 50))

  expect(mounted).toBe(false)
})

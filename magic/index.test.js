import Alpine from 'alpinejs'
import { atom, map, onMount, STORE_UNMOUNT_DELAY } from 'nanostores'
import { expect, it } from 'vitest'

import { mount } from '../test/helpers.js'

it('returns current atom value', async () => {
  let $counter = atom(7)
  let body = await mount('<span id="out" x-data x-text="$nano($counter)"></span>', {
    counter: $counter
  })

  expect(body.querySelector('#out').textContent).toBe('7')
})

it('reacts to atom store changes', async () => {
  let $counter = atom(0)
  let body = await mount('<span id="out" x-data x-text="$nano($counter)"></span>', {
    counter: $counter
  })

  $counter.set(42)
  await Alpine.nextTick()

  expect(body.querySelector('#out').textContent).toBe('42')
})

it('returns map store value and reacts to changes', async () => {
  let $user = map({ name: 'Alice' })
  let body = await mount('<span id="out" x-data x-text="$nano($user).name"></span>', {
    user: $user
  })

  expect(body.querySelector('#out').textContent).toBe('Alice')

  $user.setKey('name', 'Bob')
  await Alpine.nextTick()

  expect(body.querySelector('#out').textContent).toBe('Bob')
})

it('works without x-data on the element when parent has x-data', async () => {
  let $counter = atom(5)
  let body = await mount('<div x-data><span id="out" x-text="$nano($counter)"></span></div>', {
    counter: $counter
  })

  expect(body.querySelector('#out').textContent).toBe('5')
})

it('per-element cache: same store on same element creates one binding', async () => {
  let $counter = atom(1)

  // Single element calls $nano($counter) twice in one expression
  let body = await mount(
    '<span id="el" x-data x-text="$nano($counter) + \'-\' + $nano($counter)"></span>',
    { counter: $counter }
  )

  // Only one binding should be stored per element per store
  expect(body.querySelector('#el')._nanostores.size).toBe(1)
})

it('cleans up subscription when element is destroyed', async () => {
  let mounted = false
  let $counter = atom(0)

  onMount($counter, () => {
    mounted = true
    return () => {
      mounted = false
    }
  })

  let body = await mount('<div x-data><span id="el" x-text="$nano($counter)"></span></div>', {
    counter: $counter
  })

  expect(mounted).toBe(true)

  body.querySelector('#el').remove()
  await new Promise(resolve => setTimeout(resolve, STORE_UNMOUNT_DELAY + 50))

  expect(mounted).toBe(false)
})

it('supports x-show with $nano', async () => {
  let $visible = atom(true)
  let body = await mount('<span id="el" x-data x-show="$nano($visible)">content</span>', {
    visible: $visible
  })

  expect(body.querySelector('#el').style.display).not.toBe('none')

  $visible.set(false)
  await Alpine.nextTick()

  expect(body.querySelector('#el').style.display).toBe('none')
})

it('supports attribute binding with $nano', async () => {
  let $disabled = atom(false)
  let body = await mount('<button id="btn" x-data :disabled="$nano($disabled)">click</button>', {
    disabled: $disabled
  })

  expect(body.querySelector('#btn').disabled).toBe(false)

  $disabled.set(true)
  await Alpine.nextTick()

  expect(body.querySelector('#btn').disabled).toBe(true)
})

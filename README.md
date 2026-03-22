# Nano Stores Alpine

Alpine.js integration for [Nano Stores](https://github.com/nanostores/nanostores), a tiny state manager.


## Install

```sh
npm install nanostores-alpine
```


## Usage

### Plugin Setup

```js
import Alpine from 'alpinejs'
import { NanoStores } from 'nanostores-alpine'

Alpine.plugin(NanoStores)
Alpine.start()
```

Or register individual parts:

```js
import { directivePlugin, magicPlugin } from 'nanostores-alpine'

Alpine.plugin(directivePlugin) // registers x-nano and x-nano-model
Alpine.plugin(magicPlugin) // registers $nano
```


### Store State (`x-nano` directive)

Bind a store to a named scope property. The property updates reactively.

```html
<div x-data x-nano:count="$counter">
  <span x-text="count"></span>
</div>
```

Multiple stores on one element:

```html
<div x-data x-nano:user="$user" x-nano:cart="$cart">
  <span x-text="user.name"></span>
  <span x-text="cart.length + ' items'"></span>
</div>
```

Combine reads with mutations:

```html
<div x-data x-nano:count="$counter">
  <span x-text="count"></span>
  <button @click="$counter.set(count + 1)">+</button>
</div>
```


### Two-way Binding (`x-nano-model` directive)

Sync a store bidirectionally with `x-model` form inputs.

```html
<div x-data x-nano-model:name="$name">
  <input x-model="name" />
  <p x-text="'Hello, ' + name"></p>
</div>
```

When the input changes, the store is updated. When the store changes, the input reflects it.

> Works with `atom` stores holding any value. For `map` stores use `x-nano` + manual `setKey`.

### Inline Access (`$nano` magic)

Read a store value anywhere in an expression — no `x-data` required on the element.

```html
<span x-text="$nano($counter)"></span>
<span x-text="$nano($user).name"></span>
<span x-show="$nano($cart).length > 0">Cart is not empty</span>
<button :disabled="$nano($isLoading)">Save</button>
```


### Alpine.data Components (`withStores`)

For complex components registered with `Alpine.data`, use `withStores` to get
type-safe initial values and automatic subscription management.

```js
// stores.js
import { atom, map } from 'nanostores'
export const $profile = map({ name: 'Anonymous', age: 0 })
export const $cart = atom([])
```

```js
// header.js
import Alpine from 'alpinejs'
import { withStores } from 'nanostores-alpine/with-stores'
import { $cart, $profile } from './stores.js'

Alpine.data(
  'header',
  withStores({ cart: $cart, profile: $profile }, ({ cart, profile }) => ({
    get cartCount() {
      return this.cart.length
    },
    get greeting() {
      return `Hi, ${this.profile.name}`
    },
    clearCart() {
      $cart.set([])
    }
  }))
)
```

```html
<header x-data="header">
  <span x-text="greeting"></span>
  <span x-text="cartCount + ' items'"></span>
  <button @click="clearCart">Clear</button>
</header>
```


## API Comparison

| API                           | When to use                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------- |
| `x-nano:key="$store"`         | Primary choice. Template-driven bindings with automatic cleanup.                  |
| `x-nano-model:key="$store"`   | Two-way binding for form inputs with atom stores.                                 |
| `$nano($store)`               | Inline expressions, attribute bindings (`:class`, `:disabled`).                   |
| `withStores(stores, factory)` | `Alpine.data` components — TypeScript-friendly, keeps stores out of the template. |


## TypeScript

```ts
import { atom, map } from 'nanostores'
import type { StoreValue } from 'nanostores'
import { withStores } from 'nanostores-alpine/with-stores'

const $count = atom(0)
const $user = map({ name: 'Alice' })

// withStores infers types from the stores map:
Alpine.data(
  'myComp',
  withStores({ count: $count, user: $user }, ({ count, user }) => {
    // count: number, user: { name: string }
    return {
      get doubled(): number {
        return this.count * 2
      }
    }
  })
)
```


## Limitations

- **`$nano` inside `x-for`**: Not recommended — `x-for` does not reliably dispatch `alpine:destroy` on individual items. Use `x-nano` on the `x-for` parent element instead.
- **`x-nano-model` with map stores**: Only atom stores are supported for two-way binding. Use `x-nano` + `setKey` for map stores.
- **SSR**: Alpine.js does not support server-side rendering; neither does this package.

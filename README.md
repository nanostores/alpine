# Nano Stores Alpine

<img align="right" width="92" height="92" title="Nano Stores logo"
     src="https://nanostores.github.io/nanostores/logo.svg">

[Alpine.js] integration for **[Nano Stores]**, a tiny state manager with many atomic tree-shakable stores.

* **Small.** Less than 1.2 KB (minified + brotli). Zero dependencies.
* **Tree-shakable.** Use only the parts you need: directive, magic, or component helper.
* **Smart.** Store subscriptions are created and cleaned up automatically.
* It has good **TypeScript** support.

```html
<div x-data x-nano:user="$profile">
  <header>Hi, <strong x-text="user.name"></strong>!</header>
</div>
```


## Install

```sh
npm install nanostores alpinejs @nanostores/alpine
```


## Usage

### Setup

```js
import Alpine from 'alpinejs'
import { NanoStores } from '@nanostores/alpine'

Alpine.plugin(NanoStores)
Alpine.start()
```

Or register individual parts:

```js
import { directivePlugin, magicPlugin } from '@nanostores/alpine'

// Registers x-nano and x-nano-model directives
Alpine.plugin(directivePlugin)

// Registers $nano magic property
Alpine.plugin(magicPlugin)
```


### Reactive state

The primary way to use stores in templates. Binds a store to a named scope
property on the element — reactive and available to all child expressions.

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


### Model

Two-way binding between a store and a form input. Changes to the input update
the store. Store changes reflect in the input.

```html
<div x-data x-nano-model:name="$name">
  <input x-model="name" />
  <p x-text="'Hello, ' + name"></p>
</div>
```

> Works with `atom` stores. For `map` stores use `x-nano` + `setKey`.


### Magic

Reads a store value inline — in any expression, on any element, without
wrapping in `x-data`. Useful for attribute bindings and one-off reads.

```html
<span x-text="$nano($counter)"></span>
<span x-text="$nano($user).name"></span>
<span x-show="$nano($cart).length > 0">Cart is not empty</span>
<button :disabled="$nano($isLoading)">Save</button>
```

> Not recommended inside `x-for` — `x-for` does not reliably clean up
> subscriptions per item. Use `x-nano` on the parent element instead.


### Data

Injects store values as typed initial state and
keeps them in sync through the component lifecycle. Best choice when you want
to keep store logic out of the template entirely.

```js
import Alpine from 'alpinejs'
import { withStores } from '@nanostores/alpine/with-stores'
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


## Limitations

- **`x-nano-model` with map stores**: Only `atom` stores are supported for
  two-way binding. Use `x-nano` + `setKey` for map stores.
- **SSR**: Alpine.js does not support server-side rendering; neither does
  this package.


[Nano Stores]: https://github.com/nanostores/nanostores
[Alpine.js]: https://alpinejs.dev

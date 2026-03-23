import type Alpine from 'alpinejs'
import type { AnyStore, StoreValue } from 'nanostores'

type StoresMap = Record<string, AnyStore>
type StoreValues<T extends StoresMap> = { [K in keyof T]: StoreValue<T[K]> }

/**
 * Creates an Alpine.js `x-data` factory that subscribes to Nano Stores.
 *
 * Store values are injected into the component's initial state and kept
 * in sync. Subscriptions are created on `init` and cleaned up on `destroy`.
 *
 * ```js
 * Alpine.data('dashboard', withStores({ count: $counter, user: $user }, () => ({
 *   greeting() {
 *     return `Hello, ${this.user.name}! Count: ${this.count}`
 *   }
 * })))
 * ```
 *
 * @param stores Map of store keys to Nano Store instances
 * @param factory Function receiving initial store values, returning component data
 * @returns Alpine.js data factory function
 */
export declare function withStores<Stores extends StoresMap, Component extends object>(
  stores: Stores,
  factory: (
    values: StoreValues<Stores>
  ) => Component &
    ThisType<
      Alpine.Magics<Component & StoreValues<Stores>> &
        Alpine.XDataContext &
        Component &
        StoreValues<Stores>
    >
): () => Alpine.AlpineComponent<Component & StoreValues<Stores>>

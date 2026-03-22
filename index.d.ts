export { directivePlugin, modelDirectivePlugin } from './directive/index.js'
export { magicPlugin } from './magic/index.js'

/**
 * All-in-one Alpine.js plugin that registers `x-nano`, `x-nano-model`,
 * and `$nano` in a single call.
 *
 * ```js
 * import Alpine from 'alpinejs'
 * import { NanoStores } from 'nanostores-alpine'
 *
 * Alpine.plugin(NanoStores)
 * Alpine.start()
 * ```
 *
 * @param Alpine Alpine.js instance
 */
export declare function NanoStores(Alpine: unknown): void

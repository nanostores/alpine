/**
 * Alpine.js plugin that registers the `x-nano` directive.
 *
 * Binds a Nano Store to a named scope variable on the element,
 * making it available to child elements via Alpine expressions.
 *
 * ```html
 * <div x-nano:count="$count">
 *   <span x-text="count"></span>
 * </div>
 * ```
 *
 * @param Alpine Alpine.js instance
 */
export declare function directivePlugin(Alpine: unknown): void

/**
 * Alpine.js plugin that registers the `x-nano-model` directive.
 *
 * Creates a two-way binding between a writable Nano Store and a
 * named scope variable. Changes to the store update the scope,
 * and changes to the scope update the store.
 *
 * ```html
 * <div x-nano-model:username="$profile">
 *   <input x-model="username" />
 * </div>
 * ```
 *
 * @param Alpine Alpine.js instance
 */
export declare function modelDirectivePlugin(Alpine: unknown): void

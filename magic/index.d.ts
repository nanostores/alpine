/**
 * Alpine.js plugin that registers the `$nano` magic property.
 *
 * Returns the current value of a Nano Store and subscribes to
 * future changes, triggering reactive updates automatically.
 * Multiple calls with the same store on the same element are cached.
 *
 * ```html
 * <div x-data>
 *   <span x-text="$nano($count)"></span>
 * </div>
 * ```
 *
 * @param Alpine Alpine.js instance
 */
export declare function magicPlugin(Alpine: unknown): void

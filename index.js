import { directivePlugin, modelDirectivePlugin } from './directive/index.js'
import { magicPlugin } from './magic/index.js'

export { directivePlugin, modelDirectivePlugin } from './directive/index.js'
export { magicPlugin } from './magic/index.js'

export function NanoStores(Alpine) {
  directivePlugin(Alpine)
  modelDirectivePlugin(Alpine)
  magicPlugin(Alpine)
}

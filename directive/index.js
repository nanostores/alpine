export function directivePlugin(Alpine) {
  Alpine.directive('nano', (el, { expression, value: propName }, { cleanup, evaluate }) => {
    let store = evaluate(expression)
    let scope = Alpine.reactive({ [propName]: store.get() })
    Alpine.addScopeToNode(el, scope)
    let unbind = store.listen(value => {
      scope[propName] = value
    })
    cleanup(unbind)
  })
}

export function modelDirectivePlugin(Alpine) {
  Alpine.directive('nano-model', (el, { expression, value: propName }, { cleanup, evaluate }) => {
    let store = evaluate(expression)
    let scope = Alpine.reactive({ [propName]: store.get() })
    Alpine.addScopeToNode(el, scope)

    let fromStore = false

    let unbind = store.listen(value => {
      fromStore = true
      scope[propName] = value
      fromStore = false
    })

    let stopEffect = Alpine.effect(() => {
      let value = scope[propName]
      if (!fromStore) store.set(value)
    })

    cleanup(() => {
      unbind()
      stopEffect()
    })
  })
}

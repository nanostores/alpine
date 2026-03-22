export function withStores(storesMap, factory) {
  return () => {
    let unbinds = []

    let initialValues = Object.fromEntries(Object.entries(storesMap).map(([k, s]) => [k, s.get()]))

    let component = factory(initialValues)

    return {
      ...component,

      destroy() {
        unbinds.forEach(u => u())
        component.destroy?.call(this)
      },

      init() {
        for (let [key, store] of Object.entries(storesMap)) {
          unbinds.push(
            store.subscribe(v => {
              this[key] = v
            })
          )
        }
        component.init?.call(this)
      }
    }
  }
}

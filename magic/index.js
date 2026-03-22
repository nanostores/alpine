export function magicPlugin(Alpine) {
  Alpine.magic('nano', el => {
    return store => {
      if (!el._nanostores) {
        el._nanostores = new Map()

        // Register cleanup via Alpine's attribute cleanup mechanism,
        // which is called by destroyTree — same as directive's cleanup().
        if (!el._x_attributeCleanups) el._x_attributeCleanups = {}
        if (!el._x_attributeCleanups.$nano) {
          el._x_attributeCleanups.$nano = []
        }
        el._x_attributeCleanups.$nano.push(() => {
          for (let { unbind } of el._nanostores.values()) unbind()
          delete el._nanostores
        })
      }

      if (!el._nanostores.has(store)) {
        let reactive = Alpine.reactive({ _: store.get() })
        let unbind = store.listen(v => {
          reactive._ = v
        })
        el._nanostores.set(store, { reactive, unbind })
      }

      return el._nanostores.get(store).reactive._
    }
  })
}

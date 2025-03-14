const ObjectHelper = {
  get(Object, key, default_value = 0) {
    return Object[key] ?? default_value
  },

  getMultiple(Object,keys,default_value){
    let res = Object
    for(const key of keys){
      res = res[key]
      if(res == undefined){
        return default_value
      }
    }
    return res
  },

  /**
   * Will overwrite every property of original object with properties of pulling_from
   * @example {a:2,b:7} + {b:9,c:6} => {a:2,b:9,c:6}
   * @param {Object} original
   * @param {Object} pulling_from
   * @returns
   */
  merge(original, pulling_from) {
    let result
    if (original == undefined) result = pulling_from
    else {
      result = ObjectHelper.copy(original)
      for (const key in pulling_from) {
        if (pulling_from[key] instanceof Object) {
          if (result[key] == undefined) result[key] = pulling_from[key]
          else result[key] = ObjectHelper.merge(result[key], pulling_from[key])
        } else result[key] = pulling_from[key]
        //console.log(key, result[key])
      }
    }
    return result
  },

  copy(original) {
    let result = Array.isArray(original) ? [] : {}

    for (const key in original) {
      let element = original[key]

      if (element && element.copy) {
        element = element.copy()
      } else if (
        element &&
        (Object.getPrototypeOf(element) === Object.prototype ||
          Array.isArray(element)) &&
        !(element instanceof Function)
      ) {
        element = ObjectHelper.copy(element)
      }

      result[key] = element
    }
    return result
  },
  /** Reverses keys and items of  object */
  reverseObject(object) {
    let result = {}
    for (const key in object) {
      result[object[key]] = key
    }
    return result
  },

  toTupleArray(object){
    let res = []
    for(const key in object){
      res.push([key,object[key]])
    }
    return res
  }
}

export default ObjectHelper
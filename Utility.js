export let HTMLElementHelper = {
  setSize(element, sizeVector, type = "px") {
    element.style.width = sizeVector.x + type
    element.style.height = sizeVector.y + type
  },
  setPosition(element, positionVector, type = "px") {
    element.style.left = positionVector.x + type
    element.style.top = positionVector.y + type
  },

  setBackgroundImage(element, url) {
    element.style.backgroundImage = url == "none" ? url : `url(${url})`
  },
  setZLayer(element, layer) {
    element.style.zIndex = layer
  },
  disablePointerEvents(element) {
    element.style.pointerEvents = "none"
  },
  disableContextMenu(element) {
    element.oncontextmenu = () => false
  },
  applyStyle(element, style, appliedStyles) {
    if (style instanceof Object)
      if (appliedStyles) {
        for (const key in appliedStyles) {
          if (style.get(key)) {
            element.style.setProperty(key, style.get(key))
          } else {
            element.style.setProperty(key, null)
            delete appliedStyles[key]
          }
        }
      } else
        for (const key in style) {
          element.style.setProperty(key, style[key])
        }
    else {
      console.warn("applying bad style", style)
    }
  },
  applyAttributes(element, attributes) {
    if (attributes instanceof Object) {
      for (const key in attributes) {
        element.setAttribute(key, attributes[key])
      }
    } else {
      console.warn("applying bad attribute", attributes)
    }
  },
}

export function loadUtility() {
  String.prototype.color = function (color) {
    let elem = document.createElement("span")
    elem.style.color = color
    elem.innerHTML = this
    return elem.outerHTML
  }

  String.prototype.capitalize = function () {
    return this[0].toUpperCase() + this.substring(1)
  }

  Object.defineProperty(Array.prototype, "shuffle", {
    get: function () {
      return function () {
        for (let i = this.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[this[i], this[j]] = [this[j], this[i]]
        }
        return this
      }
    },
    configurable: true,
    enumerable: false,
  })

  Object.defineProperty(Object.prototype, "get", {
    get: function () {
      return function (key, default_value = 0) {
        return this[key] || default_value
      }
    },
    configurable: true,
    enumerable: false,
  })

  Object.defineProperty(Array.prototype, "sum", {
    get: function () {
      let sum = 0
      for (let i = 0; i < this.length; i++) {
        sum += this[i]
      }
      return sum
    },
    enumerable: false,
  })
  Object.defineProperty(Array.prototype, "toDictionary", {
    get: function () {
      return (values) => {
        let result = {}
        for (let i = 0; i < this.length; i++) {
          result[this[i]] = values[i]
        }
        return result
      }
    },

    enumerable: false,
  })

  Object.defineProperty(Array.prototype, "max", {
    get: function () {
      let max = 0
      for (let i = 0; i < this.length; i++) {
        if (max < this[i]) max = this[i]
      }
      return max
    },
    enumerable: false,
  })

  Object.defineProperty(Array.prototype, "min", {
    get: function () {
      let min = Infinity
      for (let i = 0; i < this.length; i++) {
        if (min > this[i]) min = this[i]
      }
      return min
    },
    enumerable: false,
  })
}

export function createEmptyArray(width, height) {
  let result = new Array(height)
  for (let i = 0; i < height; i++) {
    result[i] = new Array(width)
  }
  return result
}

export class NumberRange {
  constructor(start = 0, end = 0) {
    this.start = start
    this.end = end
  }
  isNumberIn_inclusive(number) {
    return number >= this.start && number <= this.end
  }
  isNumberIn_exclusive(number) {
    return number >= this.start && number < this.end
  }
  toString() {
    return `${this.start} - ${this.end}`
  }
  middle() {
    return (this.start + this.end) / 2
  }
  allValues(inclusive = false) {
    let result = []
    for (let i = this.start; i < this.end + inclusive; i++) {
      result.push(i)
    }
    return result
  }
  length(inclusive = false) {
    return this.end - this.start + inclusive
  }
}
let next_id = 0
export function getUniqueIdentificator() {
  next_id++
  return next_id
}
/**
 * Will overwrite every property of original object with properties of pulling_from
 * @example {a:2,b:7} + {b:9,c:6} => {a:2,b:9,c:6}
 * @param {Object} original
 * @param {Object} pulling_from
 * @returns
 */
export function mergeObject(original, pulling_from) {
  let result
  if (original == undefined) result = pulling_from
  else {
    result = copyObject(original)
    for (const key in pulling_from) {
      if (pulling_from[key] instanceof Object) {
        if (result[key] == undefined) result[key] = pulling_from[key]
        else result[key] = mergeObject(result[key], pulling_from[key])
      } else result[key] = pulling_from[key]
      //console.log(key, result[key])
    }
  }
  return result
}

export function copyObject(original) {
  let result = Array.isArray(original) ? [] : {}

  for (const key in original) {
    let element = original[key]

    if (element && element.copy) {
      element = element.copy()
    } else if (element instanceof Object && !(element instanceof Function)) {
      element = copyObject(element)
    }

    result[key] = element
  }
  return result
}

/** Reverses keys and items of  object */
export function reverseObject(object) {
  let result = {}
  for (const key in object) {
    result[object[key]] = key
  }
  return result
}

export function getImg(img, extension = "png") {
  return "./src/assets/" + img + "." + extension
}

export function functionMerger(...funcs) {
  let list = funcs
  for (let i = 0; i < list.length; i++) {
    if (!(list[i] instanceof Function)) {
      let ret_value = list[i]
      list[i] = () => ret_value
    }
  }
  let merger = (...args) => {
    let obj = {}
    for (const func of list) {
      obj = mergeObject(obj, func(...args))
    }
    return obj
  }
  return merger
}

export class Node {
  constructor(value) {
    this.value = value
  }
  getValue() {
    return this.value
  }
  toString() {
    return this.value.toString()
  }
}

export class DoubleLinkedList {
  constructor() {
    this.length = 0
  }
  addValue(value) {
    if (this.head == undefined) {
      this.head = new Node(value)
      this.tail = this.head
    } else {
      let newNode = new Node(value)
      this.tail.next = newNode
      newNode.prev = this.tail
      this.tail = newNode
    }
    this.length += 1
  }
  removeNodeAt(index) {
    if (index >= this.length) {
      console.warn("cant remove node at index", index)
      return false
    }
    if (index == 0) {
      if (this.length == 1) {
        this.head = undefined
        this.tail = undefined
      } else {
        this.head = this.head.next
        this.head.prev = undefined
      }
    } else if (index == this.length - 1) {
      this.tail = this.tail.prev
      this.tail.next = undefined
    } else {
      let i = 0
      let node = this.head
      while (true) {
        if (i == index) {
          node.prev.next = node.next
          node.next.prev = node.prev
          break
        }
        i++
        node = node.next
      }
    }
    this.length -= 1
    return true
  }
  removeNode(node) {
    if (node == this.tail) {
      this.tail.prev.next = undefined
      this.tail = this.tail.prev
    } else if (node == this.head) {
      this.head.next.prev = undefined
      this.head = this.head.next
    } else {
      node.next.prev = node.prev
      node.prev.next = node.next
    }
    this.length--
  }
  addNodeAfter(node, value) {
    if (!(value instanceof Node)) {
      value = new Node(value)
    }

    value.prev = node
    value.next = node.next

    if (node == this.tail) {
      this.tail = value
    } else node.next.prev = value

    node.next = value

    this.length++
  }
  connect2Nodes(leftNode, rightNode) {
    let length = 0
    let node = leftNode.next
    while (node != rightNode) {
      if (node == undefined) {
        console.log(leftNode == rightNode)
        console.error(leftNode, "and", rightNode, "are not in order!")
        return false
      }
      length++
      node = node.next
    }
    this.length -= length
    leftNode.next = rightNode
    if (rightNode) rightNode.prev = leftNode
    return true
  }
  cutAt(endNode) {
    let node = endNode.next
    let length = 0
    while (node != undefined) {
      length++
      node = node.next
    }
    this.length -= length

    this.tail = endNode
    endNode.next = undefined
  }
  toString() {
    let result = ""
    let node = this.head
    while (node != undefined) {
      result += node.toString() + " -> "
      node = node.next
    }
    return result
  }
  *[Symbol.iterator]() {
    let node = this.head
    while (node != null) {
      yield node.value
      node = node.next
    }
  }
}

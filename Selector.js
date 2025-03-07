import Component from "./Component.js"
import ObjectHelper from "./Helpers/ObjectHelper.js"
import Input from "./Input.js";

export default class Selector extends Input {
  constructor() {
    super()
    this.selectorOptions = []
  }

  static copyConfig = ObjectHelper.merge(Component.copyConfig, {
    includeProperties: {
      selectorOptions: true,
    },
  })

  addOption(option) {
    for (let i = 0; ; i++) {
      if (this.selectorOptions[i] == undefined) {
        this.selectorOptions[i] = option
        break
      }
    }
    if (this.isBuilt) this.addOptionToContainer(option)
    return this
  }
  createHTMLElement() {
    this.container = document.createElement("select")
    this.container.style.pointerEvents = "all"
    this.container.style.position = "absolute"
  }
  addOptionToContainer(option) {
    let optionContainer = document.createElement("option")
    optionContainer.value = option.value
    optionContainer.innerText = option.text
    this.container.appendChild(optionContainer)
    return this
  }
  refreshOptions() {
    this.container.innerText = ""
    for (let option of this.selectorOptions) {
      if (option != undefined) {
        this.addOptionToContainer(option)
      }
    }
  }
  removeOptionByValue(value) {
    for (let i = 0; i < this.selectorOptions.length; i++) {
      if (this.selectorOptions[i] != undefined && this.selectorOptions[i].value == value) {
        delete this.selectorOptions[i]
        this.refrestOptions()
        break
      }
    }
  }

  build() {
    super.build()
    this.refreshOptions()
    this.isBuilt = true
    return this
  }
}
export class Option {
  constructor(value, text) {
    this.value = value
    this.text = text
  }
}

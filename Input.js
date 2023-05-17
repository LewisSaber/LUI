import Component from "./Component.js"

export default class Input extends Component {
  constructor() {
    super()
    this.type = "text"
  }
  createHTMLElement() {
    this.container = document.createElement("input")
    this.container.type = this.type
    this.container.innerHTML = ""
  }

  setPlaceHolder(text) {
    if (this.isBuilt) {
      this.dispatchEvent("placeholderChange", { text })
      this.container.placeholder = text
    } else
      this.addEventListener(
        "build",
        (_, target) => {
          target.setPlaceHolder(text)
        },
        undefined,
        { once: true }
      )
    return this
  }

  setType(type) {
    this.type = type
    if (this.isBuilt) {
      this.container.type = this.type
    }
    return this
  }
  onchange(evt) {
    this.dispatchEvent("change", evt)
  }
  onblur(evt) {
    this.dispatchEvent("blur", evt)
  }
  oninput(evt) {
    this.dispatchEvent("input", evt)
  }
  focus() {
    this.container.focus()
  }
  addListeners() {
    super.addListeners()
    this.container.addEventListener("change", (evt) => {
      this.onchange(evt)
    })
    this.container.addEventListener("blur", (evt) => {
      this.onblur(evt)
    })
    this.container.addEventListener("input", (evt) => {
      this.oninput(evt)
    })
  }

  getFile() {
    if (this.isBuilt)
      if (this.type == "file") {
        return this.container.files[0]
      }
    return false
  }
  getValue(placeholder = true) {
    if (this.isBuilt) {
      return (
        this.container.value || (placeholder ? this.container.placeholder : "")
      )
    }
    return ""
  }
  setValue(value, triggerInput = true) {
    if (this.isBuilt) {
      this.container.value = value
      if (triggerInput) this.dispatchEvent("input")
    } else {
      this.addEventListener(
        "build",
        () => this.setValue(value, triggerInput),
        undefined,
        { once: true }
      )
    }
    return this
  }
}

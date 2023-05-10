import Component from "./Component.js"
import { HTMLElementHelper } from "./Utility.js"
import { Vector } from "./Math.js"

export default class MainComponent extends Component {
  constructor(height, width) {
    if (MainComponent.instance) return MainComponent.instance
    super()
    MainComponent.instance = this
    window.MainComponent = this
    //this.setParentSize()
    if (height) {
      this.setHeight(height)
    } else this.setWidth(width)

    this.setFontSize(0.3).computeSize()
    this.build().resize()
    HTMLElementHelper.setSize(this.container, new Vector())
    window.addEventListener("resize", () => this.computeSize().resize())
    document.body.appendChild(this.getContainer())
    this.open()
  }

  copy() {
    return undefined
  }
  /**
   *
   * @returns {Component}
   */
  computeSize() {
    let windowSize = this.getWindowSize()
    this.pixelSize = new Vector()

    if (this.isHeightBased == undefined)
      if (this.size.y != 0) {
        this.isHeightBased = true
      } else this.isHeightBased = false

    if (this.isHeightBased) {
      this.pixelSize.y = windowSize.y / this.size.y
      this.pixelSize.x = this.pixelSize.y
      this.size.x = this.size.x = windowSize.x / this.pixelSize.x
    } else {
      this.pixelSize.x = windowSize.x / this.size.x
      this.pixelSize.y = this.pixelSize.x
      this.size.y = this.size.y = windowSize.y / this.pixelSize.y
    }

    return this
  }
  getAbsolutePosition() {
    return new Vector()
  }

  setWidth(width) {
    if (width <= 0) {
      console.error("Wrong width", width)
    }
    this.size.x = width
    return this
  }

  setHeight(height) {
    if (height <= 0) {
      console.error("Wrong width", height)
    }
    this.size.y = height
    return this
  }
}

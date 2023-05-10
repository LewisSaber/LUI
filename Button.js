import Component from "./Component.js"
import BackGround from "./Background.js"
import Label from "./Label.js"

export default class Button extends Component {
  constructor() {
    super()
  }

  setText(text, fontSize = this.fontSize, color = "black", x = 0, y = 0) {
    if (!this.textLabel) {
      this.textLabel = new Label().setSizeEqualToParent()
      this.textLabel.options.informational.is_button_text_label = true
      this.textLabel.addEventListener("build", (_, target) => {
        target.getContainer().style.pointerEvents = "none"
      })
      this.addComponent(this.textLabel)
    }

    this.textLabel.centerText()
    this.textLabel.setText(text).setColor(color).setFontSize(fontSize)

    if (this.textLabel.position.x != x || this.textLabel.position.y != y)
      this.textLabel.setPosition(x, y)

    return this
  }

  copy(toCopy) {
    let copy = super.copy(toCopy)
    let found = false
    if (this.queue)
      for (let component of copy.queue) {
        if (component.component.options.informational.is_button_text_label) {
          copy.textLabel = component.component
          found = true
          break
        }
      }
    if (!found)
      for (const component in copy.componentOrder) {
        if (component.options.informational.is_button_text_label) {
          copy.textLabel = component
          found = true
          break
        }
      }

    return copy
  }

  createHTMLElement() {
    this.container = document.createElement("button")
  }

  /**
        asymethric - defines if icon W == H, false for ==
        @deprecated
  */
  setIcon(
    icon,
    x = 0.15,
    y = 0.15,
    width = -1,
    height = -1,
    asymethric = false
  ) {
    {
      if (width == -1) {
        width = this.size.x - 2 * x
      }
      if (height == -1) {
        height = this.size.y - 2 * y
      }
      if (asymethric == false)
        if (height < width) {
          width = height
        } else height = width
    }
    let icon_component = new BackGround()
      .setSize(width, height)
      .setPosition(x, y)
      .setName("icon")
      .setImg(icon)
    this.addComponent(icon_component)
    return this
  }
}

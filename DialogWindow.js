import Button from "./Button.js"
import Component from "./Component.js"
import { getImg } from "./Utility.js"

export default class DialogWindow extends Component {
  build() {
    super.build()
    this.unlockPosition()
  }
  addParent(parent) {
    this.setParent(parent)
    return this
  }
  open() {
    if (this.isOpen) return
    this.parent.addComponent(this, "dialog", false)
    super.open()
    this.dispatchEvent("create")
    //closing button

    new Button()
      .setName("Close")
      .setPosition(0.6, 0.3)
      .setSize(0.8, 0.8)
      .setRightAlignment()
      .setDecoration(() => ({ "background-color": "transparent" }))
      .setIcon(getImg("close", "png"), 0, 0)
      .attachToParent(this)
      .addEventListener("mousedown", () => {
        this.close()
      })
  }
  close() {
    super.close()
    this.onmouseup()
    let parent = this.parent
    this.parent.removeComponent(this)
    this.parent = parent
    this.removeAllComponents()
  }
}

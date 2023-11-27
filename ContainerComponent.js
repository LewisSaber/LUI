import Component from "./Component.js"
import { Vector } from "./Math.js"
export default class ComponentContainer extends Component {
  getSize() {
    let desiredHeight = 0
    let desiredWidth = 0
    for (const component of this.componentsOrder) {
      let componentSize = component.getFullSize(new Vector(0, 0))

      if (componentSize.x > desiredWidth) desiredWidth = componentSize.x
      if (componentSize.y > desiredHeight) desiredHeight = componentSize.y
    }
    return new Vector(desiredWidth, desiredHeight)
  }
  onChildResize() {
    this.resize(new Vector(0, 0))
  }

  resizeChildren() {}
}

import Component from "./Component.js"
import { Vector } from "./Math.js"
export default class ComponentContainer extends Component {
  getSize() {
    let desiredHeight = 0
    let desiredWidth = 0
    for (const component of this.componentsOrder) {
      if (component.options.isDesiredContainerChild) {
        let componentSize = component.getFullSize(new Vector(0, 0))
        let componentPosition = component.getPosition(
          new Vector(0, 0),
          componentSize
        )
        let topLeftMarginVector = new Vector(
          component.margin.z,
          component.margin.x
        )
        let finalSize = componentSize
          .add_vec(componentPosition)
          .sub_vec(topLeftMarginVector)

        if (finalSize.x > desiredWidth) desiredWidth = finalSize.x
        if (finalSize.y > desiredHeight) desiredHeight = finalSize.y
      }
    }
    return new Vector(desiredWidth, desiredHeight)
  }
  onChildResize(child) {
    if (child.options.isDesiredContainerChild) this.resize()
  }

  resizeChildren(size) {
    for (const component of this.componentsOrder) {
      if (!component.options.isDesiredContainerChild) component.resize(size)
    }
  }
}

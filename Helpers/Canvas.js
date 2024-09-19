import Component from "../Component.js";
import {Vector} from "../Math.js";


export default class Canvas extends Component
{
    createHTMLElement() {
        this.container = document.createElement("canvas")
    }

    getContext(){
        if(this.isBuilt){
            return this.container.getContext("2d")
        }

    }

    drawImageData(width,height,imageData){
        if(!this.isBuilt){
            return
        }
        this.setSize(new Vector(width,height).scale(1/(Component.getPixelSize()*window.devicePixelRatio)))
        const context = this.getContext()
        this.getContainer().width = width
        this.getContainer().height = height
        context.putImageData(imageData, 0, 0);

    }


}
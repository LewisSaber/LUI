import Button from "./Button.js"
import EventHandler from "./EventHandler.js"
import Input from "./Input.js"

export default class MyFileReader extends EventHandler {
  constructor() {
    super()
    this.input = new Input()
      .setType("file")
      .addAttributes({ accept: ".txt" })
      .build()
    this.button = new Button()

    this.input.addEventListener("change", () => {
      let reader = new FileReader()

      reader.onload = (event) => {
        this.dispatchEvent("load", event.target.result)
      }
      reader.readAsText(this.input.getFile())
    })
    this.button.addEventListener("mousedown", () => {
      this.input.getContainer().click()
    })
  }
  setFilesAccept(files) {
    this.input.addAttributes({ accept: files })
  }

  getButton() {
    return this.button
  }
}

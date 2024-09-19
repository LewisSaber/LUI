import Button from "./Button.js"
import Component from "./Component.js"
import EventHandler from "./EventHandler.js"
import Input from "./Input.js"

export default class MyFileReader extends EventHandler {
  static events = {
    load: "load",
  }
  static readerTypes = {
    binary:"binary",arrayBuffer:"arrayBuffer",url:"url",text:"text"
  }
  constructor() {
    super()
    this.setReaderType(MyFileReader.readerTypes.text)
    /** @type {Input}*/
    this.input = new Input()
      .setType("file")
      .addAttributes({ accept: ".txt" })
      .build()
    this.button = new Button()


    this.input.addEventListener(Input.events.change, (e) => {
      let reader = new FileReader()
      reader.onload = (event) => {
        const res = {
          result :event.target.result,
          file: this.input.getFile()
        }
        this.dispatchEvent(MyFileReader.events.load,res )
        this.button.dispatchEvent(MyFileReader.events.load, res)
      }
      switch (this.readType){
        case MyFileReader.readerTypes.arrayBuffer:
          reader.readAsArrayBuffer(this.input.getFile())
              break
        case MyFileReader.readerTypes.url:
          reader.readAsDataURL(this.input.getFile())
          break
        case MyFileReader.readerTypes.text:
          reader.readAsText(this.input.getFile())
          break
        case MyFileReader.readerTypes.binary:
          reader.readAsBinaryString(this.input.getFile())
          break
      }

    })
    this.button.addEventListener(Component.events.mousedown, () => {
      this.clickUpload()
    })
  }
  setFilesAccept(files) {
    this.input.addAttributes({ accept: files })
    return this
  }
  setReaderType(type){
    this.readType = type
    return this
  }

  clickUpload(){
    this.input.getContainer().click()
  }

  getButton() {
    return this.button
  }
}
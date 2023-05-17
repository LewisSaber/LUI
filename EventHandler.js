import ObjectHelper from "./Helpers/ObjectHelper.js"
import { getUniqueIdentificator } from "./Utility.js"

export default class EventHandler {
  constructor() {
    this.subscribers = {}
  }
  /**
   * Same as JS dispatchEvent
   * @param {String} eventType - Type of Event to Dispatch(Fire)
   * @param {Object} data - Object that is passed to EventHandler Fucntion
   * @returns {EventHandler}
   */
  dispatchEvent(eventType, data) {
    if (this.subscribers[eventType])
      for (const subscriber in this.subscribers[eventType]) {
        let handler = this.subscribers[eventType][subscriber]
        handler.func(data, this)
        if (handler.options.once) delete this.subscribers[eventType][subscriber]
      }
    return this
  }

  /**
   * Removes Listener From Event with type
   * @param {Number} id - Id of EventHandler, Id is given by addEventListener
   * @param {String} eventType - Event to remove handler
   * @returns {EventHandler}
   */
  removeEventListener(eventType, id) {
    if (this.subscribers[eventType]) delete this.subscribers[eventType][id]
    return this
  }

  /**
   * Add listener to said Event, returns Id that can be used to remove Listener
   * @param {String} eventType - Event to add handler
   * @param {Function} func - Function that is Called when event fires, accepts eventData, targeObject
   * @param {Object} id_handler - object whose value field will be assigned to id, used if you want to get both id and get object as return
   * @param {Object} options
   * - once - listener only fires once
   * - return_id - returns id of listener instead of eventHandler object
   * @returns {Number}
   */
  addEventListener(eventType, func, id_handler = {}, options = {}) {
    if (this.subscribers[eventType] == undefined)
      this.subscribers[eventType] = {}

    let id = getUniqueIdentificator()
    id_handler.value = id
    this.subscribers[eventType][id] = { func: func, options: options }

    if (options.return_id) return id
    return this
  }
  copySubscribers() {
    return ObjectHelper.copy(this.subscribers)
  }
  copySubscribersFrom(event_handler) {
    if (event_handler instanceof EventHandler) {
      this.subscribers = event_handler.copySubscribers()
    }
  }
}

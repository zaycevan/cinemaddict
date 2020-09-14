import AbstractView from "./abstract.js";

export default class Smart extends AbstractView {
  constructor() {
    super();

    this._data = {};
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    const scrollPosition = prevElement.scrollTop;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();

    newElement.scrollTop = scrollPosition;
    prevElement = null;
  }

  // updateData(update, justDataUpdating) {
  //   if (!update) {
  //     return;
  //   }

  //   this._data = Object.assign(
  //       {},
  //       this._data,
  //       update
  //   );

  //   if (justDataUpdating) {
  //     return;
  //   }

  //   this.updateElement();
  // }
}

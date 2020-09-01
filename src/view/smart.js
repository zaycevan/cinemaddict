import AbstractView from "./abstract.js";

export default class AbstractSmartComponent extends AbstractView {
  constructor() {
    super();

    if (new.target === AbstractSmartComponent) {
      throw new Error(`Can't instantiate AbstractSmartComponent, only concrete one.`);
    }
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;

    this.restoreHandlers();
  }

  updateData(newEmoji) {
    if (!newEmoji) {
      return;
    }

    this._comments = this._comments.push({
      emoji: newEmoji
    });

    this.updateElement();
  }
}

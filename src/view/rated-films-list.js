import {createElement} from "../utils.js";

const createRatedFilmsListTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
    </section>`
  );
};

export default class RatedFilmsList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createRatedFilmsListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

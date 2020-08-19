import {createElement} from "../utils.js";

const createCommentedFilmsListTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
    </section>`
  );
};

export default class CommentedFilmsList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createCommentedFilmsListTemplate();
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

import {createElement} from "../utils.js";

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;
  const idName = name.toLowerCase();
  const countFilms = (count <= 5) ? `<span class="main-navigation__item-count">${count}</span>` : ` `;

  return `<a href="#${idName}" class="main-navigation__item">${name} ${countFilms}</a>`;
};

export const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
  .map((filter) => createFilterItemTemplate(filter))
  .join(``);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
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

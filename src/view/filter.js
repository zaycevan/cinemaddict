import AbstractView from "./abstract.js";

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

export default class Filter extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}

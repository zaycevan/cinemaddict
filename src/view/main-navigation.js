import AbstractView from "./abstract.js";
import {MainNavigationItem} from "../const.js";

const createFilterItemTemplate = (filter, currentFilterType, currentNavigationItem) => {
  const {type, name, count} = filter;

  const countFilms = (count <= 5) ? `<span class="main-navigation__item-count">${count}</span>` : ` `;

  if (type === `all`) {
    return ``;
  }


  return `<a href="#${type}" class="main-navigation__item ${type === currentFilterType && currentNavigationItem === MainNavigationItem.FILMS ? `main-navigation__item--active` : ``}" data-filter-type="${type}" data-navigation-item="${MainNavigationItem.FILMS}">${name} ${countFilms}</a>`;
};

const createMainNavigationTemplate = (filterItems, currentFilterType, currentNavigationItem) => {
  const filterItemsTemplate = filterItems
  .map((filter) => createFilterItemTemplate(filter, currentFilterType, currentNavigationItem))
  .join(``);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item ${currentFilterType === `all` && currentNavigationItem === MainNavigationItem.FILMS ? `main-navigation__item--active` : ``}" data-filter-type="all" data-navigation-item="${MainNavigationItem.FILMS}">All movies</a>
        ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional ${currentNavigationItem === MainNavigationItem.STATISTICS ? `main-navigation__item--active` : ``}" data-navigation-item="${MainNavigationItem.STATISTICS}">Stats</a>
    </nav>`
  );
};

export default class MainNavigation extends AbstractView {
  constructor(filters, currentFilterType, currentNavigationItem) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._currentNavigationItem = currentNavigationItem;

    this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
    this._mainNavigationClickHandler = this._mainNavigationClickHandler.bind(this);
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filters, this._currentFilter, this._currentNavigationItem);
  }

  _filterTypeClickHandler(evt) {
    if (evt.target.tagName !== `A` || evt.target.dataset.navigationItem !== MainNavigationItem.FILMS) {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeClick(evt.target.dataset.filterType);
  }

  setFilterTypeClickHandler(callback) {
    this._callback.filterTypeClick = callback;
    this.getElement().addEventListener(`click`, this._filterTypeClickHandler);
  }

  _mainNavigationClickHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    if (this._currentNavigationItem !== evt.target.dataset.navigationItem) {
      evt.preventDefault();
      this._callback.mainNavigationClick(evt.target.dataset.navigationItem);
    }
  }

  setMainNavigationClickHandler(callback) {
    this._callback.mainNavigationClick = callback;
    this.getElement().addEventListener(`click`, this._mainNavigationClickHandler);
  }
}

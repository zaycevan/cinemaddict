import {createElement, getRandomInteger} from "../utils.js";

const createFilmStatisticsTemplate = () => {
  return `<p>` + getRandomInteger(1, 100000) + ` movies inside</p>`;
};

export default class FilmStatistics {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmStatisticsTemplate();
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

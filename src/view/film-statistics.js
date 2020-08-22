import AbstractView from "./abstract.js";

const createFilmStatisticsTemplate = (films) => {
  return `<p>` + films.length + ` movies inside</p>`;
};

export default class FilmStatistics extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFilmStatisticsTemplate(this._films);
  }
}

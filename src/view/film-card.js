import {createElement} from "../utils.js";

const isFilmControlActive = (filmControl) => {
  if (!filmControl) {
    return ``;
  }
  return `film-card__controls-item--active`;
};

const createFilmCardTemplate = (film) => {
  const {title, rating, year, duration, genres, poster, description, commentsCount, addToWatchlist, isWatched, isFavorite} = film;

  let shortDescription = description;
  if (description.length > 140) {
    shortDescription = description.slice(0, 139) + `...`;
  }

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isFilmControlActive(addToWatchlist)}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isFilmControlActive(isWatched)}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${isFilmControlActive(isFavorite)}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
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

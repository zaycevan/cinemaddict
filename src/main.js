import {createUserProfileTemplate} from "./view/user-profile.js";
import {createFilterTemplate} from "./view/filter.js";
import {createFilmSortTemplate} from "./view/sort-film.js";
import {createFilmsListContainerTemplate} from "./view/films-list-container.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createRatedFilmsListContainerTemplate} from "./view/rated-films-list-container.js";
import {createCommentedFilmsListContainerTemplate} from "./view/commented-films-list-container.js";
import {generateFilm} from "./mock/film";
// import {createFilmDetailsTemplate} from "./view/film-details.js";
// import {generateComments} from "./mock/comments";
import {generateFilter} from "./mock/filter.js";

const FILM_CARD_COUNT = 15;
const FILM_CARD_COUNT_EXTRA = 2;
// const FILM_COMMENTS_COUNT = 5;

const films = new Array(FILM_CARD_COUNT).fill().map(generateFilm);
// const comments = new Array(FILM_COMMENTS_COUNT).fill().map(generateComments);
const filters = generateFilter(films);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);

render(headerElement, createUserProfileTemplate(), `beforeend`);

const mainElement = document.querySelector(`.main`);

render(mainElement, createFilterTemplate(filters), `beforeend`);
render(mainElement, createFilmSortTemplate(), `beforeend`);
render(mainElement, createFilmsListContainerTemplate(), `beforeend`);

const filmsElement = mainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_CARD_COUNT; i++) {
  render(filmsListContainerElement, createFilmCardTemplate(films[i]), `beforeend`);
}

render(filmsListElement, createShowMoreButtonTemplate(), `beforeend`);

render(filmsElement, createRatedFilmsListContainerTemplate(), `beforeend`);

const ratedFilmsListElement = filmsElement.querySelector(`.films-list--extra`);
const ratedFilmsListContainerElement = ratedFilmsListElement.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_CARD_COUNT_EXTRA; i++) {
  render(ratedFilmsListContainerElement, createFilmCardTemplate(films[i]), `beforeend`);
}

render(filmsElement, createCommentedFilmsListContainerTemplate(), `beforeend`);

const commentedFilmsListElement = filmsElement.querySelector(`.films-list--extra:last-child`);
const commentedFilmsListContainerElement = commentedFilmsListElement.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_CARD_COUNT_EXTRA; i++) {
  render(commentedFilmsListContainerElement, createFilmCardTemplate(films[i]), `beforeend`);
}

// const footerElement = document.querySelector(`.footer`);

// render(footerElement, createFilmDetailsTemplate(films[0], comments, FILM_COMMENTS_COUNT), `afterend`);

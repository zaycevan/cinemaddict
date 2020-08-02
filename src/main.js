import {createUserProfileTemplate} from "./view/user-profile.js";
import {createMainNavigationTemplate} from "./view/main-navigation.js";
import {createFilmSortTemplate} from "./view/film-sort.js";
import {createFilmsListContainerTemplate} from "./view/films-list-container.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createRatedFilmsListContainerTemplate} from "./view/rated-films-list-container.js";
import {createCommentedFilmsListContainerTemplate} from "./view/commented-films-list-container.js";

const FILM_CARD_COUNT = 5;
const FILM_CARD_COUNT_EXTRA = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);

render(headerElement, createUserProfileTemplate(), `beforeend`);

const mainElement = document.querySelector(`.main`);

render(mainElement, createMainNavigationTemplate(), `beforeend`);
render(mainElement, createFilmSortTemplate(), `beforeend`);
render(mainElement, createFilmsListContainerTemplate(), `beforeend`);

const filmsElement = mainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

render(filmsListElement, createShowMoreButtonTemplate(), `beforeend`);

for (let i = 0; i < FILM_CARD_COUNT; i++) {
  render(filmsListContainerElement, createFilmCardTemplate(), `beforeend`);
}

render(filmsElement, createRatedFilmsListContainerTemplate(), `beforeend`);

const ratedFilmsListElement = filmsElement.querySelector(`.films-list--extra`);
const ratedFilmsListContainerElement = ratedFilmsListElement.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_CARD_COUNT_EXTRA; i++) {
  render(ratedFilmsListContainerElement, createFilmCardTemplate(), `beforeend`);
}

render(filmsElement, createCommentedFilmsListContainerTemplate(), `beforeend`);

const commentedFilmsListElement = filmsElement.querySelector(`.films-list--extra:last-child`);
const commentedFilmsListContainerElement = commentedFilmsListElement.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_CARD_COUNT_EXTRA; i++) {
  render(commentedFilmsListContainerElement, createFilmCardTemplate(), `beforeend`);
}

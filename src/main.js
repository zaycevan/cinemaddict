import UserProfileView from "./view/user-profile.js";
import FilterView from "./view/filter.js";
import SortView from "./view/sort.js";
import FilmsBoardView from "./view/films-board.js";
import FilmsListView from "./view/films-list.js";
import FilmsListContainerView from "./view/films-list-container.js";
import FilmCardView from "./view/film-card.js";
import ShowMoreButtonView from "./view/show-more-button.js";
import RatedFilmsListView from "./view/rated-films-list.js";
import CommentedFilmsListView from "./view/commented-films-list.js";
import {generateFilm} from "./mock/film";
import FilmDetailsView from "./view/film-details.js";
import {generateComments} from "./mock/comments";
import {generateFilter} from "./mock/filter.js";
import {render, renderTemplate, RenderPosition, getRandomInteger} from "./utils.js";

const FILM_CARD_COUNT = 19;
const FILM_CARD_COUNT_EXTRA = 2;
const FILM_COMMENTS_COUNT = 5;
const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILM_CARD_COUNT).fill().map(generateFilm);
const comments = new Array(FILM_COMMENTS_COUNT).fill().map(generateComments);
const filters = generateFilter(films);
const statistics = `<p>` + getRandomInteger(1, 100000) + ` movies inside</p>`;

const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, new UserProfileView().getElement(), RenderPosition.BEFOREEND);

const mainElement = document.querySelector(`.main`);

render(mainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new SortView().getElement(), RenderPosition.BEFOREEND);

const renderFilm = (filmListElement, film) => {
  const filmComponent = new FilmCardView(film);
  const filmDetailsComponent = new FilmDetailsView(film, comments, FILM_COMMENTS_COUNT);

  const showFilmDetails = () => {
    closeFilmDetails();
    document.body.appendChild(filmDetailsComponent.getElement());
    filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      closeFilmDetails();
    });
    document.addEventListener(`keydown`, onFilmDetailsEscPress);
  };

  const closeFilmDetails = () => {
    const filmDetails = document.querySelector(`.film-details`);
    if (filmDetails) {
      document.body.removeChild(filmDetails);
    }
    document.removeEventListener(`keydown`, onFilmDetailsEscPress);
  };

  const onFilmDetailsEscPress = function (evt) {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      closeFilmDetails();
      document.removeEventListener(`keydown`, onFilmDetailsEscPress);
    }
  };

  filmComponent.getElement().querySelector(`.film-card__title`).addEventListener(`click`, (evt) => {
    evt.preventDefault();
    showFilmDetails();
  });

  filmComponent.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, (evt) => {
    evt.preventDefault();
    showFilmDetails();
  });

  filmComponent.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, (evt) => {
    evt.preventDefault();
    showFilmDetails();
  });

  render(filmListElement, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

const filmsBoard = new FilmsBoardView();

render(mainElement, filmsBoard.getElement(), RenderPosition.BEFOREEND);

const filmsList = new FilmsListView();

render(filmsBoard.getElement(), filmsList.getElement(), RenderPosition.BEFOREEND);

const filmsListComponent = new FilmsListContainerView();

render(filmsList.getElement(), filmsListComponent.getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderFilm(filmsListComponent.getElement(), films[i]);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();

  render(filmsList.getElement(), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  showMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films.slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP).forEach((film) => renderFilm(filmsListComponent.getElement(), film));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
}

const ratedFilmsList = new RatedFilmsListView();

render(filmsBoard.getElement(), ratedFilmsList.getElement(), RenderPosition.BEFOREEND);

const ratedFilmsListComponent = new FilmsListContainerView();

render(ratedFilmsList.getElement(), ratedFilmsListComponent.getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < FILM_CARD_COUNT_EXTRA; i++) {
  renderFilm(ratedFilmsListComponent.getElement(), films[i]);
}

const commentedFilmsList = new CommentedFilmsListView();

render(filmsBoard.getElement(), commentedFilmsList.getElement(), RenderPosition.BEFOREEND);

const commentedFilmsListComponent = new FilmsListContainerView();

render(commentedFilmsList.getElement(), commentedFilmsListComponent.getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < FILM_CARD_COUNT_EXTRA; i++) {
  renderFilm(commentedFilmsListComponent.getElement(), films[i]);
}

const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);

renderTemplate(footerStatisticsElement, statistics, `beforeend`);

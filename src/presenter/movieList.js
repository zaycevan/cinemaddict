import SortView from "../view/sort.js";
import FilmsBoardView from "../view/films-board.js";
import FilmsListView from "../view/films-list.js";
import NoFilmView from "../view/no-film.js";
import FilmsListContainerView from "../view/films-list-container.js";
import FilmCardView from "../view/film-card.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import RatedFilmsListView from "../view/rated-films-list.js";
import CommentedFilmsListView from "../view/commented-films-list.js";
import FilmDetailsView from "../view/film-details.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {FILM_CARD_COUNT} from "../main.js";
import {sortFilmData, sortFilmRating} from "../utils/film.js";
import {SortType} from "../const.js";

const FILM_COUNT_PER_STEP = 5;
const FILM_CARD_COUNT_EXTRA = 2;

export default class MovieList {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._renderedExtraFilmCount = (FILM_CARD_COUNT_EXTRA < FILM_CARD_COUNT) ? FILM_CARD_COUNT_EXTRA : FILM_CARD_COUNT;
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._filmsBoard = new FilmsBoardView();
    this._filmsList = new FilmsListView();
    this._filmsListComponent = new FilmsListContainerView();
    this._ratedFilmsList = new RatedFilmsListView();
    this._ratedFilmsListComponent = new FilmsListContainerView();
    this._commentedFilmsList = new CommentedFilmsListView();
    this._commentedFilmsListComponent = new FilmsListContainerView();
    this._noFilmComponent = new NoFilmView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardFilms, comments) {
    this._boardFilms = boardFilms.slice();
    this._sourcedBoardFilms = boardFilms.slice();
    this._comments = comments;

    this._renderSort();
    this._renderBoard();
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._boardFilms.sort(sortFilmData);
        break;
      case SortType.RATING:
        this._boardFilms.sort(sortFilmRating);
        break;
      default:
        this._boardFilms = this._sourcedBoardFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderFilmList();
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilm(film, filmsListComponent) {
    const filmComponent = new FilmCardView(film);
    const filmDetailsComponent = new FilmDetailsView(film, this._comments);

    const showFilmDetails = () => {
      closeFilmDetails();
      document.body.appendChild(filmDetailsComponent.getElement());

      filmDetailsComponent.setCloseClickHandler(() => {
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

    filmComponent.setCardClickHandler(() => {
      showFilmDetails();
    });

    render(filmsListComponent, filmComponent, RenderPosition.BEFOREEND);
  }

  _renderFilms(from, to) {
    this._boardFilms
      .slice(from, to)
      .forEach((boardFilm) => this._renderFilm(boardFilm, this._filmsListComponent));
  }

  _renderRatedFilms(from, to) {
    this._boardFilms
      .slice()
      .sort(function (left, right) {
        return right.rating - left.rating;
      })
      .slice(from, to)
      .forEach((boardFilm) => this._renderFilm(boardFilm, this._ratedFilmsListComponent));
  }

  _renderCommentedFilms(from, to) {
    this._boardFilms
      .slice()
      .sort(function (left, right) {
        return right.commentsCount - left.commentsCount;
      })
      .slice(from, to)
      .forEach((boardFilm) => this._renderFilm(boardFilm, this._commentedFilmsListComponent));
  }

  _renderNoFilm() {
    render(this._boardContainer, this._noFilmComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    this._renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._boardFilms.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmList() {
    this._filmsListComponent.getElement().innerHTML = ``;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
  }

  _renderFilmList() {
    this._renderFilms(0, Math.min(this._boardFilms.length, FILM_COUNT_PER_STEP));

    if (this._boardFilms.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderRatedFilmList() {
    this._renderRatedFilms(0, this._renderedExtraFilmCount);
  }

  _renderCommentedFilmList() {
    this._renderCommentedFilms(0, this._renderedExtraFilmCount);
  }

  _renderBoard() {
    if (this._boardFilms.length === 0) {
      this._renderNoFilm();
      return;
    }

    render(this._boardContainer, this._filmsBoard, RenderPosition.BEFOREEND);
    render(this._filmsBoard, this._filmsList, RenderPosition.BEFOREEND);
    render(this._filmsList, this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsBoard, this._ratedFilmsList, RenderPosition.BEFOREEND);
    render(this._ratedFilmsList, this._ratedFilmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsBoard, this._commentedFilmsList, RenderPosition.BEFOREEND);
    render(this._commentedFilmsList, this._commentedFilmsListComponent, RenderPosition.BEFOREEND);

    this._renderFilmList();
    this._renderRatedFilmList();
    this._renderCommentedFilmList();
  }
}

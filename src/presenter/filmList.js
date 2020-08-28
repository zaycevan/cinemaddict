import SortView from "../view/sort.js";
import FilmsBoardView from "../view/films-board.js";
import FilmsListView from "../view/films-list.js";
import NoFilmView from "../view/no-film.js";
import FilmsListContainerView from "../view/films-list-container.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import RatedFilmsListView from "../view/rated-films-list.js";
import CommentedFilmsListView from "../view/commented-films-list.js";
import FilmPresenter from "./film.js";
import {updateItem} from "../utils/common.js";
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
    this._filmPresenter = {};
    this._filmPresenterRated = {};
    this._filmPresenterCommented = {};

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

    this._handleFilmChange = this._handleFilmChange.bind(this);
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

  _handleFilmChange(updatedFilm) {
    this._boardFilms = updateItem(this._boardFilms, updatedFilm);
    this._sourcedBoardFilms = updateItem(this._sourcedBoardFilms, updatedFilm);

    if (this._filmPresenter.hasOwnProperty(updatedFilm.id)) {
      this._filmPresenter[updatedFilm.id].init(updatedFilm, this._comments);
    }
    if (this._filmPresenterRated.hasOwnProperty(updatedFilm.id)) {
      this._filmPresenterRated[updatedFilm.id].init(updatedFilm, this._comments);
    }
    if (this._filmPresenterCommented.hasOwnProperty(updatedFilm.id)) {
      this._filmPresenterCommented[updatedFilm.id].init(updatedFilm, this._comments);
    }
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

  _renderFilm(film, filmListContainer) {
    const filmPresenter = new FilmPresenter(filmListContainer, this._handleFilmChange);
    filmPresenter.init(film, this._comments);
    switch (filmListContainer) {
      case this._ratedFilmsListComponent:
        this._filmPresenterRated[film.id] = filmPresenter;
        break;
      case this._commentedFilmsListComponent:
        this._filmPresenterCommented[film.id] = filmPresenter;
        break;
      default:
        this._filmPresenter[film.id] = filmPresenter;
    }
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
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    // Object
    // .values(this._filmPresenterRated)
    // .forEach((presenter) => presenter.destroy());
    // this._filmPresenterRated = {};
    // Object
    // .values(this._filmPresenterCommented)
    // .forEach((presenter) => presenter.destroy());
    // this._filmPresenterCommented = {};
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

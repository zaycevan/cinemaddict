import SortView from "../view/sort.js";
import FilmsBoardView from "../view/films-board.js";
import FilmsListView from "../view/films-list.js";
import LoadingView from "../view/loading.js";
import NoFilmView from "../view/no-film.js";
import FilmsListContainerView from "../view/films-list-container.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import RatedFilmsListView from "../view/rated-films-list.js";
import CommentedFilmsListView from "../view/commented-films-list.js";
import FilmPresenter from "./film.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortFilmData, sortFilmRating} from "../utils/film.js";
import {filter} from "../utils/filter.js";
import {SortType, UpdateType, UserAction} from "../const.js";

const FILM_COUNT_PER_STEP = 5;
const FILM_CARD_COUNT_EXTRA = 2;

export default class MovieList {
  constructor(boardContainer, filmsModel, commentsModel, filterModel, api) {
    this._boardContainer = boardContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._api = api;

    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};
    this._filmPresenterRated = {};
    this._filmPresenterCommented = {};
    this._filmPresenterModes = [];
    this._filmPresenterRatedModes = [];
    this._filmPresenterCommentedModes = [];
    this._isLoading = true;
    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._filmsBoard = new FilmsBoardView();
    this._filmsList = new FilmsListView();
    this._filmsListComponent = new FilmsListContainerView();
    this._ratedFilmsList = new RatedFilmsListView();
    this._ratedFilmsListComponent = new FilmsListContainerView();
    this._commentedFilmsList = new CommentedFilmsListView();
    this._commentedFilmsListComponent = new FilmsListContainerView();
    this._loadingComponent = new LoadingView();
    this._noFilmComponent = new NoFilmView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._renderBoard();

    this._filterModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});

    this._filterModel.removeObserver(this._handleModelEvent);
    this._filmsModel.removeObserver(this._handleModelEvent);
    this._commentsModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortFilmData);
      case SortType.RATING:
        return filtredFilms.sort(sortFilmRating);
    }

    return filtredFilms;
  }

  _getRatedFilms() {
    return this._filmsModel.getFilms()
    .slice()
    .sort(function (left, right) {
      return right.rating - left.rating;
    });
  }

  _getCommentedFilms() {
    return this._filmsModel.getFilms()
    .slice()
    .sort(function (left, right) {
      return right.commentsCount - left.commentsCount;
    });
  }

  _handleViewAction(actionType, updateType, updateFilm, updateComment) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(updateFilm).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, updateFilm, updateComment);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, updateFilm, updateComment);
        break;
    }
  }

  _handleModelEvent(updateType, film) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT_POPUP:
        this._filmPresenter[film.id].showFilmDetails();
        break;
    }
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
    Object
      .values(this._filmPresenterRated)
      .forEach((presenter) => presenter.resetView());
    Object
      .values(this._filmPresenterCommented)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({resetRenderedFilmCount: true});
    this._renderBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _restoreMode(filmPresenter, film, modes) {
    const index = modes.findIndex((mode) => mode.id === film.id);

    if (modes[index] && modes[index].mode === `POPUP`) {
      filmPresenter.showFilmDetails();
    }
  }

  _renderFilm(film, filmListContainer, modes) {
    const filmPresenter = new FilmPresenter(filmListContainer, this._handleViewAction, this._handleModeChange, this._commentsModel, this._api);
    filmPresenter.renderFilmCard(film);
    this._restoreMode(filmPresenter, film, modes);

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

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(film, this._filmsListComponent, this._filmPresenterModes));
  }

  _renderRatedFilms(films) {
    films.forEach((film) => this._renderFilm(film, this._ratedFilmsListComponent, this._filmPresenterRatedModes));
  }

  _renderCommentedFilms(films) {
    films.forEach((film) => this._renderFilm(film, this._commentedFilmsListComponent, this._filmPresenterCommentedModes));
  }

  _renderLoading() {
    render(this._boardContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderNoFilm() {
    render(this._boardContainer, this._noFilmComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(films);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _renderRatedFilmList() {
    const renderedExtraFilmCount = (FILM_CARD_COUNT_EXTRA < this._getFilms().length) ? FILM_CARD_COUNT_EXTRA : this._getFilms().length;
    const films = this._getRatedFilms().slice(0, renderedExtraFilmCount);

    this._renderRatedFilms(films);
  }

  _renderCommentedFilmList() {
    const renderedExtraFilmCount = (FILM_CARD_COUNT_EXTRA < this._getFilms().length) ? FILM_CARD_COUNT_EXTRA : this._getFilms().length;
    const films = this._getCommentedFilms().slice(0, renderedExtraFilmCount);

    this._renderCommentedFilms(films);
  }

  _clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => {
        this._filmPresenterModes.push(presenter.getMode());
        presenter.destroy();
      });
    this._filmPresenter = {};
    Object
      .values(this._filmPresenterRated)
      .forEach((presenter) => {
        this._filmPresenterRatedModes.push(presenter.getMode());
        presenter.destroy();
      });
    this._filmPresenterRated = {};
    Object
      .values(this._filmPresenterCommented)
      .forEach((presenter) => {
        this._filmPresenterCommentedModes.push(presenter.getMode());
        presenter.destroy();
      });
    this._filmPresenterCommented = {};

    remove(this._sortComponent);
    remove(this._loadingComponent);
    remove(this._noFilmComponent);
    remove(this._showMoreButtonComponent);
    remove(this._filmsBoard);
    remove(this._filmsList);
    remove(this._filmsListComponent);
    remove(this._ratedFilmsList);
    remove(this._ratedFilmsListComponent);
    remove(this._commentedFilmsList);
    remove(this._commentedFilmsListComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    const films = this._getFilms();
    const filmCount = films.length;

    this._renderSort();

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (filmCount === 0) {
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


    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedFilmCount)));

    if (filmCount > this._renderedFilmCount) {
      this._renderShowMoreButton();
    }

    this._renderRatedFilmList();
    this._renderCommentedFilmList();

    this._filmPresenterModes = [];
    this._filmPresenterRatedModes = [];
    this._filmPresenterCommentedModes = [];
  }
}

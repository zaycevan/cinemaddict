import FilmCardView from "../view/film-card.js";
import FilmDetailsView from "../view/film-details.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {generateId} from "../utils/common.js";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

export default class Film {
  constructor(filmListContainer, changeData, changeMode, commentsModel, api) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._commentsModel = commentsModel;
    this._api = api;

    this._filmComponent = null;
    this._filmDetailsComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleCardClick = this._handleCardClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleToWatchlistClick = this._handleToWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  renderFilmCard(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;

    this._filmComponent = new FilmCardView(this._film);

    this._filmComponent.setCardClickHandler(this._handleCardClick);
    this._filmComponent.setToWatchlistClickHandler(this._handleToWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this._filmListContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmListContainer.getElement().contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeFilmDetails();
    }
  }

  getMode() {
    return {
      id: this._film.id,
      mode: this._mode
    };
  }

  showFilmDetails() {
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmDetailsComponent = new FilmDetailsView(this._film, this._commentsModel.getComments());

    this._filmDetailsComponent.setCloseClickHandler(this._handleCloseClick);
    this._filmDetailsComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._filmDetailsComponent.setToWatchlistClickHandler(this._handleToWatchlistClick);
    this._filmDetailsComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailsComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (document.body.contains(prevFilmDetailsComponent.getElement())) {
      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
    }

    remove(prevFilmDetailsComponent);

    document.body.appendChild(this._filmDetailsComponent.getElement());
    this._filmDetailsComponent.restoreHandlers();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _getComments() {
    this._api.getComments(this._film)
      .then((comments) => {
        this._commentsModel.setComments(comments);
        this.showFilmDetails();
      })
      .catch(() => {
        console.log(`z`);
        this.showFilmDetails();
      });
  }

  _closeFilmDetails() {
    remove(this._filmDetailsComponent);
    this._filmDetailsComponent.resetNewComment();

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._closeFilmDetails();
    }
  }

  _handleCardClick() {
    this._getComments();
  }

  _handleFormSubmit(emojiName, textComment) {
    const newComment = {
      id: generateId(),
      text: textComment,
      date: new Date(),
      emoji: emojiName
    };

    this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.MINOR,
        this._film,
        newComment
    );
  }


  _handleToWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              addToWatchlist: !this._film.addToWatchlist
            }
        )
    );
  }

  _handleWatchedClick() {
    if (!this._film.isWatched) {
      this._film.watchingDate = new Date();
    } else {
      this._film.watchingDate = null;
    }
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _handleDeleteClick(commentId) {
    const id = parseInt(commentId, 10);
    const index = this._comments.findIndex((comment) => comment.id === id);

    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.MINOR,
        this._film,
        this._comments[index]
    );
  }

  _handleCloseClick() {
    this._closeFilmDetails();
  }
}

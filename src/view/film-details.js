import he from "he";
import SmartView from "./smart.js";
import {formatDuration, formatReleaseDate, formatCommentDate} from "../utils/film.js";
// import {createElement} from "../utils/render.js";

const isFilmControlActive = (filmControl) => {
  if (!filmControl) {
    return ``;
  }
  return `checked`;
};

const createCommentsTemplate = (filmId, comment) => {
  const {id, author, text, date, emoji} = comment;

  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${text ? he.encode(text) : ``}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${formatCommentDate(date)}</span>
                <button class="film-details__comment-delete" data-film-id="${filmId}" data-comment-id="${id}">Delete</button>
              </p>
            </div>
          </li>`;
};

const getEmojiName = (emoji) => {
  const index = emoji.lastIndexOf(`/`);
  let emojiName;
  if (index === -1) {
    emojiName = emoji.substring(0, emoji.length - 4);
  } else {
    emojiName = emoji.substring(index + 1, emoji.length - 4);
  }

  return emojiName;
};

const createEmojiTemplate = (emoji) => {
  if (!emoji) {
    return ``;
  }
  const emojiName = getEmojiName(emoji);

  return `<img src="./images/emoji/${emojiName}.png" width="55" height="55" alt="emoji-${emojiName}">`;
};

// const createEmojiElement = (emoji) => {
//   return createElement(createEmojiTemplate(emoji));
// };

const isEmojiChecked = (emojiType, emojiSelected) => {
  if (!emojiSelected) {
    return ``;
  }
  const emojiName = getEmojiName(emojiSelected);
  if (emojiType === emojiName) {
    return `checked`;
  } else {
    return ``;
  }
};

const createFilmDetailsTemplate = (film, comments, emoji, textComment) => {
  const {id, title, titleOriginal, poster, rating, director, writers, actors, releaseDate, duration, country, genres, description, ageRating, addToWatchlist, isWatched, isFavorite} = film;

  const commentsCount = comments.length;
  const genreName = (genres.length === 1) ? `Genre` : `Genres`;

  const genresTemplate = genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``);

  const commentsTemplate = comments.map((comment) => createCommentsTemplate(id, comment)).join(``);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${titleOriginal}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formatReleaseDate(releaseDate)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formatDuration(duration)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genreName}</td>
                  <td class="film-details__cell">
                    ${genresTemplate}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isFilmControlActive(addToWatchlist)}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isFilmControlActive(isWatched)}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFilmControlActive(isFavorite)}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsTemplate}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">${createEmojiTemplate(emoji)}</div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${textComment ? he.encode(textComment) : ``}</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${isEmojiChecked(`smile`, emoji)}>
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${isEmojiChecked(`sleeping`, emoji)}>
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${isEmojiChecked(`puke`, emoji)}>
                <label class="film-details__emoji-label" for="emoji-puke" >
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${isEmojiChecked(`angry`, emoji)}>
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetails extends SmartView {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;
    this._emoji = null;
    this._textComment = null;

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._toWatchlistClickHandler = this._toWatchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film, this._comments, this._emoji, this._textComment);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseClickHandler(this._callback.click);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setToWatchlistClickHandler(this._callback.toWatchlist);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, this._emojiClickHandler);

    this.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, this._commentInputHandler);
  }

  resetNewComment() {
    this._emoji = null;
    this._textComment = null;
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setCloseClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeClickHandler);
  }

  _formSubmitHandler(evt) {
    if (evt.key === `Enter` && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();
      if (!this._emoji || !this._textComment) {
        throw new Error(`Can't submit`);
      }
      const emojiName = getEmojiName(this._emoji);
      this._callback.formSubmit(emojiName, this._textComment);
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`keydown`, this._formSubmitHandler);
  }


  _toWatchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.toWatchlist();
  }

  setToWatchlistClickHandler(callback) {
    this._callback.toWatchlist = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._toWatchlistClickHandler);
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();
    const newEmojiContainer = this.getElement().querySelector(`.film-details__add-emoji-label`);

    if (evt.target && evt.target.tagName.toLowerCase() === `img`) {
      if (newEmojiContainer.children.length) {
        newEmojiContainer.removeChild(newEmojiContainer.firstChild);
      }
      this._emoji = evt.target.src;
      this.updateElement();
      // newEmojiContainer.appendChild(createEmojiElement(this._emoji));
    }
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this._textComment = evt.target.value;
  }

  _commentDeleteClickHandler(evt) {
    evt.preventDefault();
    if (evt.target && evt.target.classList.contains(`film-details__comment-delete`)) {

      this._callback.deleteClick(evt.target.dataset.commentId);
    }
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, this._commentDeleteClickHandler);
  }
}

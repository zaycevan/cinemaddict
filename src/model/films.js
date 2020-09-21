import Observer from "../utils/observer.js";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    return {
      id: film.id,
      commentsId: film.comments,
      title: film.film_info.title,
      titleOriginal: film.film_info.alternative_title,
      poster: film.film_info.poster,
      rating: film.film_info.total_rating,
      director: film.film_info.director,
      writers: film.film_info.writers,
      actors: film.film_info.actors,
      releaseDate: new Date(film.film_info.release.date),
      duration: film.film_info.runtime,
      country: film.film_info.release.release_country,
      genres: film.film_info.genre,
      description: film.film_info.description,
      ageRating: film.film_info.age_rating,
      addToWatchlist: film.user_details.watchlist,
      isWatched: film.user_details.already_watched,
      watchingDate: film.user_details.watching_date !== null ? new Date(film.user_details.watching_date) : film.user_details.watching_date,
      isFavorite: film.user_details.favorite,
    };
  }

  static adaptToServer(film) {
    return {
      "id": film.id,
      "comments": film.commentsId,
      "film_info": {
        "title": film.title,
        "alternative_title": film.titleOriginal,
        "total_rating": film.rating,
        "poster": film.poster,
        "age_rating": film.ageRating,
        "director": film.director,
        "writers": film.writers,
        "actors": film.actors,
        "release": {
          "date": film.releaseDate instanceof Date ? film.releaseDate.toISOString() : null,
          "release_country": film.country
        },
        "runtime": film.duration,
        "genre": film.genres,
        "description": film.description
      },
      "user_details": {
        "watchlist": film.addToWatchlist,
        "already_watched": film.isWatched,
        "watching_date": film.watchingDate !== null ? film.watchingDate.toISOString() : null,
        "favorite": film.isFavorite
      }
    };
  }
}

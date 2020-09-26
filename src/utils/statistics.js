import moment from "moment";
import {filter} from "../utils/filter.js";
import {UserRank, FilterType, StatisticsPeriod} from "../const.js";

export const getWatchedFilmsDuringPeriod = (films, period) => {
  const watchedFilms = filter[FilterType.HISTORY](films);

  if (period === StatisticsPeriod.ALL_TIME.value) {
    return watchedFilms;
  }

  const periodTime = moment().startOf(period);
  const filteredFilms = watchedFilms.filter((film) => moment(periodTime).isBefore(film.watchingDate));

  return filteredFilms;
};

export const getUserRank = (films) => {
  const watchedFilms = getWatchedFilmsDuringPeriod(films, StatisticsPeriod.ALL_TIME.value);
  const watchedFilmsCount = watchedFilms.length;

  if (watchedFilmsCount >= 1 && watchedFilmsCount <= 10) {
    return UserRank.NOVICE;
  } else if (watchedFilmsCount >= 11 && watchedFilmsCount <= 20) {
    return UserRank.FAN;
  } else if (watchedFilmsCount > 20) {
    return UserRank.MOVIE_BUFF;
  }
  return UserRank.ZERO;
};

export const makeItemsUniq = (items) => [...new Set(items)];

export const countFilmsByGenre = (films, genre) => {
  return films.filter((film) => film.genres.includes(genre)).length;
};

export const getGenres = (array, result = []) => {
  array.forEach((element) => {
    if (Array.isArray(element)) {
      getGenres(element, result);
    } else {
      result.push(element);
    }
  });
  return result;
};

export const getSortedGenres = (films) => {
  const genres = films.map((film) => film.genres);
  const filmGenres = getGenres(genres);
  const uniqGenres = makeItemsUniq(filmGenres);

  const filmByGenreCounts = uniqGenres.map((genre) => countFilmsByGenre(films, genre));

  const sortedGenreCounts = {};

  uniqGenres.forEach((element, index) => {
    sortedGenreCounts[element] = filmByGenreCounts[index];
  });

  return uniqGenres.sort((a, b) => sortedGenreCounts[b] - sortedGenreCounts[a]);
};

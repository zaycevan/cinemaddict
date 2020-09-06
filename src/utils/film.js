import moment from "moment";

const compareTitles = function (titleA, titleB) {
  if (titleA > titleB) {
    return 1;
  } else if (titleA < titleB) {
    return -1;
  }
  return 0;
};

export const sortFilmData = (filmA, filmB) => {
  let dataDiff = filmB.releaseDate.getTime() - filmA.releaseDate.getTime();

  if (dataDiff === 0) {
    dataDiff = compareTitles(filmA.title, filmB.title);
  }

  return dataDiff;
};

export const sortFilmRating = (filmA, filmB) => {
  let ratingDiff = filmB.rating - filmA.rating;

  if (ratingDiff === 0) {
    ratingDiff = compareTitles(filmA.title, filmB.title);
  }

  return ratingDiff;
};

export const formatDuration = (filmDuration) => {

  return moment().startOf(`day`).add(filmDuration, `minutes`).format(`H[h] m[m]`);
};

export const formatReleaseDate = (releaseDate, justYear = false) => {
  if (!(releaseDate instanceof Date)) {
    return ``;
  }

  if (justYear) {
    return moment(releaseDate).format(`YYYY`);
  }

  return moment(releaseDate).format(`DD MMMM YYYY`);
};

export const formatCommentDate = (commentDate) => {
  if (!(commentDate instanceof Date)) {
    return ``;
  }
  if (Math.abs(moment().diff(commentDate, `s`)) < 5) {
    return `now`;
  }
  return moment(commentDate).fromNow();
};

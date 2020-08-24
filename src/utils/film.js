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

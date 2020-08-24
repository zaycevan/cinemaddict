import {getRandomInteger, getRandomItem} from "../utils/common.js";

const generateFilmTitle = () => {
  const TITLE = [
    `The Dance of Life`,
    `Sagebrush Trail`,
    `The Man with the Golden Arm`,
    `Santa Claus Conquers the Martians`
  ];

  return getRandomItem(TITLE);
};

const generateReleaseDate = () => {
  const releaseDate = new Date();

  releaseDate.setHours(23, 59, 59, 999);
  releaseDate.setFullYear(getRandomInteger(1920, 1980), getRandomInteger(0, 11), getRandomInteger(1, 31));

  return new Date(releaseDate);
};

const generateFilmDuration = () => {
  const filmDuration = getRandomInteger(1, 3) + `h ` + getRandomInteger(0, 59) + `m`;

  return filmDuration;
};

const generateFilmGenre = () => {
  const GENRE = [
    `Musical`,
    `Western`,
    `Drama`,
    `Comedy`
  ];
  const randomGenresSet = new Set();

  for (let i = 0; i < getRandomInteger(1, GENRE.length); i++) {
    randomGenresSet.add(getRandomItem(GENRE));
  }
  const randomGenresArray = Array.from(randomGenresSet);

  return randomGenresArray;
};

const generateFilmPoster = () => {
  const poster = [
    `the-dance-of-life.jpg`,
    `sagebrush-trail.jpg`,
    `the-man-with-the-golden-arm.jpg`,
    `santa-claus-conquers-the-martians.jpg`
  ];

  return getRandomItem(poster);
};

const generateFilmDescription = () => {
  const DESCRIPTIONS = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];
  const randomDescriptions = new Set();

  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    randomDescriptions.add(getRandomItem(DESCRIPTIONS));
  }

  return Array.from(randomDescriptions).join(` `);
};

export const generateFilm = () => {

  return {
    title: generateFilmTitle(),
    titleOriginal: generateFilmTitle(),
    poster: generateFilmPoster(),
    rating: (Math.random() * 10).toFixed(1),
    director: `Anthony Mann`,
    writers: `Anne Wigton, Heinz Herald`,
    actors: `Erich von Stroheim, Mary Beth Hughes`,
    releaseDate: generateReleaseDate(),
    duration: generateFilmDuration(),
    country: `Russia`,
    genres: generateFilmGenre(),
    description: generateFilmDescription(),
    ageRating: getRandomInteger(12, 18),
    commentsCount: getRandomInteger(1, 5),
    addToWatchlist: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};


const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

const generateFilmDuration = () => {
  const filmDuration = getRandomInteger(0, 3) + `h ` + getRandomInteger(0, 59) + `m`;

  return filmDuration;
};

const generateFilmGenre = () => {
  const genre = [
    `Musical`,
    `Western`,
    `Drama`,
    `Comedy`
  ];

  return getRandomItem(genre);
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

const generateDescription = () => {
  const descriptions = [
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
    randomDescriptions.add(getRandomItem(descriptions));
  }

  return Array.from(randomDescriptions).join(` `);
};

export const generateFilmCard = () => {
  return {
    title: `The Dance of Life`,
    poster: generateFilmPoster(),
    rating: getRandomInteger(0, 10),
    year: getRandomInteger(1920, 1980),
    duration: generateFilmDuration(),
    genre: generateFilmGenre(),
    description: generateDescription(),
    comments: getRandomInteger(1, 5)
  };
};

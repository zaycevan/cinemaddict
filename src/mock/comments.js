const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

const generateCommentEmoji = () => {
  const emoji = [
    `smile.png`,
    `sleeping.png`,
    `puke.png`,
    `angry.png`
  ];

  return getRandomItem(emoji);
};

const generateCommentText = () => {
  const text = [
    `Interesting setting and a good cast`,
    `Booooooooooring`,
    `Very very old. Meh`,
    `Almost two hours? Seriously?`
  ];

  return getRandomItem(text);
};

const generateCommentAthor = () => {
  const author = [
    `Tim Macoveev`,
    `John Doe`,
    `Erick Clark`
  ];

  return getRandomItem(author);
};

const generateCommentDate = () => {
  const currentDate = new Date();

  currentDate.setHours(getRandomInteger(0, 23), getRandomInteger(0, 59), getRandomInteger(0, 59), 999);
  currentDate.setFullYear(getRandomInteger(2018, 2020), getRandomInteger(0, 11), getRandomInteger(1, 31));

  const commentDate = currentDate.getFullYear() + `/` + (currentDate.getMonth() + 1) + `/` + currentDate.getDate() + ` ` + currentDate.getHours() + `:` + currentDate.getMinutes();

  return commentDate;
};

export const generateComments = () => {
  return {
    count: getRandomInteger(1, 20),
    emoji: generateCommentEmoji(),
    text: generateCommentText(),
    author: generateCommentAthor(),
    date: generateCommentDate(),
  };
};

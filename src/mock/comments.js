import {getRandomInteger, getRandomItem} from "../utils/common.js";

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
  currentDate.setFullYear(2020, getRandomInteger(6, 8), getRandomInteger(1, 6));

  return new Date(currentDate);
};

export const generateComments = () => {
  return {
    emoji: generateCommentEmoji(),
    text: generateCommentText(),
    author: generateCommentAthor(),
    date: generateCommentDate(),
  };
};

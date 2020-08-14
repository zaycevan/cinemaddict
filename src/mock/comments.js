import {getRandomInteger, getRandomItem} from "../utils.js";

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
    emoji: generateCommentEmoji(),
    text: generateCommentText(),
    author: generateCommentAthor(),
    date: generateCommentDate(),
  };
};

import AbstractView from "./abstract.js";

const createFilmsBoardTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class FilmsBoard extends AbstractView {
  getTemplate() {
    return createFilmsBoardTemplate();
  }
}

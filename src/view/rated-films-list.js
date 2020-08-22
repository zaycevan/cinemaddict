import AbstractView from "./abstract.js";

const createRatedFilmsListTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
    </section>`
  );
};

export default class RatedFilmsList extends AbstractView {
  getTemplate() {
    return createRatedFilmsListTemplate();
  }
}

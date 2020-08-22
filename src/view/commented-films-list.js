import AbstractView from "./abstract.js";

const createCommentedFilmsListTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
    </section>`
  );
};

export default class CommentedFilmsList extends AbstractView {
  getTemplate() {
    return createCommentedFilmsListTemplate();
  }
}

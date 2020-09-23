import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = {};
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, updateFilm, updateComments) {
    this._comments = updateComments;

    this._notify(updateType, updateFilm);
  }

  deleteComment(updateType, updateFilm, updateComment) {
    const index = this._comments.findIndex((comment) => comment.id === updateComment.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateType, updateFilm);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          text: comment.comment,
          date: comment.date !== null ? new Date(comment.date) : comment.date,
          emoji: comment.emotion
        }
    );

    delete adaptedComment.comment;
    delete adaptedComment.emotion;

    return adaptedComment;
  }

  static adaptToServer(comment) {
    return {
      "comment": comment.text,
      "date": comment.date instanceof Date ? comment.date.toISOString() : null,
      "emotion": comment.emoji
    };
  }
}

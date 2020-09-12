import UserProfileView from "./view/user-profile.js";
import FilmStatisticsView from "./view/film-statistics.js";
import {generateFilm} from "./mock/film";
import {generateComments} from "./mock/comments";
import FilterPresenter from "./presenter/filter.js";
import FilmListPresenter from "./presenter/filmList.js";
import FilterModel from "./model/filter.js";
import FilmsModel from "./model/films.js";
import CommentsModel from "./model/comment.js";
import {render, RenderPosition} from "./utils/render.js";

export const FILM_CARD_COUNT = 11;
const FILM_COMMENTS_COUNT = 5;

const films = new Array(FILM_CARD_COUNT).fill().map(generateFilm);
const comments = new Array(FILM_COMMENTS_COUNT).fill().map(generateComments);

const filterModel = new FilterModel();

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatistics = document.querySelector(`.footer__statistics`);

render(siteHeaderElement, new UserProfileView(), RenderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);

filterPresenter.init();
filmListPresenter.init();

render(siteFooterStatistics, new FilmStatisticsView(films), RenderPosition.BEFOREEND);

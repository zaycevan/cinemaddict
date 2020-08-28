import UserProfileView from "./view/user-profile.js";
import FilterView from "./view/filter.js";
import FilmStatisticsView from "./view/film-statistics.js";
import {generateFilm} from "./mock/film";
import {generateComments} from "./mock/comments";
import {generateFilter} from "./mock/filter.js";
import FilmListPresenter from "./presenter/filmList.js";
import {render, RenderPosition} from "./utils/render.js";

export const FILM_CARD_COUNT = 11;
const FILM_COMMENTS_COUNT = 5;

const films = new Array(FILM_CARD_COUNT).fill().map(generateFilm);
const comments = new Array(FILM_COMMENTS_COUNT).fill().map(generateComments);
const filters = generateFilter(films);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatistics = document.querySelector(`.footer__statistics`);

const filmListPresenter = new FilmListPresenter(siteMainElement);

render(siteHeaderElement, new UserProfileView(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterView(filters), RenderPosition.BEFOREEND);

filmListPresenter.init(films, comments);

render(siteFooterStatistics, new FilmStatisticsView(films), RenderPosition.BEFOREEND);

import UserProfileView from "./view/user-profile.js";
import FooterStatisticsView from "./view/footer-statistics.js";
import MainNavigationPresenter from "./presenter/mainNavigation.js";
import FilmListPresenter from "./presenter/filmList.js";
import FilterModel from "./model/filter.js";
import FilmsModel from "./model/films.js";
import CommentsModel from "./model/comment.js";
import {render, RenderPosition} from "./utils/render.js";
import {UpdateType} from "./const.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic hS2sd3dfSwcl1sa2jkjlj75MK`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatistics = document.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTHORIZATION);
const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel, commentsModel, filterModel, api);
const mainNavigationPresenter = new MainNavigationPresenter(siteMainElement, filterModel, filmsModel, filmListPresenter);

mainNavigationPresenter.init();
filmListPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(siteHeaderElement, new UserProfileView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
    render(siteFooterStatistics, new FooterStatisticsView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    render(siteHeaderElement, new UserProfileView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
    render(siteFooterStatistics, new FooterStatisticsView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
  });


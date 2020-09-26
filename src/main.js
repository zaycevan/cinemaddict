import UserProfileView from "./view/user-profile.js";
import FooterStatisticsView from "./view/footer-statistics.js";
import MainNavigationPresenter from "./presenter/mainNavigation.js";
import FilmListPresenter from "./presenter/filmList.js";
import FilterModel from "./model/filter.js";
import FilmsModel from "./model/films.js";
import CommentsModel from "./model/comment.js";
import {render, RenderPosition} from "./utils/render.js";
import {UpdateType} from "./const.js";
import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const AUTHORIZATION = `Basic hS2sd3dfSwcl1sa2jkjlj75MK`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-cache`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel, commentsModel, filterModel, api, apiWithProvider);
const mainNavigationPresenter = new MainNavigationPresenter(siteMainElement, filterModel, filmsModel, filmListPresenter);

mainNavigationPresenter.init();
filmListPresenter.init();

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(siteHeaderElement, new UserProfileView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
    render(siteFooterStatisticsElement, new FooterStatisticsView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    render(siteHeaderElement, new UserProfileView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
    render(siteFooterStatisticsElement, new FooterStatisticsView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

import MainNavigationView from "../view/main-navigation.js";
import StatisticsView from "../view/statistics.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {MainNavigationItem, FilterType, UpdateType} from "../const.js";

export default class MainNavigation {
  constructor(MainNavigationContainer, filterModel, filmsModel, filmListPresenter) {
    this._MainNavigationContainer = MainNavigationContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._filmListPresenter = filmListPresenter;

    this._currentFilter = null;
    this._mainNavigationComponent = null;
    this._statisticsComponent = null;
    this._currentNavigationItem = MainNavigationItem.FILMS;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeClick = this._handleFilterTypeClick.bind(this);
    this._handleMainNavigationClick = this._handleMainNavigationClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevMainNavigationComponent = this._mainNavigationComponent;

    this._mainNavigationComponent = new MainNavigationView(filters, this._currentFilter, this._currentNavigationItem);

    this._mainNavigationComponent.setFilterTypeClickHandler(this._handleFilterTypeClick);
    this._mainNavigationComponent.setMainNavigationClickHandler(this._handleMainNavigationClick);

    if (prevMainNavigationComponent === null) {
      render(this._MainNavigationContainer, this._mainNavigationComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._mainNavigationComponent, prevMainNavigationComponent);
    remove(prevMainNavigationComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeClick(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleMainNavigationClick(mainNavigationItem) {
    switch (mainNavigationItem) {
      case MainNavigationItem.FILMS:
        this._currentNavigationItem = MainNavigationItem.FILMS;
        this.init();
        this._filmListPresenter.init();
        remove(this._statisticsComponent);
        break;
      case MainNavigationItem.STATISTICS:
        this._currentNavigationItem = MainNavigationItem.STATISTICS;
        this.init();
        this._filmListPresenter.destroy();
        this._statisticsComponent = new StatisticsView(this._filmsModel.getFilms());
        render(this._MainNavigationContainer, this._statisticsComponent, RenderPosition.BEFOREEND);
        break;
    }
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: `All movies`,
        count: filter[FilterType.ALL](films).length
      },
      {
        type: FilterType.WATCHLIST,
        name: `Watchlist`,
        count: filter[FilterType.WATCHLIST](films).length
      },
      {
        type: FilterType.HISTORY,
        name: `History`,
        count: filter[FilterType.HISTORY](films).length
      },
      {
        type: FilterType.FAVORITES,
        name: `Favorites`,
        count: filter[FilterType.FAVORITES](films).length
      }
    ];
  }
}

import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from "./smart.js";
import {getWatchedFilmsDuringPeriod, getUserRank, countFilmsByGenre, getSortedGenres} from "../utils/statistics.js";
import {StatisticsPeriod} from "../const.js";

const renderChart = (statisticCtx, films) => {
  const BAR_HEIGHT = 50;

  if (!films.length) {
    return ``;
  }

  const sortedGenres = getSortedGenres(films);
  const sortedCounts = sortedGenres.map((genre) => countFilmsByGenre(films, genre));

  statisticCtx.height = BAR_HEIGHT * sortedGenres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: sortedGenres,
      datasets: [{
        data: sortedCounts,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const getTotalDuration = (watchedFilms) => {
  const totalDuration = watchedFilms.reduce((durationTime, film) => durationTime + film.duration, 0);
  return totalDuration;
};

const createStatisticsFilterTemplate = (period, currentStatisticsPeriod) => {
  const {name, value} = period;

  return `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${value}" value="${value}" ${value === currentStatisticsPeriod ? `checked` : ``}><label for="statistic-${value}" class="statistic__filters-label">${name}</label>`;
};

const createStatisticsTemplate = (films, watchedFilms, currentStatisticsPeriod) => {

  let statisticsFiltersTemplate = ``;
  for (const period in StatisticsPeriod) {
    if (period) {
      statisticsFiltersTemplate += createStatisticsFilterTemplate(StatisticsPeriod[period], currentStatisticsPeriod);
    }
  }

  const totalDurationHours = Math.floor(getTotalDuration(watchedFilms) / 60);
  const totalDurationMinutes = getTotalDuration(watchedFilms) % 60;
  const topGenre = getSortedGenres(watchedFilms)[0];

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getUserRank(films)}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
    ${statisticsFiltersTemplate}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilms.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalDurationHours} <span class="statistic__item-description">h</span> ${totalDurationMinutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre ? topGenre : ``}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class Statistics extends SmartView {
  constructor(films) {
    super();

    this._films = films;

    this._chart = null;
    this._watchedFilms = null;
    this._currentStatisticsPeriod = StatisticsPeriod.ALL_TIME.value;

    this._periodChangeHandler = this._periodChangeHandler.bind(this);
    this._getWatchedFilms();
    this._setPeriodChangeHandler();
    this._setChart();
  }

  getTemplate() {
    return createStatisticsTemplate(this._films, this._watchedFilms, this._currentStatisticsPeriod);
  }

  removeElement() {
    super.removeElement();

    if (this._chart !== null) {
      this._chart = null;
    }
  }

  restoreHandlers() {
    this._setPeriodChangeHandler();
    this._setChart();
  }

  _getWatchedFilms() {
    this._watchedFilms = getWatchedFilmsDuringPeriod(this._films, this._currentStatisticsPeriod);
  }

  _periodChangeHandler(evt) {
    if (this._currentStatisticsPeriod === evt.target.value) {
      return;
    }

    evt.preventDefault();
    this._currentStatisticsPeriod = evt.target.value;
    this._getWatchedFilms();
    this.updateElement();
  }

  _setPeriodChangeHandler() {
    this.getElement().addEventListener(`change`, this._periodChangeHandler);
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);

    this._chart = renderChart(statisticCtx, this._watchedFilms);
  }
}

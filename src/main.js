import BoardPresenter from './presenter/presenter';
import {render} from './framework/render';
import FilterView from './view/filter-view';
import {tripPoints} from './mock/data';
import TripPointsModel from './model/trip-points-model';

const siteMainElement = document.querySelector('.page-main');
const siteFilterElement = document.querySelector('.trip-controls__filters');

const tripPointsModel = new TripPointsModel(tripPoints);
const boardPresenter = new BoardPresenter(siteMainElement.querySelector('.trip-events'), tripPointsModel);
render(new FilterView(), siteFilterElement);
boardPresenter.init();


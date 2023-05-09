import BoardPresenter from './presenter/presenter';
import {render} from './framework/render';
import FilterView from './view/filter-view';
import {tripPoints} from './mock/data';
import {generateFilter} from './mock/filter';
import TripPointsModel from './model/trip-points-model';

const siteMainElement = document.querySelector('.page-main');
const siteFilterElement = document.querySelector('.trip-controls__filters');

const tripPointsModel = new TripPointsModel(tripPoints);
const boardPresenter = new BoardPresenter(siteMainElement.querySelector('.trip-events'), tripPointsModel);

const filters = generateFilter(tripPointsModel.tripPoints);
render(new FilterView({filters}), siteFilterElement);
boardPresenter.init();


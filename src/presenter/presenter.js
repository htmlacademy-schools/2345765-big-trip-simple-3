import TripEventsView from '../view/trip-events-view';
import SortView from '../view/sort-view';
import {render} from '../framework/render';
import EmptyPointListView from '../view/empty-point-list-view';
import TripPointPresenter from './point-presenter';
import {updateItem} from '../utils/common';
import {SortType} from '../const';
import {sortTripPointDateUp, sortTripPointPriceUp} from '../utils/trip-point';


export default class BoardPresenter {
  #boardComponent = new TripEventsView();
  #emptyPointListComponent = new EmptyPointListView();
  #sortComponent = new SortView();
  #tripPointPresenter = new Map();
  #boardContainer = null;
  #tripPointsModel = null;
  #currentSortType = SortType.DATE_UP;

  #tripPoints = [];
  #destinations = [];
  #offersByType = [];

  constructor(boardContainer, tripPointsModel) {
    this.#boardContainer = boardContainer;
    this.#tripPointsModel = tripPointsModel;
  }


  init = () => {
    this.#tripPoints = [...this.#tripPointsModel.tripPoints];
    this.#destinations = [...this.#tripPointsModel.destinations];
    this.#offersByType = [...this.#tripPointsModel.offersByType];

    this.#renderBoard();

  };

  #renderTripPoint = (tripPoint) => {
    const tripPointPresenter = new TripPointPresenter({
      boardComponent: this.#boardComponent.element,
      onTripPointChange: this.#handleTripPointChange,
      onModeChange: this.#handleModeChange
    });
    tripPointPresenter.init(tripPoint, this.#destinations, this.#offersByType);
    this.#tripPointPresenter.set(tripPoint.id, tripPointPresenter);
  };

  #handleModeChange = () => {
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleTripPointChange = (updatedTripPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedTripPoint);
    this.#tripPointPresenter.get(updatedTripPoint.id).init(updatedTripPoint, this.#destinations, this.#offersByType);
  };

  #sortTripPoints = (sortType) => {
    if (sortType === SortType.DATE_UP) {
      this.#tripPoints.sort(sortTripPointDateUp);
    } else {
      this.#tripPoints.sort(sortTripPointPriceUp);
    }

    this.#currentSortType = sortType;
  };


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTripPoints(sortType);
    this.#clearTripPoints();
    this.#renderTripPoints();
  };

  #clearTripPoints = () => {
    this.#tripPointPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointPresenter.clear();
  };

  #renderNoTripPoints = () => {
    render(this.#emptyPointListComponent, this.#boardComponent.element);
  };

  #renderTripPoints = () => {
    if (this.#tripPoints.length === 0) {
      this.#renderNoTripPoints();
    }
    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(this.#tripPoints[i]);
    }
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#boardComponent.element);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderBoard = () => {
    render(this.#boardComponent, this.#boardContainer);
    this.#renderSort();
    this.#renderTripPoints();
    // render(new CreateFormView(), this.boardComponent.getElement());
  };
}

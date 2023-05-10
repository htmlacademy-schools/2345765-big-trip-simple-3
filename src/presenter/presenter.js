import TripEventsView from '../view/trip-events-view';
import SortView from '../view/sort-view';
import {render} from '../framework/render';
import EmptyPointListView from '../view/empty-point-list-view';
import PointPresenter from './point-presenter';
import {updateItem} from '../utils/common';

export default class BoardPresenter {
  #boardComponent = new TripEventsView();
  #emptyPointListComponent = new EmptyPointListView();
  #sortComponent = new SortView();
  #tripPointPresenter = new Map();
  #boardContainer = null;
  #tripPointsModel = null;

  #tripPoints = [];

  constructor(boardContainer, tripPointsModel) {
    this.#boardContainer = boardContainer;
    this.#tripPointsModel = tripPointsModel;
  }


  init = () => {
    this.#tripPoints = [...this.#tripPointsModel.tripPoints];

    this.#renderBoard();

  };

  #renderTripPoint(tripPoint) {
    const tripPointPresenter = new PointPresenter({
      boardComponent: this.#boardComponent,
      onModeChange: this.#handleModeChange
    });
    tripPointPresenter.init(tripPoint);
    this.#tripPointPresenter.set(tripPoint.id, tripPointPresenter);
  }

  #handleModeChange = () => {
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleTripPointChange = (updatedTripPoint) => {
    this.#boardComponent = updateItem(this.#tripPoints, updatedTripPoint);
    this.#tripPointPresenter.get(updatedTripPoint.id).init(updatedTripPoint);
  };

  #clearTripPoints() {
    this.#tripPointPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointPresenter.clear();
  }

  #renderNoTripPoints() {
    render(this.#emptyPointListComponent, this.#boardComponent.element);
  }

  #renderTripPoints() {
    if (this.#tripPoints.length === 0) {
      this.#renderNoTripPoints();
    }
    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(this.#tripPoints[i]);
    }
  }

  #renderSort() {
    render(this.#sortComponent, this.#boardComponent.element);
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);
    this.#renderSort();
    this.#renderTripPoints();
    // render(new CreateFormView(), this.boardComponent.getElement());
  }
}

import CreateFormView from '../view/create-form-view';
import TripPointView from '../view/trip-point-view';
import TripEventsView from '../view/trip-events-view';
import SortView from '../view/sort-view';
import {render} from '../render';
import PointEditFormView from '../view/point-edit-form-view';
import EmptyPointListView from '../view/empty-point-list-view';

export default class BoardPresenter {
  #boardComponent = new TripEventsView();
  #emptyPointListComponent = new EmptyPointListView();
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
    const tripPointComponent = new TripPointView(tripPoint);
    const tripPointEditComponent = new PointEditFormView(tripPoint);

    const replaceEventToForm = () => {
      this.#boardComponent.element.replaceChild(tripPointEditComponent.element, tripPointComponent.element);
    };

    const replaceFormToEvent = () => {
      this.#boardComponent.element.replaceChild(tripPointComponent.element, tripPointEditComponent.element);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        replaceFormToEvent();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    tripPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceEventToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    tripPointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    tripPointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToEvent();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(tripPointComponent, this.#boardComponent.element);
  }

  #renderBoard() {
    render(new SortView(), this.#boardContainer);
    render(this.#boardComponent, this.#boardContainer);

    // render(new CreateFormView(), this.boardComponent.getElement());
    // render(new PointEditFormView(this.tripPoints[0]), this.boardComponent.getElement());

    if (this.#tripPoints.length === 0) {
      render(this.#emptyPointListComponent, this.#boardComponent.element);
    }
    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(this.#tripPoints[i]);
    }
  }
}

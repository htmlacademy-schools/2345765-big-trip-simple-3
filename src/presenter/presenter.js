import CreateFormView from '../view/create-form-view';
import TripPointView from '../view/trip-point-view';
import TripEventsView from '../view/trip-events-view';
import SortView from '../view/sort-view';
import {render} from '../render';
import PointEditFormView from '../view/point-edit-form-view';

export default class BoardPresenter {
  #boardComponent = new TripEventsView();
  #boardContainer = null;
  #tripPointsModel = null;

  #tripPoints = [];

  constructor(boardContainer, tripPointsModel) {
    this.#boardContainer = boardContainer;
    this.#tripPointsModel = tripPointsModel;
  }


  init = () => {
    this.#tripPoints = [...this.#tripPointsModel.tripPoints];

    render(new SortView(), this.#boardContainer);
    render(this.#boardComponent, this.#boardContainer);

    // render(new CreateFormView(), this.boardComponent.getElement());
    // render(new PointEditFormView(this.tripPoints[0]), this.boardComponent.getElement());

    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(this.#tripPoints[i]);
    }
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

    tripPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceEventToForm();
    });

    tripPointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToEvent();
    });

    tripPointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToEvent();
    });

    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        replaceFormToEvent();
      }
    });

    render(tripPointComponent, this.#boardComponent.element);
  }
}

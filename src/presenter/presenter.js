import TripPointView from '../view/trip-point-view';
import TripEventsView from '../view/trip-events-view';
import SortView from '../view/sort-view';
import {render} from '../framework/render';
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
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        replaceFormToTripEvent.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const tripPointComponent = new TripPointView(tripPoint,
      () => {
        replaceTripEventToForm.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      });
    const tripPointEditComponent = new PointEditFormView({tripPoint: tripPoint,
      onFormSubmit: () => {
        replaceFormToTripEvent.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormClose: () => {
        replaceFormToTripEvent.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }});

    function replaceTripEventToForm() {
      this.#boardComponent.element.replaceChild(tripPointEditComponent.element, tripPointComponent.element);
    }

    function replaceFormToTripEvent() {
      this.#boardComponent.element.replaceChild(tripPointComponent.element, tripPointEditComponent.element);
    }

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

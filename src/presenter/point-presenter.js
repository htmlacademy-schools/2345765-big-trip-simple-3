import TripPointView from '../view/trip-point-view';
import PointEditFormView from '../view/point-edit-form-view';
import {remove, render, replace} from '../framework/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class TripPointPresenter {
  #boardComponent = null;

  #tripPointComponent = null;
  #editTripPointComponent = null;

  #tripPoint = null;
  #destinations = [];
  #offersByType = [];

  #handleModeChange = null;
  #handleTripPointChange = null;
  #mode = Mode.DEFAULT;

  constructor({boardComponent, onTripPointChange, onModeChange}) {
    this.#boardComponent = boardComponent;
    this.#handleTripPointChange = onTripPointChange;
    this.#handleModeChange = onModeChange;
  }

  init(tripPoint, destinations, offersByType) {
    this.#tripPoint = tripPoint;
    this.#destinations = destinations;
    this.#offersByType = offersByType;

    const prevTripPointComponent = this.#tripPointComponent;
    const prevEditTripPointComponent = this.#editTripPointComponent;

    this.#tripPointComponent = new TripPointView({
      tripPoint: this.#tripPoint,
      onEditClick: this.#handleEditForm
    });

    this.#editTripPointComponent = new PointEditFormView({
      tripPoint: this.#tripPoint,
      destinations: this.#destinations,
      offersByType: this.#offersByType,
      onFormClose: this.#handleFormClose
    });

    this.#editTripPointComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if (prevEditTripPointComponent === null || prevTripPointComponent === null) {
      render(this.#tripPointComponent, this.#boardComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editTripPointComponent, prevEditTripPointComponent);
    }

    remove(prevTripPointComponent);
    remove(prevEditTripPointComponent);
  }

  destroy() {
    remove(this.#tripPointComponent);

    remove(this.#editTripPointComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editTripPointComponent.reset(this.#tripPoint);
      this.#replaceFormToTripEvent();
    }
  }

  #replaceTripEventToForm() {
    this.#boardComponent.replaceChild(this.#editTripPointComponent.element, this.#tripPointComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToTripEvent() {
    this.#boardComponent.replaceChild(this.#tripPointComponent.element, this.#editTripPointComponent.element);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editTripPointComponent.reset(this.#tripPoint);
      this.#replaceFormToTripEvent();
    }
  };

  #handleFormSubmit = (tripPoint) => {
    this.#handleTripPointChange(tripPoint);
    this.#replaceFormToTripEvent();
  };

  #handleFormClose = () => {
    this.#editTripPointComponent.reset(this.#tripPoint);
    this.#replaceFormToTripEvent();
  };

  #handleEditForm = () => {
    this.#replaceTripEventToForm();
  };

}

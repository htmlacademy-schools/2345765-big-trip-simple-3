import TripPointView from '../view/trip-point-view';
import PointEditFormView from '../view/point-edit-form-view';
import {remove, render, replace} from '../framework/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class {
  #boardComponent = null;

  #tripPointComponent = null;
  #editTripPointComponent = null;

  #tripPoint = null;

  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({boardComponent, onModeChange}) {
    this.#boardComponent = boardComponent;
    this.#handleModeChange = onModeChange;
  }

  init(tripPoint) {
    this.#tripPoint = tripPoint;

    const prevTripPointComponent = this.#tripPointComponent;
    const prevEditTripPointComponent = this.#editTripPointComponent;

    this.#tripPointComponent = new TripPointView({
      tripPoint: this.#tripPoint,
      onEditClick: this.#handleEditForm
    });

    this.#editTripPointComponent = new PointEditFormView({
      tripPoint: this.#tripPoint,
      onFormSubmit: this.#handleFormSubmit,
      onFormClose: this.#handleFormClose
    });

    if (prevEditTripPointComponent === null || prevTripPointComponent === null) {
      render(this.#tripPointComponent, this.#boardComponent.element);
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
      this.#replaceFormToTripEvent();
    }
  }

  #replaceTripEventToForm() {
    this.#boardComponent.element.replaceChild(this.#editTripPointComponent.element, this.#tripPointComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToTripEvent() {
    this.#boardComponent.element.replaceChild(this.#tripPointComponent.element, this.#editTripPointComponent.element);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#replaceFormToTripEvent();
    }
  };

  #handleFormSubmit = () => {
    this.#replaceFormToTripEvent();
  };

  #handleFormClose = () => {
    this.#replaceFormToTripEvent();
  };

  #handleEditForm = () => {
    this.#replaceTripEventToForm();
  };
}

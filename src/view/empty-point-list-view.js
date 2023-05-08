import {createElement} from '../render';

const createEmptyListTemplate = () => {
  const message = 'Click New Event to create your first point';
  return (`<p class="trip-events__msg">${message}</p>`);
};

export default class EmptyPointListView {
  #element = null;

  get template() {
    return createEmptyListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

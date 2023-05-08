import AbstractView from '../framework/view/abstract-view';

const createEmptyListTemplate = () => {
  const message = 'Click New Event to create your first point';
  return (`<p class="trip-events__msg">${message}</p>`);
};

export default class EmptyPointListView extends AbstractView {
  get template() {
    return createEmptyListTemplate();
  }
}

import {convertToEditFormDateTime, getOffersByTypeFromList} from '../utils/trip-point';
import {getDestinationById, getOfferById} from '../mock/data';
import {eventTypes} from '../const';
import {ucFirst} from '../utils/common';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';


const BLANK_TRIP_POINT = {
  'basePrice': 1000,
  'dateFrom': '2023-07-18T20:20:13.375Z',
  'dateTo': '2023-07-18T20:21:13.375Z',
  'destination': 0,
  'id': 0,
  'offers': [0],
  'type': 'taxi'
};


const createOffersTemplate = (offers) => {
  let template = '';
  for (const offerId of offers) {
    const offer = getOfferById(offerId);
    template += `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerId}-1" type="checkbox" name="event-offer-${offerId}">
        <label class="event__offer-label" for="event-offer-${offerId}-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
  }
  return template;
};

function createDestinationListTemplate(destinations) {
  return destinations.map((destination) => `
    <option value="${destination.name}"></option>`
  ).join('');
}

const createEventTypeListTemplate = (selectedEventType, tripPointId) => {
  let template = '';
  for (const eventTypeName of eventTypes) {
    const checked = eventTypeName === selectedEventType ? 'checked' : '';
    template += `
    <div class="event__type-item">
      <input id="event-type-${eventTypeName}-${tripPointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventTypeName}" ${checked}>
      <label class="event__type-label  event__type-label--${eventTypeName}" for="event-type-${eventTypeName}-${tripPointId}">${ucFirst(eventTypeName)}</label>
    </div>
    `;
  }
  return template;
};
const createEditFormTemplate = (tripPoint, destinations) => {
  const {basePrice, dateFrom, dateTo, destination: destinationId, offers, type: eventType} = tripPoint;
  const formDateTimeFrom = convertToEditFormDateTime(dateFrom);
  const formDateTimeTo = convertToEditFormDateTime(dateTo);
  const destinationObject = getDestinationById(destinationId);
  const destinationName = destinationObject.name;
  const destinationDescription = destinationObject.description;
  const offersTemplate = createOffersTemplate(offers);
  const eventTypesTemplate = createEventTypeListTemplate(eventType, tripPoint.id);
  const destinationListTemplate = createDestinationListTemplate(destinations);
  return (`<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${tripPoint.id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${tripPoint.id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
                ${eventTypesTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-${tripPoint.id}">
            ${eventType}
          </label>
          <input class="event__input event__input--destination" id="event-destination-${tripPoint.id}" type="text" name="event-destination" value="${destinationName}" list="destination-list-${tripPoint.id}">
          <datalist id="destination-list-${tripPoint.id}">
            ${destinationListTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formDateTimeFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formDateTimeTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersTemplate}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinationDescription}</p>
        </section>
      </section>
    </form>
  </li>`
  );
};

export default class PointEditFormView extends AbstractStatefulView {
  #tripPoint = null;
  #handleFormClose = null;
  #destinations = null;
  #offersByType = null;

  constructor({tripPoint = BLANK_TRIP_POINT, destinations, offersByType, onFormClose}) {
    super();
    this.#tripPoint = tripPoint;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this._state = PointEditFormView.parseTripPointToState(tripPoint);

    this.#handleFormClose = onFormClose;

    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#destinations);
  }

  reset = (tripPoint) => {
    this.updateElement(
      PointEditFormView.parseTripPointToState(tripPoint)
    );
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(PointEditFormView.parseStateToTripPoint(this._state));
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClose();
  };

  #changeEventTypeHandler = (evt) => {
    evt.preventDefault();
    const offersByType = getOffersByTypeFromList(this.#offersByType, evt.target.value);
    this.updateElement({
      type: evt.target.value,
      offers: offersByType.offers.map((obj) => obj.id)
    });
  };

  #changeDestinationHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#destinations.find((destination) => destination.name === evt.target.value).id
    });
  };

  _restoreHandlers() {
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formCloseHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#changeEventTypeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#changeDestinationHandler);
  }

  static parseTripPointToState(tripPoint) {
    return {...tripPoint,
    };
  }


  static parseStateToTripPoint(state) {
    return {...state};
  }
}


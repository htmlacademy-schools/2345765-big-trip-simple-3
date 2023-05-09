import {convertToEventDate, convertToEventDateTime} from '../utils/trip-point';
import {getDestinationById, getOfferById} from '../mock/data';
import AbstractView from '../framework/view/abstract-view';

const createOffersTemplate = (offers) => {
  let offersTemplate = '';
  for (const offerId of offers) {
    const offer = getOfferById(offerId);
    const offerName = offer.title;
    const offerPrice = offer.price;
    offersTemplate += `
        <li class="event__offer">
            <span class="event__offer-title">${offerName}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offerPrice}</span>
        </li>
    `;
  }
  return offersTemplate;
};

const createTripPointTemplate = (tripPoint) => {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = tripPoint;
  const eventDate = convertToEventDate(dateFrom);
  const eventDateTimeFrom = convertToEventDateTime(dateFrom);
  const eventDateTimeTo = convertToEventDateTime(dateTo);
  const destinationName = getDestinationById(destination).name;
  const offersTemplate = createOffersTemplate(offers);
  return (`<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime=${dateFrom}>${eventDate}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${destinationName}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime=${dateFrom}>${eventDateTimeFrom}</time>
                    &mdash;
                    <time class="event__end-time" datetime=${dateTo}>${eventDateTimeTo}</time>
                  </p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${offersTemplate}
                </ul>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`);
};

export default class TripPointView extends AbstractView {
  #tripPoint = null;
  #handleEditClick = null;

  constructor(tripPoint, onEditClick) {
    super();
    this.#tripPoint = tripPoint;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createTripPointTemplate(this.#tripPoint);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}

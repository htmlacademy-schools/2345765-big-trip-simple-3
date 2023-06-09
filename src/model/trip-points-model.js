export default class TripPointsModel {
  #tripPoints = null;
  #destinations = null;
  #offersByType = null;

  constructor (tripPoints, destinations, offersByType) {
    this.#tripPoints = tripPoints;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
  }

  get tripPoints() {
    return this.#tripPoints;
  }

  get destinations() {
    return this.#destinations;
  }

  get offersByType() {
    return this.#offersByType;
  }
}

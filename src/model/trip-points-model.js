export default class TripPointsModel {
  #tripPoints = null;
  constructor (tripPoints) {
    this.#tripPoints = tripPoints;
  }

  get tripPoints() {
    return this.#tripPoints;
  }
}

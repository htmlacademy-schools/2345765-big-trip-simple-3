import {getOffersByType, getRandomOffers} from './offer';
import {getRandomDestinations} from './destination';
import {getRandomTripPoints} from './trip-point';

const tripTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const destinationsCount = 10;
const destinations = getRandomDestinations(destinationsCount);

const offersCount = 15;
const offers = getRandomOffers(offersCount);

const offersByType = getOffersByType(offers, tripTypes);

const pointsCount = 5;
const tripPoints = getRandomTripPoints(destinations, offersByType, tripTypes, pointsCount);

export const getDestinationById = (id) => {
  for (const destination of destinations) {
    if (destination.id === id) {
      return destination;
    }
  }
};

export const getOfferById = (id) => {
  for (const offer of offers) {
    if (offer.id === id) {
      return offer;
    }
  }
};

export {destinations, tripPoints, offersByType};


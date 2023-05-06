import {getRandomInteger} from '../utils';

const createPoint = (id, destination, offers, tripType) => ({
  'basePrice': getRandomInteger(0, 10000),
  'dateFrom': '2019-07-10T22:55:56.845Z',
  'dateTo': '2019-07-11T11:22:13.375Z',
  'destination': destination.id,
  'id': id,
  'offers': offers.map((obj) => obj.id),
  'type': tripType
});


function makePointGenerator (maxId) {
  const usedIds = [];
  return function (destination, offersByType, tripType) {
    const offers = offersByType['offers'];
    let newId = getRandomInteger(0, maxId);
    while (usedIds.includes(newId)) {
      newId = getRandomInteger(0, maxId);
    }
    usedIds.push(newId);
    return createPoint(newId, destination, offers, tripType);
  };
}

const getOfferByTypeFromList = (offersByType, offerType) => {
  for (const offerByType of offersByType) {
    if (offerByType.type === offerType) {
      return offerByType;
    }
  }
};

export const getRandomTripPoints = (destinations, offersByTypeList, tripTypes, pointsCount) => {
  const tripPoints = [];
  const generatePoint = makePointGenerator(pointsCount);
  for (let i = 0; i < pointsCount; i++) {
    const tripType = tripTypes[getRandomInteger(0, tripTypes.length - 1)];
    const destination = destinations[getRandomInteger(0, destinations.length - 1)];
    const offersByType = getOfferByTypeFromList(offersByTypeList, tripType);
    const newTripPoint = generatePoint(destination, offersByType, tripType);
    tripPoints.push(newTripPoint);
  }
  return tripPoints;
};



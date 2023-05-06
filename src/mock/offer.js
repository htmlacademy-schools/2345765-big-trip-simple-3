import {getRandomText} from './utils';
import {getRandomInteger} from '../utils';

const createRandomOffer = (id) => ({
  id,
  title: getRandomText(),
  price: getRandomInteger(1, 50000)
});


function makeOffersGenerator (maxId) {
  const usedIds = [];

  return function () {
    let newId = getRandomInteger(0, maxId);
    while (usedIds.includes(newId)) {
      newId = getRandomInteger(0, maxId);
    }
    usedIds.push(newId);
    return createRandomOffer(newId);
  };
}

export const getRandomOffers = (offersCount) => {
  const offersGenerate = makeOffersGenerator(offersCount);

  const offers = [];

  for (let i = 0; i < offersCount; i++) {
    offers.push(offersGenerate());
  }
  return offers;
};

export const getOfferByType = (offerIndex, offers, offerTypesLength, offerType) => {
  const multiplier = offers.length / offerTypesLength;
  const offersByType = offers.slice(offerIndex * multiplier, (offerIndex + 1) * multiplier);
  return {
    type: offerType,
    offers: offersByType
  };
};


export const getOffersByType = (offers, offerTypes) => {
  const offersByType = [];
  for (let i = 0; i < offerTypes.length; i++) {
    const offerType = offerTypes[i];
    offersByType.push(getOfferByType(i, offers, offerTypes.length, offerType));
  }
  return offersByType;
};

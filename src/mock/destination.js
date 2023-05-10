import {getRandomText} from './utils';
import {getRandomInteger} from '../utils/common';

const getRandomDestinationName = () => {
  const names = ['London', 'Chamonix', 'Ikea', 'Uber', 'Moscow', 'Salut', 'Diamond'];
  const randomIndex = getRandomInteger(0, names.length - 1);
  return names[randomIndex];
};

const createRandomDestination = (id) => ({
  'id': id,
  'description': getRandomText(),
  'name': getRandomDestinationName(),
  'pictures': [
    {
      'src': `http://picsum.photos/300/200?r=${getRandomInteger(0, 100)}`,
      'description': getRandomText()
    }
  ]
});

function makeDestinationGenerator (maxId) {
  const usedIds = [];
  return function () {
    let newId = getRandomInteger(0, maxId);
    while (usedIds.includes(newId)) {
      newId = getRandomInteger(0, maxId);
    }
    usedIds.push(newId);
    return createRandomDestination(newId);
  };
}

export const getRandomDestinations = (destinationsCount) => {
  const destinations = [];
  const generateDestination = makeDestinationGenerator(destinationsCount);
  for (let i = 0; i < destinationsCount; i++) {
    destinations.push(generateDestination());
  }
  return destinations;
};


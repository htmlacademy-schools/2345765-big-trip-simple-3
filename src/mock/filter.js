import {filter, filterNameUpperLetter} from '../utils/filter.js';

function generateFilter() {
  return Object.entries(filter).map(
    ([filterName]) => ({
      valueName: filterName,
      filterName: filterNameUpperLetter[filterName]
    }),
  );
}

export {generateFilter};

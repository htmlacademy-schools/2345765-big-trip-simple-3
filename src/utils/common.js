const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const updateItem = (items, update) => (
  items.map((item) => item.id === update.id ? update : item)
);

const ucFirst = (str) => {
  if (!str) {return str;}

  return str[0].toUpperCase() + str.slice(1);
};

export {getRandomInteger, updateItem, ucFirst};

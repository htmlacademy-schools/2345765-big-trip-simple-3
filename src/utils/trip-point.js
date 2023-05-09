import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const convertToEventDateTime = (date) => (dayjs(date).format('H:mm'));

const convertToEventDate = (date) => (dayjs(date).format('MMM D'));

const convertToEditFormDateTime = (date) => (dayjs(date).format('DD/MM/YY HH:mm'));

const isTripPointFuture = (tripPoint) => {
  const dateFrom = tripPoint.dateFrom;
  const dateTo = tripPoint.dateTo;

  return (dayjs().isAfter(dateFrom) && dayjs().isBefore(dateTo)) || dayjs().isSame(dateFrom) || dayjs().isBefore(dateFrom);
};


export {getRandomInteger, convertToEventDateTime, convertToEventDate, convertToEditFormDateTime, isTripPointFuture};

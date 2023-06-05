import dayjs from 'dayjs';

const convertToEventDateTime = (date) => (dayjs(date).format('H:mm'));

const convertToEventDate = (date) => (dayjs(date).format('MMM D'));

const convertToEditFormDateTime = (date) => (dayjs(date).format('DD/MM/YY HH:mm'));

const isTripPointFuture = (tripPoint) => {
  const dateFrom = tripPoint.dateFrom;
  const dateTo = tripPoint.dateTo;

  return (dayjs().isAfter(dateFrom) && dayjs().isBefore(dateTo)) || dayjs().isSame(dateFrom) || dayjs().isBefore(dateFrom);
};

const sortTripPointDateUp = (tripPointA, tripPointB) => dayjs(tripPointA.dateFrom).diff(dayjs(tripPointB.dateFrom));

const sortTripPointPriceUp = (tripPointA, tripPointB) => tripPointA.basePrice - tripPointB.basePrice;

export {convertToEventDateTime, convertToEventDate, convertToEditFormDateTime, isTripPointFuture, sortTripPointDateUp, sortTripPointPriceUp};

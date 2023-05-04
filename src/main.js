import BoardPresenter from './presenter/presenter';


const siteMainElement = document.querySelector('.page-main');

const boardPresenter = new BoardPresenter();
boardPresenter.init(siteMainElement.querySelector('.trip-events'));

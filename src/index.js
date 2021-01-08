import './sass/main.scss';
import API from './js/apiService';
import makeImageCard from './templates/imageCard.hbs';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-design-icons/iconfont/material-icons.css';

const refGallery = document.querySelector('.gallery');
const refForm = document.querySelector('.search-form');
const refButtonLoad = document.querySelector('.load-more');
let flagNewPage = 1;

const loadImages = (item, flag) => {
  return API.getImages(item, flag).then(data => {
    refGallery.insertAdjacentHTML('beforeend', makeImageCard(data.hits));
  });
};
const observer = e => {
  e.preventDefault();

  if (e.target.id === 'search-form') {
    refGallery.innerHTML = '';
    loadImages(e.target.firstElementChild.value, flagNewPage).then(() => {
      window.scrollTo({
        top: 60,
        behavior: 'smooth',
      });
    });
    flagNewPage = 1;
  } else if ((e.target.id = 'load-more')) {
    flagNewPage += 1;
    let count = document.querySelector('.gallery').clientHeight + 60;
    loadImages(refForm.firstElementChild.value, flagNewPage).then(() => {
      window.scrollTo({
        top: count,
        behavior: 'smooth',
      });
    });
  }
};
refForm.addEventListener('submit', observer);
refButtonLoad.addEventListener('click', observer);

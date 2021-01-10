import './sass/main.scss';
import API from './js/apiService';
import makeImageCard from './templates/imageCard.hbs';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-design-icons/iconfont/material-icons.css';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basiclightbox.min.css';
require('intersection-observer');

//рефералки
const refGallery = document.querySelector('.gallery');
const refForm = document.querySelector('.search-form');
const refButtonLoad = document.querySelector('.load-more');
//const refLightBox = document.querySelector('.basicLightbox');
let flagNewPage = 1;
let viewElement;

// Загрузка картинок
const loadImages = (item, flag) => {
  return API.getImages(item, flag).then(data => {
    refGallery.insertAdjacentHTML('beforeend', makeImageCard(data.hits));
  });
};

//Слушатель событий
const observerWatch = e => {
  e.preventDefault();

  if (e.target.id === 'search-form') {
    refGallery.innerHTML = '';
    flagNewPage = 1;
    return loadImages(e.target.firstElementChild.value, flagNewPage)
      .then(() => {
        window.scrollTo({
          top: 60,
          behavior: 'smooth',
        });
      })
      .then(() => {
        viewElement = document.querySelector('.gallery').lastElementChild;
        console.log(viewElement);
        lazyLoad(viewElement);
      });
  } else if ((e.target.id = 'load-more')) {
    flagNewPage += 1;
    let count = document.querySelector('.gallery').clientHeight + 60;
    return loadImages(refForm.firstElementChild.value, flagNewPage).then(() => {
      window.scrollTo({
        top: count,
        behavior: 'smooth',
      });
    });
  }
};

const showLargeImages = e => {
  e.preventDefault();
  const instance = basicLightbox.create(`
    <img src="${e.target.dataset.large}" width="800">
`);

  instance.show();
};

/* test для intersection */

const lazyLoad = entry => {
  flagNewPage += 1;
  console.log(flagNewPage);
  const io = new IntersectionObserver(
    (entry, observer) => {
      if (entry[0].isIntersecting) {
        loadImages(refForm.firstElementChild.value, flagNewPage).then(() => {
          viewElement = document.querySelector('.gallery').lastElementChild;
          lazyLoad(viewElement);
        });
        observer.disconnect();
      }
    },
    {
      threshold: 1,
      rootMargin: '0px',
    },
  );
  io.observe(entry);
};

//eventListeners
refForm.addEventListener('submit', observerWatch);
refButtonLoad.addEventListener('click', observerWatch);
refGallery.addEventListener('click', showLargeImages);

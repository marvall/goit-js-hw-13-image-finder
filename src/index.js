import './sass/main.scss';
import API from './js/apiService';
import makeImageCard from './templates/imageCard.hbs';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-design-icons/iconfont/material-icons.css';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basiclightbox.min.css';
import { success, error, defaults, defaultModules, Stack } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js';

const myStack = new Stack({
  dir1: 'up',
  dir2: 'right',
  firstpos1: 25,
  spacing1: 25,
  push: 'top',
  modal: false,
  overlayClose: false,
});
defaults.mode = 'light';
defaults.delay = 1000;
defaults.stack = myStack;
defaultModules.set(PNotifyMobile, {});
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
    success({
      title: 'Success!',
      text: 'New images Loaded',
    });
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
      })
      .catch(() =>
        error({
          title: 'Error!',
          text: 'Please, try another request',
        }),
      );
  } else if ((e.target.id = 'load-more')) {
    flagNewPage += 1;
    let count = document.querySelector('.gallery').clientHeight + 60;
    return loadImages(refForm.firstElementChild.value, flagNewPage)
      .then(() => {
        window.scrollTo({
          top: count,
          behavior: 'smooth',
        });
        return;
      })
      .catch(() =>
        error({
          title: 'Error!',
          text: 'Please, try another request',
        }),
      );
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
        loadImages(refForm.firstElementChild.value, flagNewPage)
          .then(() => {
            viewElement = document.querySelector('.gallery').lastElementChild;
            lazyLoad(viewElement);
          })
          .catch(() =>
            error({
              title: 'Error!',
              text: 'Please, try another request',
            }),
          );
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

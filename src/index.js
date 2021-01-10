import './sass/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-design-icons/iconfont/material-icons.css';
import { showLargeImage } from './js/showLargeImage';
import { error } from './js/pnotify';
import { loadImages } from './js/loadImages';

//рефералки
const refGallery = document.querySelector('.gallery');
const refForm = document.querySelector('.search-form');
const refButtonLoad = document.querySelector('.load-more');
//const refLightBox = document.querySelector('.basicLightbox');
let flagNewPage = 1;
let viewElement;

// Загрузка картинок

//Слушатель событий
const observerWatch = e => {
  e.preventDefault();

  if (e.target.id === 'search-form') {
    refGallery.innerHTML = '';
    flagNewPage = 1;
    return loadImages(e.target.firstElementChild.value, flagNewPage, refGallery)
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
    return loadImages(refForm.firstElementChild.value, flagNewPage, refGallery)
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

/* InterSection Observer */

const lazyLoad = entry => {
  flagNewPage += 1;
  console.log(flagNewPage);
  const io = new IntersectionObserver(
    (entry, observer) => {
      if (entry[0].isIntersecting) {
        loadImages(refForm.firstElementChild.value, flagNewPage, refGallery)
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
refGallery.addEventListener('click', showLargeImage);

import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basiclightbox.min.css';

const showLargeImage = e => {
  e.preventDefault();
  const instance = basicLightbox.create(`
    <img src="${e.target.dataset.large}" width="800">
`);

  instance.show();
};

export { showLargeImage };

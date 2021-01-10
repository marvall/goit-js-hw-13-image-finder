import API from './apiService';
import makeImageCard from './../templates/imageCard.hbs';
import { success } from './pnotify';

const loadImages = (item, flag, ref) => {
  return API.getImages(item, flag).then(data => {
    ref.insertAdjacentHTML('beforeend', makeImageCard(data.hits));
    success({
      title: 'Success!',
      text: 'New images Loaded',
    });
  });
};

export { loadImages };

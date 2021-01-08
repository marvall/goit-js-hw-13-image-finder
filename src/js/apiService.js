export default {
  _url: 'https://pixabay.com/api/?image_type=photo&orientation=horizontal',
  _myKey: '19268663-7f88b2c67b4246c5b4cd88041',

  async getImages(value, flagNewPage) {
    const res = await fetch(
      this._url +
        '&q=' +
        value +
        '&page=' +
        flagNewPage +
        '&per_page=12&key=' +
        this._myKey,
    );
    return await res.json();
  },
};

//Creator Pierre Reimertz MIT ETC ETC

export default class LazyLoader {
  constructor(options = {}) {

    this.elements = [].slice.call(document.querySelectorAll(options.selector || '[lazy-src]'));
    this.offset = !!options.offset || (document.body.getBoundingClientRect().height/2);
    this.lines = !!options.lines || 3;
    this.throttle = !!options.throttle || 350;
    this.checkOnLoad = !!options.checkOnLoad || true;
    this.beStupidAndFakeSlowness = !!options.beStupidAndFakeSlowness || false;

    this._queue = [];
    this._listener = false;
    this._throttler = false;
    this._placeholderImages = [
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWAQMAAAAGz+OhAAAAA1BMVEUb/5DUIh99AAAAGklEQVR4Ae3BAQEAAAQDMP1TiwHfVgAAwHoNC7gAASist30AAAAASUVORK5CYII=',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWAQMAAABelSeRAAAAA1BMVEUb/5DUIh99AAAAHElEQVR4Xu3AAQkAAADCMPunNsdhWwoAAAAAABwW2gABlO2L2AAAAABJRU5ErkJggg=='
    ];
  }

  fetchImage(image) {
    image.src = image.getAttribute('lazy-src');
    image.setAttribute('lazy-status', 'fetching');
    image.addEventListener('load', (event) => {this.imageLoaded(image)}, false);
  }

  imageLoaded(loadedImage) {
    let imageToFetch;

    loadedImage.setAttribute('lazy-status', 'loaded');

    this._queue = this._queue.filter((element)=> {if(loadedImage !== element) return element});

    imageToFetch = this._queue.shift();
    if(!!imageToFetch) {
      this.fetchImage(imageToFetch);
    }
  }

  checkIfshouldFetchNow(element) {
    this._queue.push(element);

    if(this._queue.length <= this.lines) {
      this.fetchImage(element);
    }
  }

  addImageToQueue(element) {
    if(this.beStupidAndFakeSlowness && (Math.random() > 0.66)) {
      element.setAttribute('lazy-status', 'fetching');
      setTimeout(() => {
        this.checkIfshouldFetchNow(element);
      }, 5500 * Math.random() + 2000);
    }
    else {
      console.log('asdasdads');
      this.checkIfshouldFetchNow(element);
    }
  }

  checkScroll() {
    if(this._throttler) return;

    this._throttler = setTimeout(() => {
        this._throttler = false;


      if(this.elements.length === 0) return;
      this.elements = this.elements.map((element) => {
        if(element === false) return false;

        if((element.getBoundingClientRect().top - this.offset)  < document.body.scrollTop) {
          this.addImageToQueue(element);
          return false;
        }

        else {
          return element
        }
      });

      this.elements = this.elements.filter((element) => { if(element) return element });
    }, this.throttle);

  }

  start() {
    if(!!this._listener) return;
    if(this.checkOnLoad) this.checkScroll();

    this.elements.map((element) => {
      if (!element.src || element.src === '') element.src = this._placeholderImages[Math.floor(Math.random() + 0.5)]
    });

    this._listener = document.addEventListener('scroll', (event) => {this.checkScroll()}, false);
  }
}
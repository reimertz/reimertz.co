//Creator Pierre Reimertz MIT ETC ETC

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      moveEvent = isMobile ? 'touchmove' : 'mousemove';

export default class Translater {

  constructor(element, xRotation, yRotation) {
    this.xRotation = xRotation;
    this.yRotation = yRotation;
    this.el = element;
    this.frame = false;
    this.throttler = false;
  }

  handleMove(clientX, clientY){
    let x = ((1 - (clientY / window.innerHeight)) * -1) * this.xRotation,
        y = (clientX / window.innerWidth) * this.yRotation;

    this.el.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  }

  start() {
    this.listener = document.body.addEventListener(moveEvent, (event) => {
      if(this.throttler) return;

      this.throttler = setTimeout(() => {

        this.throttler = false;
        requestAnimationFrame(() => {
          if(event.targetTouches) this.handleMove(event.targetTouches[0].clientX, event.targetTouches[0].clientY);
          else                    this.handleMove(event.clientX, event.clientY);
        });
      }, 50);

    });
  }

  stop() {
    document.body.removeEventListener(moveEvent, this.listener);
  };

  pause() {
    this.stop();
  };
}
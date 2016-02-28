import Writer from './modules/Writer';
import Translater from './modules/Translater';
import RickRolled from './modules/RickRolled';
import LazyLoader from './modules/LazyLoader';

const echo = require('echo-js')(document.body);
const introText = `hi, my name is piérre reimertz.

i am a humble developer@@@#########magician@@@########coder, designer, fake-it-til-you-make-it#######################entrepreneur and everyday hustler.
extremely addicted of building things.

$http://github.com/reimertz$github$ | $http://twitter.com/reimertz$twitter$ | $mailto:pierre.reimertz@gmail.com$hire me$ `;


const writer = new Writer(document.querySelectorAll('.writer'), introText);
const translater = new Translater(document.querySelector('main'), 10, 15);
const rr = new RickRolled(5000, true, document.querySelector('all-my-secret-api-keys'));
const ll = new LazyLoader({ lines: 5,
                            throttle: 500,
                            checkOnStart: false,
                            fakeSlowness: {
                              delayBeforeFetch: () => { return Math.random() * 3500 + 1000},
                              percentageOfImages: 0.3

                            }
                          });

requestAnimationFrame(function(){
  writer.start();
  translater.start();
  rr.start();
  ll.start();
});



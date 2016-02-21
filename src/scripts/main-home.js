import Writer from './modules/Writer';
import Translater from './modules/Translater';
import RickRolled from './modules/RickRolled';

const introText = `hi, my name is piérre reimertz.

i am a humble developer@@@#########magician@@@########coder, designer, fake-it-til-you-make-it#######################entrepreneur and everyday hustler.
extremely addicted of building things.

$http://github.com/reimertz$github$ | $http://twitter.com/reimertz$twitter$ | $mailto:pierre.reimertz@gmail.com$hire me$ `;

const writer = new Writer(document.querySelectorAll('.writer'), introText);
const translater = new Translater(document.querySelector('main'), 10, 15);
const rr = new RickRolled(3000, true, document.querySelector('all-my-secret-api-keys'));

requestAnimationFrame(function(){
  writer.start();
  translater.start();
  rr.start();
});



// import _ from 'lodash';
import printMe from './print.js';
import './style.css';
import QYC from './qyc.jpg';
import Data from './data.xml';
import { cube } from './math';
import { transform } from '@babel/core';

function component() {
  var el = document.createElement('div');
  var btn = document.createElement('button');
  // el.innerHTML = _.join(['hello', 'shenggao'], '');
  el.classList.add('hello');
  btn.innerHTML = 'Click me and check the consoles';
  btn.onclick = printMe;
  el.appendChild(btn);
  let qyc = new Image();
  qyc.src = QYC;
  el.appendChild(qyc);
  el.innerHTML = [
    'Hello webpack',
    '5 cubed is equed to ' + cube(5)
  ].join('\n\n');
  return el;
}

transform('() => {console.log(1);}', { code: true }, function(err, result) {
  console.log(result);
});

transform('code();', {}, function(err, result) {
  console.log(result);
});

if (module.hot) {
  module.hot.accept('./print.js', function() {
    console.log('Accepting the updated printMe module!!');
    printMe();
  });
}

document.body.appendChild(component());

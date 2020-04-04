const thingiverse = require('../node_modules/thingiverse-js');
const token = 'c29def8a6f2e80742780035a8bc2c42e';

// thingiverse('newest', { token }).then(res => {
// 	console.log(res);
// }).catch(err => {
//   console.log(err);
//   console.log(thingiverse.getError(err.response));
// });

thingiverse('search?name=covid&q=covid&type=things&sort=newest', {token}).then(res => {
    console.log(res.body);
}).catch(err => {
    console.log(err);
    console.log(thingiverse.getError(err.response));
});

const connect = require("./utils/connect");
const therapist = require("./functions/therapist");
const therapistOrder = require("./functions/therapistOrder");
const coupons = require("./functions/coupons");
const moment = require("moment");
var HTMLParser = require('node-html-parser');






// const root = HTMLParser.parse('<ul><li>English</li><li>Mandarin Chinese</li></ul>');

// console.log(root.querySelector('ul').childNodes);

// for (const iterator of root.querySelector('ul').childNodes) {
//     console.log(iterator.text);
// }



// const dateTimeString = moment.unix(1466760005).format("DD-MM-YYYY HH:mm:ss");

// const start_time = moment("1830", 'HHmm').format('hh:mm a');

// const end_time = moment("1930", 'HHmm').format('hh:mm a');


// console.log(start_time);
// console.log(end_time);

// therapistOrder();
therapist();
// coupons();
